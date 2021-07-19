const CORS_URL = 'https://hidden-inlet-27205.herokuapp.com/';
const BASE_URL = `${CORS_URL}https://gomo.to`;
const MOVIE_URL = `${BASE_URL}/movie`
const DECODING_URL = `${BASE_URL}/decoding_v3.php`

async function findContent(searchTerm, type) {
    try {
        if (type !== 'movie') return;

        const term = searchTerm.toLowerCase()
        const imdbRes = await fetch(`${CORS_URL}https://v2.sg.media-imdb.com/suggestion/${term.slice(0, 1)}/${term}.json`).then(d => d.json())
        const movieId = imdbRes.d[0]?.id
        if(!movieId) {
            return;
        }
        console.log(imdbRes, movieId)

        // Get stream to go with IMDB ID
        const site1 = await fetch(`${MOVIE_URL}/${movieId}`).then((d) => d.text());

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

        console.log(src);
        const embedUrl = src.find(url => url.includes('gomo.to'));
        const site2 = await fetch(`${CORS_URL}${embedUrl}`).then((d) => d.text());
    } catch (err) {
        console.log(err);
        throw new Error(err)
    }
}

export { findContent }