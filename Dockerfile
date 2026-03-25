# =============================================================================
# Stage 1: Build
# =============================================================================
FROM node:20-alpine AS build

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# =============================================================================
# Stage 2: Run
# =============================================================================
FROM node:20-alpine AS run

RUN apk add --no-cache su-exec python3 make g++

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production \
	&& yarn cache clean \
	&& apk del python3 make g++

COPY --from=build /app/build ./build
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh && mkdir -p /app/data

EXPOSE 3000

ENV NODE_ENV=production

ENTRYPOINT ["/entrypoint.sh"]
