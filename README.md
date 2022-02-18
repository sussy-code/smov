# movie-web

Small web app for watching movies easily. Check it out at **[movie.squeezebox.dev](https://movie.squeezebox.dev)**.

**[Join the Discord community](https://discord.gg/vXsRvye8BS)**

## Credits

- Thanks to [@JipFr](https://github.com/JipFr) for initial work on [movie-cli](https://github.com/JipFr/movie-cli)
- Thanks to [@mrjvs](https://github.com/mrjvs) for help porting to React, and for the beautiful design
- Thanks to [@JoshHeng](https://github.com/JoshHeng/) for the Cloudflare CORS Proxy and URL routing

## Installation

To run this project locally for contributing or testing, run the following commands:

```
git clone https://github.com/JamesHawkinss/movie-web
cd movie-web
yarn install
yarn start
```

To build production files, simply run `yarn build`.

## Environment

- `REACT_APP_CORS_PROXY_URL` - The Cloudflare CORS Proxy, will be something like `https://PROXY.workers.dev?destination=`

## Contributing

Check out [this project's issues](https://github.com/JamesHawkinss/movie-web/issues) for inspiration for contribution. Pull requests are always welcome.

## Rewrite TODO's

- [x] Better provider errors (only fail if all failed, show individual fails somewhere)
- [x] Better search suffix view
- [x] Add back link of results view
- [x] Add results list end
- [ ] Add Brand tag top left
- [ ] Add github and discord top right
- [x] Store watched percentage
- [ ] Implement movie + series view
- [ ] Add provider stream method
- [x] Better looking error boundary
- [ ] sort search results so they aren't sorted by provider
- [ ] Get rid of react warnings
- [ ] Link Github and Discord in error boundary

## Todo's overall

- [ ] Less spaghetti versioned storage (typesafe and works functionally)
