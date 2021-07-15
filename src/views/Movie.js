import React from 'react'
import { Title } from '../components/Title'
import { Card } from '../components/Card'
import { useMovie } from '../hooks/useMovie'
import { VideoElement } from '../components/VideoElement'
import { EpisodeSelector } from '../components/EpisodeSelector'
import './Movie.css'
import { getStreamUrl } from '../lib/lookMovie'

export function MovieView(props) {
    const { streamUrl, streamData, setStreamUrl } = useMovie();
    const [season, setSeason] = React.useState("1");
    const [seasonList, setSeasonList] = React.useState([]);
    const [episodeLists, setEpisodeList] = React.useState([]);
    const [episode, setEpisode] = React.useState({ episode: null, season: null });
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        setEpisodeList(streamData.episodes[season]);
    }, [season, streamData.episodes])

    React.useEffect(() => {
        if (streamData.type === "show") {
            setSeasonList(streamData.seasons);
            setSeason(streamData.seasons[0])
            // TODO load from localstorage last watched
            setEpisode({ episode: streamData.episodes[streamData.seasons[0]][0], season: streamData.seasons[0] })
            setEpisodeList(streamData.episodes[streamData.seasons[0]]);
        }
    }, [streamData])

    React.useEffect(() => {
        let cancel = false;
        // ignore if not a show
        if (streamData.type !== "show") return () => {
            cancel = true;
        };
        if (!episode.episode) {
            setLoading(false);
            setStreamUrl('');
            return;
        }
        setLoading(true);

        getStreamUrl(streamData.slug, streamData.type, episode.season, episode.episode)
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
    }, [episode, streamData, setStreamUrl])

    const setProgress = (evt) => {
        let ls = JSON.parse(localStorage.getItem("video-progress") || "{}")

        // We're just checking lookmovie for now since there is only one scraper
        if(!ls.lookmovie) ls.lookmovie = {}
        if(!ls.lookmovie[streamData.type]) ls.lookmovie[streamData.type] = {}
        if(!ls.lookmovie[streamData.type][streamData.slug]) {
            ls.lookmovie[streamData.type][streamData.slug] = {}
        }
        
        // Store real data
        let key = streamData.type === "show" ? `${season}-${episode.episode}` : "full"
        ls.lookmovie[streamData.type][streamData.slug][key] = {
            currentlyAt: Math.floor(evt.currentTarget.currentTime),
            totalDuration: Math.floor(evt.currentTarget.duration),
            updatedAt: Date.now()
        }

        if(streamData.type === "show") {
            ls.lookmovie[streamData.type][streamData.slug][key].show = {
                season,
                episode: episode.episode
            }
        }

        localStorage.setItem("video-progress", JSON.stringify(ls))
    }

    return (
        <div className={`cardView showType-${streamData.type}`}>
            <Card fullWidth>
                <Title accent="Return to home" accentLink="search">
                    {streamData.title}
                </Title>
                {streamData.type === "show" ? <Title size="small">
                    Season {episode.season}: Episode {episode.episode}
                </Title> : undefined}
                <VideoElement streamUrl={streamUrl} loading={loading} setProgress={setProgress} />
                {streamData.type === "show" ? 
                    <EpisodeSelector
                        setSeason={setSeason}
                        setEpisode={setEpisode}
                        season={season}
                        seasons={seasonList}
                        episodes={episodeLists}
                        slug={streamData.slug}
                        currentSeason={season}
                        currentEpisode={episode}
                    />
                : ''}
            </Card>
        </div>
    )
}
