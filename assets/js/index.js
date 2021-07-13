const cfg = {
    base: "https://hidden-inlet-27205.herokuapp.com/https://lookmovie.io"
}

async function getVideoUrl(config) {
    const accessToken = await getAccessToken(config);
    const now = Math.floor(Date.now() / 1e3);

    let url = null;

    if (config.type === "tv") {
        url = `${cfg.base}/manifests/shows/json/${accessToken}/${now}/${config.episodeId}/master.m3u8`;
    } else if (config.type === "movie") {
        url = `${cfg.base}/manifests/movies/json/${config.movieId}/${now}/${accessToken}/master.m3u8`;
    }

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

        return videoUrl.startsWith("/") ? `${cfg.base}${videoUrl}` : videoUrl;
    }

    return "Invalid type.";
}

async function getAccessToken(config) {
    let url = "";

    if (config.type === "tv") {
        // 'mbQFYTR499c9vfDmAwOFrg' // Retrieved from: https://lookmovie.io/api/v1/security/show-access?slug=1839578-person-of-interest-2011&token=&step=2
        url = `${cfg.base}/api/v1/security/show-access?slug=${config.slug}&token=&step=2`;
    } else if (config.type === "movie") {
        // https://lookmovie.io/api/v1/security/movie-access?id_movie=14358&token=1&sk=&step=1
        url = `${cfg.base}/api/v1/security/movie-access?id_movie=${config.movieId}&token=1&sk=&step=1`;
    }

    const data = await fetch(url).then((d) => d.json());

    const token = data?.data?.accessToken;
    if (token) return token;

    return "Invalid type provided in config";
}

async function findMovie() {
    const searchTerm = document.getElementById('search').value;

    const movieSearchRes = await fetch(
        `https://hidden-inlet-27205.herokuapp.com/https://lookmovie.io/api/v1/movies/search/?q=${encodeURIComponent(
            searchTerm
        )}`
    ).then((d) => d.json());
    const showSearchRes = await fetch(
        `https://hidden-inlet-27205.herokuapp.com/https://lookmovie.io/api/v1/shows/search/?q=${encodeURIComponent(
            searchTerm
        )}`
    ).then((d) => d.json());

    let results = [
        ...movieSearchRes.result.map((v) => ({ ...v, type: "movie" })),
        ...showSearchRes.result.map((v) => ({ ...v, type: "show" })),
    ];

    const fuse = new Fuse(results, {
        threshold: 0.3,
        distance: 200,
        keys: ["title"],
    });
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
        document.getElementById('error').innerHTML = 'Unable to find that, sorry!'
        return;
    }

    console.log(`Scraping the ${toShow.type} "${toShow.title}"`);

    // ! Now we get the ID and stuff we need
    const url = `https://hidden-inlet-27205.herokuapp.com/https://lookmovie.io/${toShow.type}s/view/${toShow.slug}`;
    const pageReq = await fetch(url).then((d) => d.text());

    // Extract and parse JSON
    let scriptJson =
        "{" +
        pageReq
            .slice(pageReq.indexOf(`${toShow.type}_storage`))
            .split("};")[0]
            .split("= {")[1]
            .trim() +
        "}";

    const data = JSON5.parse(scriptJson);

    // Find the relevant id
    let id = null;
    let relevantEpisode;
    if (toShow.type === "movie") {
        id = data.id_movie;
    } else if (toShow.type === "show") {
        const episodeObj = data.seasons.find((v) => {
            return v.season == season && v.episode == episode;
        });
        if (episodeObj) {
            console.log(
                `Finding streams for ${toShow.title} ${season}x${episode}: ${episodeObj.title}`
            );
            id = episodeObj.id_episode;
            relevantEpisode = episodeObj;
        }
    }

    // Check ID
    if (id === null) {
        console.error(`Not found: S${season} E${episode}`);
        return;
    }

    // Generate object to send over to scraper
    let reqObj = null;
    if (toShow.type === "show") {
        reqObj = {
            slug: toShow.slug,
            episodeId: id,
            type: "tv",
        };
    } else if (toShow.type === "movie") {
        reqObj = {
            slug: toShow.slug,
            movieId: id,
            type: "movie",
        };
    }

    if (!reqObj) {
        document.getElementById('error').innerHTML = 'Invalid type!'
        return;
    }

    const videoUrl = await getVideoUrl(reqObj);

    var video = document.getElementById('video');
    var videoSrc = `https://hidden-inlet-27205.herokuapp.com/${videoUrl}`;
    if (Hls.isSupported()) {
        var video = document.getElementById('video');
        var hls = new Hls();
        hls.attachMedia(video);
        hls.loadSource(videoSrc);
    }
}