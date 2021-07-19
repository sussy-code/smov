import React from 'react';
import { InputBox } from '../components/InputBox'
import { Title } from '../components/Title'
import { Card } from '../components/Card'
import { ErrorBanner } from '../components/ErrorBanner'
import { MovieRow } from '../components/MovieRow'
import { Arrow } from '../components/Arrow'
import { Progress } from '../components/Progress'
import { findContent, getStreamUrl, getEpisodes } from '../lib/lookMovie'
// import { findContentGomo, getStreamUrlGomo } from '../lib/gomostream';
import { useMovie } from '../hooks/useMovie';
import { TypeSelector } from '../components/TypeSelector'

import './Search.css'

export function SearchView() {
    const { navigate, setStreamUrl, setStreamData } = useMovie();

    const maxSteps = 4;
    const [options, setOptions] = React.useState([]);
    const [progress, setProgress] = React.useState(0);
    const [text, setText] = React.useState("");
    const [failed, setFailed] = React.useState(false);
    const [showingOptions, setShowingOptions] = React.useState(false);
    const [offlineStatus, setOfflineStatus] = React.useState(false);
    const [type, setType] = React.useState("movie");

    const fail = (str) => {
        setProgress(maxSteps);
        setText(str)
        setFailed(true)
    }

    async function getStream(title, slug, type) {
        setStreamUrl("");

        try {
            setProgress(2);
            setText(`Getting stream for "${title}"`)

            let seasons = [];
            let episodes = [];
            if (type === "show") {
                const data = await getEpisodes(slug);
                seasons = data.seasons;
                episodes = data.episodes;
            }

            let realUrl = '';
            if (type === "movie") {
                const { url } = await getStreamUrl(slug, type);
    
                if (url === '') {
                    return fail(`Not found: ${title}`)
                }
                realUrl = url;
            }

            setProgress(maxSteps);
            setStreamUrl(realUrl);
            setStreamData({
                title,
                type,
                seasons,
                episodes,
                slug
            })
            setText(`Streaming...`)
            navigate("movie")
        } catch (err) {
            fail("Failed to get stream")
        }
    }

    async function searchMovie(query, contentType) {
        setFailed(false);
        setText(`Searching for ${contentType} "${query}"`);
        setProgress(1)
        setShowingOptions(false)

        try {
            const { options } = await findContent(query, contentType)

            if (options.length === 0) {
                return fail(`Could not find that ${contentType}`)
            } else if (options.length > 1) {
                setProgress(2);
                setText(`Choose your ${contentType}`);
                setOptions(options);
                setShowingOptions(true);
                return;
            }

            const { title, slug, type } = options[0];
            getStream(title, slug, type);
        } catch (err) {
            fail(`Failed to watch ${contentType}`)
        }
    }

    React.useEffect(() => {
        async function fetchHealth() {
            const HOME_URL = "https://hidden-inlet-27205.herokuapp.com/https://lookmovie.io/"
            await fetch(HOME_URL).catch(() => {
                // Request failed; source likely offline
                setOfflineStatus(`Our content provider is currently offline, apologies.`)
            })
        }
        fetchHealth()
    }, [])

    return (
        <div className="cardView">
            <Card>
                {offlineStatus ? <ErrorBanner>{offlineStatus}</ErrorBanner> : ''}
                <Title accent="Because watching content legally is boring">
                    What do you wanna watch?
                </Title>
                <TypeSelector
                    setType={(type) => setType(type)}
                    choices={[
                        { label: "Movie", value: "movie" },
                        { label: "TV Show", value: "show" }
                    ]}
                    noWrap={true}
                    selected={type}
                />
                <InputBox placeholder={ type === "movie" ? "Hamilton" : "Atypical" } onSubmit={(str) => searchMovie(str, type)} />
                <Progress show={progress > 0} failed={failed} progress={progress} steps={maxSteps} text={text} />
            </Card>

            <Card show={showingOptions} doTransition>
                <Title size="medium">
                    Whoops, there are a few {type}s like that
                </Title>
                {options?.map((v, i) => (
                    <MovieRow key={i} title={v.title} slug={v.slug} type={v.type} year={v.year} season={v.season} episode={v.episode} onClick={() => {
                        setShowingOptions(false)
                        getStream(v.title, v.slug, v.type, v.season, v.episode)
                    }}/>
                ))}
            </Card>
            <div className="topRightCredits">
                <a href="https://github.com/JamesHawkinss/movie-web" target="_blank" rel="noreferrer">Check it out on GitHub <Arrow/></a>
            </div>
        </div>
    )
}
