
<p align="center"><img align="center" width="280" src="./.github/logo-dark.svg#gh-dark-mode-only"/></p>
<p align="center"><img align="center" width="280" src="./.github/logo-light.svg#gh-light-mode-only"/></p>
<p align="center">
  <img src="https://skillicons.dev/icons?i=react,vite,ts" />
  <br/>
  <a href="https://discord.movie-web.app"><kbd>🔵 discord</kbd></a> <a href="https://movie-web.app"><kbd>🟢 website</kbd></a>
</p>
<br/><br/>

# ⚡What is movie-web?

movie-web is a web app for watching movies easily. Check it out at <a href="https://movie-web.app"><kbd>movie-web.app</kbd></a>.

This service works by displaying video files from third-party providers inside an intuitive and aesthetic user interface.

# 🔥Features

- Automatic saving of progress - optionally synced to an account.
- Bookmark shows or movies, keep track of what you want to watch.
- Minimalistic interface that only shows whats required - no algorithm to consume you.

## 🍄 Philosophy

This project is meant to be simple and easy to use. Keep features minimal but polished.
We do not want this project to be yet another bulky streaming site, instead it aims for minimalism.

On top of that, hosting should be as cheap and simple as possible. Just a static website with a proxy, with an optional backend if you want cross-device syncing.

Content is fetched from third parties and scraping is fully done on the client. This means that the hoster has no files or media on their server. All files are streamed directly from the third parties.

## ⚠️ Limitations

- Due to being a static site, there can be no SSR
- To keep it cheap to host, amount of proxied requests need to be kept to a minimum
- Also to keep it cheap, no content must ever be streamed through the proxy. So only streams not protected by CORS headers.

# 🧬 Running locally for development

To run locally, you must first clone the repository. After that run the following commands in the root of the repository:
```bash
pnpm install
pnpm run dev
```

You have to also make an `.env` file to configure your environment. Inspire it from the content of `example.env`.

To build production files, run:
```bash
pnpm build
```

> [!TIP]
> You must use pnpm (`npm i -g pnpm`) and run NodeJS 20

# 🥔 Selfhosting

A simple guide has been written to assist in hosting your own instance of movie-web. Check it out below

|[Selfhosting guide](https://docs.movie-web.app)|
|---|

## 🤝 Thanks to all Contributors
This project would not be possible without our amazing contributors and the community. Thanks a lot! Keep rocking 🍻.

[![Contributors](https://contrib.rocks/image?repo=movie-web/movie-web)](https://github.com/movie-web/movie-web/graphs/contributors)

