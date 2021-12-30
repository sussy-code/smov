const BASE_URL = `${process.env.REACT_APP_CORS_PROXY_URL}https://www.theflix.to`;

async function findContent(searchTerm, type) {
    try {
        if (type !== 'movie') return;

        const term = searchTerm.toLowerCase()
        const tmdbRes = await fetch(`${process.env.REACT_APP_CORS_PROXY_URL}https://www.themoviedb.org/search?query=${term}`).then(d => d.text());

        const doc = new DOMParser().parseFromString(tmdbRes, 'text/html');
        const nodes = Array.from(doc.querySelectorAll('div.results > div > div.wrapper'));
        const results = nodes.slice(0, 10).map((node) => {
            let type = node.querySelector('div.details > div.wrapper > div.title > div > a').getAttribute('data-media-type');
            switch (type) {
                case 'movie':
                    type = 'movie';
                    break;
                case 'tv':
                    type = 'show';
                    // eslint-disable-next-line array-callback-return
                    return;
                case 'collection':
                    // eslint-disable-next-line array-callback-return
                    return;
                default:
                    break;
            }

            const title = node.querySelector('div.details > div.wrapper > div.title > div > a').textContent;
            const year = node.querySelector('div.details > div.wrapper > div.title > span').textContent.trim().split(' ')[2];
            const slug = node.querySelector('div.details > div.wrapper > div.title > div > a').getAttribute('href').split('/')[2];

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

async function getStreamUrl(slug, type, season, episode) {
    if (type !== 'movie') return;

    const res = await fetch(`${BASE_URL}/${type}/${slug}?movieInfo=${slug}`).then(d => d.text());

    const scripts = Array.from(new DOMParser().parseFromString(res, "text/html").querySelectorAll('script'));
    const prop = scripts.find((e) => e.textContent.includes("theflixvd.b-cdn"));

    if (prop) {
        const data = JSON.parse(prop.textContent);
        return { url: data.props.pageProps.videoUrl };
    }

    return { url: '' }
}

const theflix = { findContent, getStreamUrl }
export default theflix;