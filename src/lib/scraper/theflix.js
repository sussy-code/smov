const BASE_URL = `${process.env.REACT_APP_CORS_PROXY_URL}https://www.theflix.to`;

async function findContent(searchTerm, type) {
    try {
        const term = searchTerm.toLowerCase()
        const tmdbRes = await fetch(`${process.env.REACT_APP_CORS_PROXY_URL}https://www.themoviedb.org/search/${type === 'show' ? 'tv' : type}?query=${term}`).then(d => d.text());

        const doc = new DOMParser().parseFromString(tmdbRes, 'text/html');
        const nodes = Array.from(doc.querySelectorAll('div.results > div > div.wrapper'));
        const results = nodes.slice(0, 10).map((node) => {
            let type = node.querySelector('div.details > div.wrapper > div.title > div > a').getAttribute('data-media-type');
            type = type === 'tv' ? 'show' : type;

            let title;
            let year;
            let slug;

            if (type === 'movie') {
                try {
                    title = node.querySelector('div.details > div.wrapper > div.title > div > a').textContent;
                    year = node.querySelector('div.details > div.wrapper > div.title > span').textContent.trim().split(' ')[2];
                    slug = node.querySelector('div.details > div.wrapper > div.title > div > a').getAttribute('href').split('/')[2];
                } catch (e) {
                    // eslint-disable-next-line array-callback-return
                    return;
                }
            } else if (type === 'show') {
                try {
                    title = node.querySelector('div.details > div.wrapper > div.title > div > a > h2').textContent;
                    year = node.querySelector('div.details > div.wrapper > div.title > span').textContent.trim().split(' ')[2];
                    slug = node.querySelector('div.details > div.wrapper > div.title > div > a').getAttribute('href').split('/')[2];
                } catch (e) {
                    // eslint-disable-next-line array-callback-return
                    return;
                }
            }

            return {
                type: type,
                title: title,
                year: year,
                slug: slug + '-' + title.replace(/[^a-z0-9]+|\s+/gmi, " ").replace(/\s+/g, '-').toLowerCase(),
                source: 'theflix'
            }
        });

        if (results.length > 1) {
            return { options: results };
        } else {
            return { options: [ results[0] ] }
        }
    } catch (err) {
        console.error(err);
        throw new Error(err)
    }
}

async function getEpisodes(slug) {
    const tmdbRes = await fetch(`${process.env.REACT_APP_CORS_PROXY_URL}https://www.themoviedb.org/tv/${slug}/seasons`).then(d => d.text());
    const sNodes = Array.from(new DOMParser().parseFromString(tmdbRes, 'text/html').querySelectorAll('div.column_wrapper > div.flex > div'));

    let seasons = [];
    let episodes = [];

    for (let s of sNodes) {
        const text = s.querySelector('div > section > div > div > div > h2 > a').textContent;
        if (!text.includes('Season')) continue;

        const season = text.split(' ')[1];

        if (!seasons.includes(season)) {
            seasons.push(season);
        }

        if (!episodes[season]) {
            episodes[season] = [];
        }
        
        const epRes = await fetch(`${process.env.REACT_APP_CORS_PROXY_URL}https://www.themoviedb.org/tv/${slug}/season/${season}`).then(d => d.text());
        const epNodes = Array.from(new DOMParser().parseFromString(epRes, 'text/html').querySelectorAll('div.episode_list > div.card'));
        epNodes.forEach((e, i) => episodes[season].push(++i));
    }
    
    return { seasons, episodes };
}

async function getStreamUrl(slug, type, season, episode) {
    const res = await fetch(`${BASE_URL}/${type === 'show' ? 'tv-show' : type}/${slug}/${type === 'show' ? `season-${season}/episode-${episode}` : ""}${ type === 'movie' ? '?movieInfo=' + slug : '' }`).then(d => d.text());

    const scripts = Array.from(new DOMParser().parseFromString(res, "text/html").querySelectorAll('script'));
    const prop = scripts.find((e) => e.textContent.includes("theflixvd.b-cdn"));

    if (prop) {
        const data = JSON.parse(prop.textContent);
        return { url: data.props.pageProps.videoUrl };
    }

    return { url: '' }
}

const theflix = { findContent, getStreamUrl, getEpisodes }
export default theflix;
