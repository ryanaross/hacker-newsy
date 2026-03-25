+ update dependencies. 
+ track read articles. when article clicked, mark read and dim. we will need a lightweight DB for this.
+ highlight articles that match a certain pattern in name or description. this configuration should be handled on an settings page. no password needed, this is a single user application
+ swipe to save external article URLs to a simple text file list. swipe other way to remove. mark articles that have been saved.
+ Makefile with "make dev" local test on different port, "make clean" cleanup everything including docker images
+ example docker compose file (with .example in filename)
+ keep README updated with changes
+ Make new doc to help guide an AI to upgrade to this new version which now needs backend.
+ support environment variables like
        - PUID=1001
        - PGID=1001
        - DEBUG=false
        - TZ=America/Los_Angeles
+ add loads of tests so that AI can run the test suite and prevent regressions after every change.
+ favor server side logging in all instances so that AI can read it and fix things.
+ create AGENTS.md for future help of AI agents.