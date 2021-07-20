import lookMovie from './lookMovie';
// import gomostream from './gomostream';

async function findContent(searchTerm, type) {
    return await lookMovie.findContent(searchTerm, type);
}

async function getStreamUrl(slug, type, season, episode) {
    return await lookMovie.getStreamUrl(slug, type, season, episode);
}

async function getEpisodes(slug) {
    return await lookMovie.getEpisodes(slug);
}

export { findContent, getStreamUrl, getEpisodes }