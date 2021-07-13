function getCorsUrl(url) {
    return `https://hidden-inlet-27205.herokuapp.com/${url}`;
}

async function getVideoUrl(config) {
    const accessToken = await getAccessToken(config);
    const now = Math.floor(Date.now() / 1e3);

    let url = getCorsUrl(`https://lookmovie.io/manifests/movies/json/${config.movieId}/${now}/${accessToken}/master.m3u8`);

    if (url) {
        const videoOpts = await fetch(url).then((d) => d.json());

        // Find video URL and return it (with a check for a full url if needed)
        const opts = ["1080p", "1080", "720p", "720", "480p", "480", "auto"]

        let videoUrl = "";
        for (let res of opts) {
            if (videoOpts[res] && !videoOpts[res].includes('dummy') && !videoOpts[res].includes('earth-1984') && !videoUrl) {
                videoUrl = videoOpts[res]
            }
        }

        return videoUrl.startsWith("/") ? getCorsUrl(`https://lookmovie.io/${videoUrl}`) : getCorsUrl(videoUrl);
    }

    return "Invalid type.";
}

async function getAccessToken(config) {
    let url = getCorsUrl(`https://lookmovie.io/api/v1/security/movie-access?id_movie=${config.movieId}&token=1&sk=&step=1`);

    const data = await fetch(url).then((d) => d.json());

    const token = data?.data?.accessToken;
    if (token) return token;

    return "Invalid type provided in config";
}

async function findMovie() {
    const searchTerm = document.getElementById('search').value;

    sendMessage('info', `Searching for "${searchTerm}"`)

    const searchUrl = getCorsUrl(`https://lookmovie.io/api/v1/movies/search/?q=${encodeURIComponent(searchTerm)}`);
    const searchRes = await fetch(searchUrl).then((d) => d.json());
    let results = [ ...searchRes.result.map((v) => ({ ...v, type: "movie" })) ];

    const fuse = new Fuse(results, { threshold: 0.3, distance: 200, keys: ["title"] });
    const matchedResults = fuse
        .search(searchTerm.toString())
        .map((result) => result.item);

    let toShow;
    if (matchedResults.length > 1) {
        const response = window.prompt(`Pick a movie from:\n${matchedResults.map((i, v) => `${v}) ${i.title}`).join('\n')}`, 'Enter number');
        toShow = matchedResults[response];
    } else {
        toShow = matchedResults[0];
    }

    if (!toShow) {
        sendMessage('error', 'Unable to find that, sorry!')
        return;
    }

    sendMessage('info', `Scraping the ${toShow.type} "${toShow.title}"`)

    const url = getCorsUrl(`https://lookmovie.io/${toShow.type}s/view/${toShow.slug}`);
    const pageReq = await fetch(url).then((d) => d.text());

    const data = JSON5.parse("{" +
        pageReq
            .slice(pageReq.indexOf(`${toShow.type}_storage`))
            .split("};")[0]
            .split("= {")[1]
            .trim() +
        "}"
    );

    const videoUrl = await getVideoUrl({
        slug: toShow.slug,
        movieId: data.id_movie,
        type: "movie",
    });

    sendMessage('info', `Streaming "${toShow.title}"`)
    streamVideo(videoUrl)
}

function sendMessage(type, message) {
    if (!['info', 'error'].includes(type)) return;
    document.getElementById(type).innerHTML += `${message}<br>`;
}

function streamVideo(url) {
    var video = document.getElementById('video');

    if (Hls.isSupported()) {
        var video = document.getElementById('video');
        var hls = new Hls();
        hls.attachMedia(video);
        hls.loadSource(url);
    }
}