import lookmovie from './scraper/lookmovie';
import theflix from './scraper/theflix';

async function findContent(searchTerm, type) {
    const results = { options: []};
    const content = await Promise.all([
        lookmovie.findContent(searchTerm, type),
        theflix.findContent(searchTerm, type)
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
            return await lookmovie.getStreamUrl(slug, type, season, episode);
        case 'theflix':
            return await theflix.getStreamUrl(slug, type, season, episode);
        default:
            return;
    }
}

async function getEpisodes(slug, source) {
    switch (source) {
        case 'lookmovie':
            return await lookmovie.getEpisodes(slug);
        default:
            return;
    }
}

export { findContent, getStreamUrl, getEpisodes }