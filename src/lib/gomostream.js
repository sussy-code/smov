import { unpack } from './util/unpacker';

const CORS_URL = 'https://hidden-inlet-27205.herokuapp.com/';
const BASE_URL = `${CORS_URL}https://gomo.to`;
const MOVIE_URL = `${BASE_URL}/movie`
const DECODING_URL = `${BASE_URL}/decoding_v3.php`

async function findContent(searchTerm, type) {
    try {
        if (type !== 'movie') return;

        const term = searchTerm.toLowerCase()
        const imdbRes = await fetch(`${CORS_URL}https://v2.sg.media-imdb.com/suggestion/${term.slice(0, 1)}/${term}.json`).then(d => d.json())
        
        const results = [];
        imdbRes.d.forEach((e) => {
            if (!e.id.startsWith('tt')) return;

            results.push({
                title: e.l,
                slug: e.id,
                type: 'movie',
                year: e.y,
                source: 'gomostream'
            })
        });

        if (results.length > 1) {
            return { options: results };
        } else {
            return { options: [ { ...results[0], source: 'gomostream' } ] }
        }
    } catch (err) {
        console.error(err);
        throw new Error(err)
    }
}

async function getStreamUrl(slug, type, season, episode) {
    if (type !== 'movie') return;

    // Get stream to go with IMDB ID
    const site1 = await fetch(`${MOVIE_URL}/${slug}`).then((d) => d.text());

    if (site1 === "Movie not available.")
        return { url: '' };

    const tc = site1.match(/var tc = '(.+)';/)?.[1]
    const _token = site1.match(/"_token": "(.+)",/)?.[1]

    const fd = new FormData()
    fd.append('tokenCode', tc)
    fd.append('_token', _token)

    const src = await fetch(DECODING_URL, {
        method: "POST",
        body: fd,
        headers: { 
            'x-token': tc.slice(5, 13).split("").reverse().join("") + "13574199" 
        }
    }).then((d) => d.json());

    const embedUrl = src.find(url => url.includes('gomo.to'));
    const site2 = await fetch(`${CORS_URL}${embedUrl}`).then((d) => d.text());

    const parser = new DOMParser();
    const site2Dom = parser.parseFromString(site2, "text/html");
    const script = site2Dom.querySelectorAll("script")[8].innerHTML;
    
    let unpacked = unpack(script).split('');
    unpacked.splice(0, 43);
    let index = unpacked.findIndex((e) => e === '"');
    const url = unpacked.slice(0, index).join('');

    return { url }
}

const gomostream = { findContent, getStreamUrl }
export default gomostream;