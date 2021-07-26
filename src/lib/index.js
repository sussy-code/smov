import lookMovie from './scraper/lookmovie';
import gomostream from './scraper/gomostream';

async function findContent(searchTerm, type) {
    const results = { options: []};
    const content = await Promise.all([
        lookMovie.findContent(searchTerm, type),
        gomostream.findContent(searchTerm, type)
    ]);

    content.forEach((o) => {
        if (!o || !o.options) return;

        o.options.forEach((i) => {
            if (!i) return;
            results.options.push(i)
        })
    });

    return results;
}

async function getStreamUrl(slug, type, source, season, episode) {
    switch (source) {
        case 'lookmovie':
            return await lookMovie.getStreamUrl(slug, type, season, episode);
        case 'gomostream':
            return await gomostream.getStreamUrl(slug, type, season, episode);
        default:
            return;
    }
}

async function getEpisodes(slug, source) {
    switch (source) {
        case 'lookmovie':
            return await lookMovie.getEpisodes(slug);
        case 'gomostream':
        default:
            return;
    }
}

export { findContent, getStreamUrl, getEpisodes }