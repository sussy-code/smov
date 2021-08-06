import React, { useCallback } from 'react'
import { useRouteMatch, useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet';
import { Title } from '../components/Title'
import { Card } from '../components/Card'
import { useMovie } from '../hooks/useMovie'
import { VideoElement } from '../components/VideoElement'
import { EpisodeSelector } from '../components/EpisodeSelector'
import { getStreamUrl } from '../lib/index'

import './Movie.css'

export function MovieView(props) {
    const baseRouteMatch = useRouteMatch('/:type/:source/:title/:slug');
    const showRouteMatch = useRouteMatch('/:type/:source/:title/:slug/season/:season/episode/:episode');
    const history = useHistory();

    const { streamUrl, streamData, setStreamUrl } = useMovie();
    const [ seasonList, setSeasonList ] = React.useState([]);
    const [ episodeLists, setEpisodeList ] = React.useState([]);
    const [ loading, setLoading ] = React.useState(false);
    const [ selectedSeason, setSelectedSeason ] = React.useState("1");

    const season = showRouteMatch?.params.season || "1";
    const episode = showRouteMatch?.params.episode || "1";

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function setEpisode({ season, episode }) {
        // getStream(title, slug, type, source, year);
        // console.log(season, episode)
        let tmpSeason = showRouteMatch.params.season;
        let tmpEpisode = showRouteMatch.params.episode;
        if (tmpSeason != season && tmpEpisode != episode)
            history.replace(`${baseRouteMatch.url}/season/${season}/episode/${episode}`);
    }

    React.useEffect(() => {
        // Cache streamData continue watching on home page
        let movieCache = JSON.parse(localStorage.getItem("movie-cache") || "{}");

        if (!movieCache[streamData.source]) movieCache[streamData.source] = {}
        movieCache[streamData.source][streamData.slug] = {
            cachedAt: Date.now()
        }

        localStorage.setItem("movie-cache", JSON.stringify(movieCache));
        
        // Set season and episode list for GUI
        if (streamData.type === "show") {
            setSeasonList(streamData.seasons);
            setSelectedSeason(streamData.seasons[0])
            // TODO load from localstorage last watched
            setEpisode({ episode: streamData.episodes[streamData.seasons[0]][0], season: streamData.seasons[0] })
            setEpisodeList(streamData.episodes[streamData.seasons[0]]);
        }
    }, [streamData, setEpisode])

    React.useEffect(() => {
        setEpisodeList(streamData.episodes[selectedSeason]);
    }, [selectedSeason, streamData.episodes])

    React.useEffect(() => {
        if (streamData.type === "show") {
            setSeasonList(streamData.seasons);
            // TODO load from localstorage last watched
            setEpisodeList(streamData.episodes[streamData.seasons[0]]);
        }
    }, [streamData])

    React.useEffect(() => {
        if (streamData.type === "show" && !showRouteMatch) history.replace(`${baseRouteMatch.url}/season/1/episode/1`);
    }, [streamData, showRouteMatch, history, baseRouteMatch.url]);

    React.useEffect(() => {
        if (streamData.type === "show" && showRouteMatch) setSelectedSeason(showRouteMatch.params.season.toString());
    }, [showRouteMatch, streamData]);

    React.useEffect(() => {
        let cancel = false;
        // ignore if not a show
        if (streamData.type !== "show") return () => {
            cancel = true;
        };
        if (!episode) {
            setLoading(false);
            setStreamUrl('');
            return;
        }
        setLoading(true);

        getStreamUrl(streamData.slug, streamData.type, streamData.source, season, episode)
            .then(({url}) => {
                if (cancel) return;
                setStreamUrl(url)
                setLoading(false);
            })
            .catch(e => {
                if (cancel) return;
                console.error(e)
            })

        return () => {
            cancel = true;
        } 
    }, [episode, streamData, setStreamUrl, season]);

    React.useEffect(() => {
        // Cache streamData continue watching on home page
        let movieCache = JSON.parse(localStorage.getItem("movie-cache") || "{}");

        if(!movieCache[streamData.source]) movieCache[streamData.source] = {}
        movieCache[streamData.source][streamData.slug] = {
            cachedAt: Date.now()
        }

        localStorage.setItem("movie-cache", JSON.stringify(movieCache));
        
        // Set season and episode list for GUI
        if (streamData.type === "show") {
            setSeasonList(streamData.seasons);
            setSelectedSeason(streamData.seasons[0])
            // TODO load from localstorage last watched
            setEpisode({ episode: streamData.episodes[streamData.seasons[0]][0], season: streamData.seasons[0] })
            setEpisodeList(streamData.episodes[streamData.seasons[0]]);
        }
    }, [streamData, setEpisode])

    const setProgress = (evt) => {
        let ls = JSON.parse(localStorage.getItem("video-progress") || "{}")

        console.log(streamData);

        if(!ls[streamData.source]) ls[streamData.source] = {}
        if(!ls[streamData.source][streamData.type]) ls[streamData.source][streamData.type] = {}
        if(!ls[streamData.source][streamData.type][streamData.slug]) {
            ls[streamData.source][streamData.type][streamData.slug] = {}
        }
        
        // Store real data
        let key = streamData.type === "show" ? `${season}-${episode.episode}` : "full"
        ls[streamData.source][streamData.type][streamData.slug][key] = {
            currentlyAt: Math.floor(evt.currentTarget.currentTime),
            totalDuration: Math.floor(evt.currentTarget.duration),
            updatedAt: Date.now(),
            meta: streamData
        }

        if(streamData.type === "show") {
            ls[streamData.source][streamData.type][streamData.slug][key].show = {
                season,
                episode: episode.episode
            }
        }

        localStorage.setItem("video-progress", JSON.stringify(ls))
    }

    return (
        <div className={`cardView showType-${streamData.type}`}>
            <Helmet>
                <title>{streamData.title}{streamData.type === 'show' ? ` | S${season}E${episode}` : ''} | movie-web</title>
            </Helmet>

            <Card fullWidth>
                <Title accent="Return to home" accentLink="search">
                    {streamData.title}
                </Title>
                {streamData.type === "show" ? <Title size="small">
                    Season {season}: Episode {episode}
                </Title> : undefined}
                <VideoElement streamUrl={streamUrl} loading={loading} setProgress={setProgress} />
                {streamData.type === "show" ? 
                    <EpisodeSelector
                        setSelectedSeason={setSelectedSeason}
                        selectedSeason={selectedSeason}

                        setEpisode={setEpisode}

                        seasons={seasonList}
                        episodes={episodeLists}

                        currentSeason={season}
                        currentEpisode={episode}

                        source={streamData.source}
                    />
                : ''}
            </Card>
        </div>
    )
}
