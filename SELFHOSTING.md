# Selfhosting tutorial

> **Note:** We do not provide support on how to selfhost, if you cant figure it out then tough luck. Please do not make Github issues or ask in our Discord server for support on how to selfhost.

So you wanna selfhost. This app is made of two parts:
 - The proxy
 - The client

## Hosting the proxy

The proxy is made as a cloudflare worker, cloudflare has a generous free plan, so you don't need to pay anything unless you get hundreds of users.

1. Create a cloudflare account at [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. Navigate to `Workers`.
3. If it asks you, choose a subdomain
4. If it asks for a workers plan, press "Continue with free"
5. Create a new service with a name of your choice. Must be type `HTTP handler`
6. On the service page, Click `Quick edit`
7. Download the `worker.js` file from the latest release of the proxy: [https://github.com/movie-web/simple-proxy/releases/latest](https://github.com/movie-web/simple-proxy/releases/latest)
8. Open the downloaded `worker.js` file in notepad, VScode or similar.
9. Copy the text contents of the `worker.js` file.
10. Paste the text contents into the edit screen of the cloudflare service worker.
11. Click `Save and deploy` and confirm.

Your proxy is now hosted on cloudflare. Note the url of your worker. you will need it later.

## Hosting the client

1. Download the file `movie-web.zip` from the latest release: [https://github.com/movie-web/movie-web/releases/latest](https://github.com/movie-web/movie-web/releases/latest)
2. Extract the zip file so you can edit the files.
3. Open `config.js` in notepad, VScode or similar.
4. Put your cloudflare proxy URL inbetween the double qoutes of `VITE_CORS_PROXY_URL: "",`. Make sure to not have a slash at the end of your URL.

   Example (THIS IS MINE, IT WONT WORK FOR YOU): `VITE_CORS_PROXY_URL: "https://test-proxy.test.workers.dev",`
5. Save the file

Your client has been prepared, you can now host it on any webhost.
It doesn't require php, its just a standard static page.
