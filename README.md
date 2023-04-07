# Run the application in development with:
> npm run dev 

## server should be running on: 
http://localhost:3000/

# Run just the pageScraper to test puppeteer script:
> node pageScraper.js



# On Docker:
> docker build . -t <YOUR_DOCKER_USERNAME>/puppeteer-on-koyeb
> docker push <YOUR_DOCKER_USERNAME>/puppeteer-on-koyeb
> docker run --publish 3000:3000 wrmacdonald/bas-pupp-docker 

# On Docker, run the express server, with /quotes running the pageScraper
> npm start
