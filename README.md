<h1>movie-web</h1>

<p align="center">
<a href="https://github.com/movie-web/movie-web/actions"><img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/movie-web/movie-web/deploying.yml?branch=master&style=flat-square"></a>
<a href="https://github.com/movie-web/movie-web/blob/master/LICENSE.md"><img alt="GitHub license" src="https://img.shields.io/github/license/movie-web/movie-web?style=flat-square"></a>
<a href="https://github.com/movie-web/movie-web/network"><img alt="GitHub forks" src="https://img.shields.io/github/forks/movie-web/movie-web?style=flat-square"></a>
<a href="https://github.com/movie-web/movie-web/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/movie-web/movie-web?style=flat-square"></a><br/>
<a href="https://discord.movie-web.app"><img src="https://discord.com/api/guilds/871713465100816424/widget.png?style=banner2" alt="Discord Server"></a>
</p>

movie-web is a web app for watching movies easily. Check it out at **[movie-web.app](https://movie-web.app)**.

This service works by displaying video files from third-party providers inside an intuitive and aesthetic user interface.

Features include:

- 🕑 Saving of your progress so you can come back to a video at any time!
- 🔖 Bookmarks to keep track of videos you would like to watch.
- 🎞️ Easy switching between seasons and episodes for a TV series; binge away!
- ✖️ Supports multiple types of content including movies, TV shows and Anime (coming soon™️)

## Goals of movie-web

- No ads
- No BS: just a search bar and a video player
- No responsibility on the hoster, no databases or api's hosted by us, just a static site

## Self-hosting

A simple guide has been written to assist in hosting your own instance of movie-web.

Check it out here: [https://github.com/movie-web/movie-web/blob/dev/SELFHOSTING.md](https://github.com/movie-web/movie-web/blob/dev/SELFHOSTING.md)

## Running locally for development

To run this project locally for contributing or testing, run the following commands:
<h5><b>note: must use yarn to install packages and run NodeJS 16</b></h5>

```bash
git clone https://github.com/movie-web/movie-web
cd movie-web
yarn install
yarn dev
```

To build production files, simply run `yarn build`.

You'll need to deploy a cloudflare service worker as well. Check the [selfhosting guide](https://github.com/movie-web/movie-web/blob/dev/SELFHOSTING.md) on how to run the service worker. Afterwards you can make a `.env` file and put in the URL. (see `example.env` for an example)

<h2>Contributing - <a href="https://github.com/movie-web/movie-web/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/movie-web/movie-web?style=flat-square"></a>
<a href="https://github.com/movie-web/movie-web/pulls"><img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/movie-web/movie-web?style=flat-square"></a></h2>

Check out [this project's issues](https://github.com/movie-web/movie-web/issues) for inspiration for contribution. Pull requests are always welcome.

**All pull requests must be merged into the `dev` branch. it will then be deployed with the next version**

## Credits

This project would not be possible without our amazing contributors and the community.

<a href="https://github.com/movie-web/movie-web/graphs/contributors"><img alt="GitHub contributors" src="https://img.shields.io/github/contributors/movie-web/movie-web?style=flat-square"></a>

<div style="display:flex;align-items:center;grid-gap:10px">
<img src="https://github.com/JamesHawkinss.png?size=20" width="20"><span><a href="https://github.com/JamesHawkinss">@JamesHawkinss</a> for original concept.</span>
</div>

<div style="display:flex;align-items:center;grid-gap:10px">
<img src="https://github.com/JipFr.png?size=20" width="20"><span><a href="https://github.com/JipFr">@JipFr</a> for initial work on <a href="https://github.com/JipFr/movie-cli">movie-cli</a>.</span>
</div>

<div style="display:flex;align-items:center;grid-gap:10px">
<img src="https://github.com/mrjvs.png?size=20" width="20"><span><a href="https://github.com/mrjvs">@mrjvs</a> for leading the port to React, and for the beautiful design.</span>
</div>

<div style="display:flex;align-items:center;grid-gap:10px">
<img src="https://github.com/binaryoverload.png?size=20" width="20"><span><a href="https://github.com/binaryoverload">@binaryoverload</a> for help rewriting the application into React and making the README look ✨ pretty ✨.</span>
</div>

<div style="display:flex;align-items:center;grid-gap:10px">
<img src="https://github.com/lem6ns.png?size=20" width="20"><span><a href="https://github.com/lem6ns">@lem6ns</a> for helpfully implementing extra scrapers.</span>
</div> 
