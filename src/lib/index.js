import lookmovie from './scraper/lookmovie';
import theflix from './scraper/theflix';
import vidzstore from './scraper/vidzstore';

async function findContent(searchTerm, type) {
    const results = { options: []};
    const content = await Promise.all([
        lookmovie.findContent(searchTerm, type),
        theflix.findContent(searchTerm, type),
        vidzstore.findContent(searchTerm, type)
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
        case 'vidzstore':
            return await vidzstore.getStreamUrl(slug);
        default:
            return;
    }
}

async function getEpisodes(slug, source) {
    switch (source) {
        case 'lookmovie':
            return await lookmovie.getEpisodes(slug);
        case 'theflix':
            return await theflix.getEpisodes(slug);
        default:
            return;
    }
}

export { findContent, getStreamUrl, getEpisodes }