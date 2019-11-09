## How to build
```
npm install
npm run build:prod
```
open [index.html](./dist/) in your browser after build success

## Important
- Sometime the api will fail because the user account is reach the limit.
Please change the account name in [geonames-services.js](./src/geonames-services.js) and rebuild again.
- Set ```isServeOnHttps = true;``` in [geonames-services.js](./src/geonames-services.js) if you serve the page on https.