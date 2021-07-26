import Fuse from 'fuse.js'
import JSON5 from 'json5'

const CORS_URL = `https://movie-web-proxy.herokuapp.com`;
const BASE_URL = `${CORS_URL}/https://lookmovie.io`;

async function findContent(searchTerm, type) {
    const searchUrl = `${BASE_URL}/${type}s/search/?q=${encodeURIComponent(searchTerm)}`;
    const searchRes = await fetch(searchUrl).then((d) => d.text());

    // Parse DOM to find search results on full search page
    const parser = new DOMParser();
    const doc = parser.parseFromString(searchRes, "text/html");
    const nodes = Array.from(doc.querySelectorAll('.movie-item-style-1'));
    const results = nodes.map(node => {
        return {
            type,
            title: node.querySelector('h6 a').innerText.trim(),
            year: node.querySelector('.year').innerText.trim(),
            slug: node.querySelector('a').href.split('/').pop(),
        }
    });

    const fuse = new Fuse(results, { threshold: 0.3, distance: 200, keys: ["title"] });
    const matchedResults = fuse
        .search(searchTerm.toString())
        .map((result) => result.item);

    if (matchedResults.length === 0) {
        return { options: [] }
    }

    if (matchedResults.length > 1) {
        const res = { options: [] };

        matchedResults.forEach((r) => res.options.push({
            title: r.title,
            slug: r.slug,
            type: r.type,
            year: r.year,
            source: 'lookmovie'
        }));

        return res;
    } else {
        const { title, slug, type, year } = matchedResults[0];

        return {
            options: [{ title, slug, type, year, source: 'lookmovie' }]
        }
    }
}
async function getVideoUrl(config) {
    const accessToken = await getAccessToken(config);
    const now = Math.floor(Date.now() / 1e3);

    let url = '';

    if (config.type === 'movie') {
        url = `${BASE_URL}/manifests/movies/json/${config.id}/${now}/${accessToken}/master.m3u8`;
    } else if (config.type === 'show') {
        url = `${BASE_URL}/manifests/shows/json/${accessToken}/${now}/${config.id}/master.m3u8`;
    }

    const videoOpts = await fetch(url).then((d) => d.json());

    // Find video URL and return it (with a check for a full url if needed)
    const opts = ["1080p", "1080", "720p", "720", "480p", "480", "auto"]

    let videoUrl = "";
    for (let res of opts) {
        if (videoOpts[res] && !videoOpts[res].includes('dummy') && !videoOpts[res].includes('earth-1984') && !videoUrl) {
            videoUrl = videoOpts[res]
        }
    }

    return videoUrl.startsWith("/") ? `${BASE_URL}${videoUrl}` : videoUrl;
}

async function getAccessToken(config) {
    let url = '';

    if (config.type === 'movie') {
        url = `${BASE_URL}/api/v1/security/movie-access?id_movie=${config.id}&token=1&sk=&step=1`;
    } else if (config.type === 'show') {
        url = `${BASE_URL}/api/v1/security/show-access?slug=${config.slug}&token=&step=2`;
    }

    const data = await fetch(url).then((d) => d.json());

    const token = data?.data?.accessToken;
    if (token) return token;

    return "Invalid type provided in config";
}

async function getEpisodes(slug) {
    const url = `${BASE_URL}/shows/view/${slug}`;
    const pageReq = await fetch(url).then((d) => d.text());

    const data = JSON5.parse("{" +
        pageReq
            .slice(pageReq.indexOf(`show_storage`))
            .split("};")[0]
            .split("= {")[1]
            .trim() +
        "}"
    );

    let seasons = [];
    let episodes = [];
    data.seasons.forEach((e) => {
        if (!seasons.includes(e.season))
            seasons.push(e.season);

        if (!episodes[e.season])
            episodes[e.season] = []
        episodes[e.season].push(e.episode)
    })

    return { seasons, episodes }
}

async function getStreamUrl(slug, type, season, episode) {
    const url = `${BASE_URL}/${type}s/view/${slug}`;
    const pageReq = await fetch(url).then((d) => d.text());

    const data = JSON5.parse("{" +
        pageReq
            .slice(pageReq.indexOf(`${type}_storage`))
            .split("};")[0]
            .split("= {")[1]
            .trim() +
        "}"
    );

    let id = '';

    if (type === "movie") {
        id = data.id_movie;
    } else if (type === "show") {
        const episodeObj = data.seasons.find((v) => { return v.season === season && v.episode === episode; });

        if (episodeObj) {
            id = episodeObj.id_episode;
        }
    }

    if (id === '') {
        return { url: '' }
    }

    const videoUrl = await getVideoUrl({
        slug: slug,
        id: id,
        type: type,
    });

    return { url: videoUrl }
}


const lookMovie = { findContent, getStreamUrl, getEpisodes };
export default lookMovie;