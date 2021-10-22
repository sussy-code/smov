import Fuse from 'fuse.js'
import JSON5 from 'json5'

const BASE_URL = `https://lookmovie.io`;
const CORS_URL = `${process.env.REACT_APP_CORS_PROXY_URL}${BASE_URL}`;
let phpsessid;

async function findContent(searchTerm, type) {
    try {
        const searchUrl = `${CORS_URL}/${type}s/search/?q=${encodeURIComponent(searchTerm)}`;
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
    } catch (e) {
        return { options: [] }
    }
}
async function getVideoUrl(config) {
    let url = '';

    if (config.type === 'movie') {
        url = `${CORS_URL}/api/v1/security/movie-access?id_movie=${config.id}&token=1&sk=&step=1`;
    } else if (config.type === 'show') {
        url = `${CORS_URL}/api/v1/security/episode-access?id_episode=${config.id}`;
    }

    const data = await fetch(url, {
        headers: { phpsessid },
    }).then((d) => d.json());

    const subs = data?.subtitles.filter((sub) => {
        if (typeof sub.file === 'object') return false;
        return true;
    })

    // Find video URL and return it (with a check for a full url if needed)
    const opts = ["1080p", "1080", "720p", "720", "480p", "480", "auto"];

    let videoUrl = "";
    for (let res of opts) {
        if (data.streams[res] && !data.streams[res].includes('dummy') && !data.streams[res].includes('earth-1984') && !videoUrl) {
            videoUrl = data.streams[res]
        }
    }

    return {
        videoUrl: videoUrl.startsWith("/") ? `${BASE_URL}${videoUrl}` : videoUrl, 
        subs: subs, 
    };
}

async function getEpisodes(slug) {
    const url = `${CORS_URL}/shows/view/${slug}`;
    const pageReq = await fetch(url, {
        headers: { phpsessid },
    }).then((d) => d.text());

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
    const url = `${CORS_URL}/${type}s/view/${slug}`;
    const pageRes = await fetch(url);
    if (pageRes.headers.get('phpsessid')) phpsessid = pageRes.headers.get('phpsessid');
    const pageResText = await pageRes.text();

    const data = JSON5.parse("{" +
        pageResText
            .slice(pageResText.indexOf(`${type}_storage`))
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

    return { url: videoUrl.videoUrl, subtitles: videoUrl.subs };
}


const lookMovie = { findContent, getStreamUrl, getEpisodes };
export default lookMovie;
