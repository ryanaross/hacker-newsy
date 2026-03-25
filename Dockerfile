# =============================================================================
# Stage 1: Build
# =============================================================================
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# =============================================================================
# Stage 2: Run
# =============================================================================
FROM node:20-alpine AS run

WORKDIR /app

COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "build/index.js"]
