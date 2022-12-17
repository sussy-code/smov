<h1>movie-web</h1>

<p align="center">
<a href="https://github.com/JamesHawkinss/movie-web/actions"><img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/JamesHawkinss/movie-web/.github/workflows/deploying.yml?branch=master&style=flat-square"></a>
<a href="https://github.com/JamesHawkinss/movie-web/blob/master/LICENSE.md"><img alt="GitHub license" src="https://img.shields.io/github/license/JamesHawkinss/movie-web?style=flat-square"></a>
<a href="https://github.com/JamesHawkinss/movie-web/network"><img alt="GitHub forks" src="https://img.shields.io/github/forks/JamesHawkinss/movie-web?style=flat-square"></a>
<a href="https://github.com/JamesHawkinss/movie-web/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/JamesHawkinss/movie-web?style=flat-square"></a><br/>
<a href="https://discord.gg/vXsRvye8BS"><img src="https://discordapp.com/api/guilds/871713465100816424/widget.png?style=banner2" alt="Discord Server"></a>
</p>

movie-web is a web app for watching movies easily. Check it out at **[movie.squeezebox.dev](https://movie.squeezebox.dev)**.

This service works by displaying video files from third-party providers inside an intuitive and aesthic user interface.

Features include:

- 🕑 Saving of your progress so you can come back to a video at any time!
- 🔖 Bookmarks to keep track of videos you would like to watch.
- 🎞️ Easy switching between seasons and episodes for a TV series; binge away!
- ✖️ Supports multiple types of content including movies, TV shows and Anime (coming soon™️)

## Goals of movie-web

- No ads
- No BS: just a search bar and a video player
- No responsibility on the hoster, no databases or api's hosted by us, just a static site

## Self-hosting / running locally

To run this project locally for contributing or testing, run the following commands:
<h5><b>note: must use yarn to install packages and run NodeJS 16</b></h5>

```bash
git clone https://github.com/JamesHawkinss/movie-web
cd movie-web
yarn install
yarn start
```

To build production files, simply run `yarn build`.

You can also deploy the Cloudflare Worker (in worker.js) and update the proxy URL constant in `/src/mw-constants.ts`.

<h2>Contributing - <a href="https://github.com/JamesHawkinss/movie-web/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/JamesHawkinss/movie-web?style=flat-square"></a>
<a href="https://github.com/JamesHawkinss/movie-web/pulls"><img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/JamesHawkinss/movie-web?style=flat-square"></a></h2>

Check out [this project's issues](https://github.com/JamesHawkinss/movie-web/issues) for inspiration for contribution. Pull requests are always welcome.

**All pull requests must be merged into the `dev` branch. it will then be deployed with the next version**

## Credits

This project would not be possible without our amazing contributors and the community.

<a href="https://github.com/JamesHawkinss/movie-web/graphs/contributors"><img alt="GitHub contributors" src="https://img.shields.io/github/contributors/JamesHawkinss/movie-web?style=flat-square"></a>

<div style="display:flex;align-items:center;grid-gap:10px">
<img src="https://github.com/JipFr.png?size=20" width="20"><span><a href="https://github.com/JipFr">@JipFr</a> for initial work on <a href="https://github.com/JipFr/movie-cli">movie-cli</a>.</span>
</div>

<div style="display:flex;align-items:center;grid-gap:10px">
<img src="https://github.com/mrjvs.png?size=20" width="20"><span><a href="https://github.com/mrjvs">@mrjvs</a> for leading the port to React, and for the beautiful design.</span>
</div>

<div style="display:flex;align-items:center;grid-gap:10px">
<img src="https://github.com/JoshHeng.png?size=20" width="20"><span><a href="https://github.com/JoshHeng">@JoshHeng</a> for the Cloudflare CORS Proxy and URL routing.</span>
</div>

<div style="display:flex;align-items:center;grid-gap:10px">
<img src="https://github.com/binaryoverload.png?size=20" width="20"><span><a href="https://github.com/binaryoverload">@binaryoverload</a> for help rewriting the application into React and making the README look ✨ pretty ✨.</span>
</div>

<div style="display:flex;align-items:center;grid-gap:10px">
<img src="https://github.com/lem6ns.png?size=20" width="20"><span><a href="https://github.com/lem6ns">@lem6ns</a> for helpfully implementing extra scrapers.</span>
</div>
