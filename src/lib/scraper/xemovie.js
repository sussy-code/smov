const BASE_URL = `${process.env.REACT_APP_CORS_PROXY_URL}https://xemovie.co`;

async function findContent(searchTerm, type) {
    try {
        let results;

        const searchUrl = `${BASE_URL}/search?q=${encodeURIComponent(searchTerm)}`;
        const searchRes = await fetch(searchUrl).then((d) => d.text());

        const parser = new DOMParser();
        const doc = parser.parseFromString(searchRes, "text/html");
        switch (type) {
            case 'show':
                // const showContainer = doc.querySelectorAll(".py-10")[1].querySelector(".grid");
                // const showNodes = [...showContainer.querySelectorAll("a")].filter(link => !link.className);
                // results = showNodes.map(node => {
                //     node = node.parentElement
                //     return {
                //         type,
                //         title: [...new Set(node.innerText.split("\n"))][1].split("(")[0].trim(),
                //         year: [...new Set(node.innerText.split("\n"))][3],
                //         slug: node.querySelector("a").href.split('/').pop(),
                //         source: "xemovie"
                //     }
                // })
                // break;
                return { options: [] };
            case 'movie':
                const movieContainer = doc.querySelectorAll(".py-10")[0].querySelector(".grid");
                const movieNodes = [...movieContainer.querySelectorAll("a")].filter(link => !link.className);
                results = movieNodes.map(node => {
                    node = node.parentElement
                    return {
                        type,
                        title: [...new Set(node.innerText.split("\n"))][1].split("(")[0].trim(),
                        year: [...new Set(node.innerText.split("\n"))][3],
                        slug: node.querySelector("a").href.split('/').pop(),
                        source: "xemovie"
                    }
                })
                break;
            default:
                results = [];
                break;
        }

        return { options: results };
    } catch {
        return { options: [] };
    }
}

async function getStreamUrl(slug, type, season, episode) {
    let url;

    if (type === "show") {

    } else {
        url = `${BASE_URL}/movies/${slug}/watch`;
    }

    let mediaUrl = "";
    let subtitles = [];

    const res = await fetch(url).then(d => d.text());
    const DOM = new DOMParser().parseFromString(res, "text/html");

    for (const script of DOM.scripts) {
        if (script.textContent.match(/https:\/\/s[0-9]\.xemovie\.com/)) {
            // eslint-disable-next-line
            let data = JSON.parse(JSON.stringify(eval(`(${script.textContent.replace("const data = ", "").split("};")[0]}})`)));
            // eslint-disable-next-line
            mediaUrl = data.playlist[0].file;
            // eslint-disable-next-line
            for (const subtitleTrack of data.playlist[0].tracks) {
                const subtitleBlob = URL.createObjectURL(await fetch(`${process.env.REACT_APP_CORS_PROXY_URL}${subtitleTrack.file}`).then(res => res.blob())); // do this so no need for CORS errors
                subtitles.push({
                    file: subtitleBlob,
                    language: subtitleTrack.label
                })
            }
        }
    }
    return { url: mediaUrl, subtitles: subtitles }
}

async function getEpisodes(slug) {

}

const xemovie = { findContent, getStreamUrl, getEpisodes }
export default xemovie;