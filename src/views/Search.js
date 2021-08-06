import React from 'react';
import { Helmet } from 'react-helmet';
import { Redirect, useHistory, useRouteMatch } from 'react-router-dom';
import { Arrow } from '../components/Arrow';
import { Card } from '../components/Card';
import { ErrorBanner } from '../components/ErrorBanner';
import { InputBox } from '../components/InputBox';
import { MovieRow } from '../components/MovieRow';
import { Progress } from '../components/Progress';
import { Title } from '../components/Title';
import { TypeSelector } from '../components/TypeSelector';
import { useMovie } from '../hooks/useMovie';
import { findContent, getEpisodes, getStreamUrl } from '../lib/index';

import './Search.css';

export function SearchView() {
    const { navigate, setStreamUrl, setStreamData } = useMovie();

    const history = useHistory();
    const routeMatch = useRouteMatch('/:type');
    const type = routeMatch?.params?.type;
    const streamRouteMatch = useRouteMatch('/:type/:source/:title/:slug');

    const maxSteps = 4;
    const [options, setOptions] = React.useState([]);
    const [progress, setProgress] = React.useState(0);
    const [text, setText] = React.useState("");
    const [failed, setFailed] = React.useState(false);
    const [showingOptions, setShowingOptions] = React.useState(false);
    const [errorStatus, setErrorStatus] = React.useState(false);
    const [page, setPage] = React.useState('search');
    const [continueWatching, setContinueWatching] = React.useState([])

    const fail = (str) => {
        setProgress(maxSteps);
        setText(str)
        setFailed(true)
    }

    async function getStream(title, slug, type, source, year) {
        setStreamUrl("");

        try {
            setProgress(2);
            setText(`Getting stream for "${title}"`);

            let seasons = [];
            let episodes = [];
            if (type === "show") {
                const data = await getEpisodes(slug, source);
                seasons = data.seasons;
                episodes = data.episodes;
            }

            let realUrl = '';
            if (type === "movie") {
                const { url } = await getStreamUrl(slug, type, source);

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
                slug,
                source,
                year
            })
            setText(`Streaming...`)
            navigate("movie")
        } catch (err) {
            console.error(err);
            fail("Failed to get stream")
        }
    }

    async function searchMovie(query, contentType) {
        setFailed(false);
        setText(`Searching for ${contentType} "${query}"`);
        setProgress(1)
        setShowingOptions(false)

        try {
            const { options } = await findContent(query, contentType);

            if (options.length === 0) {
                return fail(`Could not find that ${contentType}`)
            } else if (options.length > 1) {
                setProgress(2);
                setText(`Choose your ${contentType}`);
                setOptions(options);
                setShowingOptions(true);
                return;
            }

            const { title, slug, type, source, year } = options[0];
            history.push(`${routeMatch.url}/${source}/${title}/${slug}`);
            getStream(title, slug, type, source, year);
        } catch (err) {
            console.error(err);
            fail(`Failed to watch ${contentType}`)
        }
    }

    React.useEffect(() => {
        async function fetchHealth() {
            const HOME_URL = "https://movie-web-proxy.herokuapp.com"
            await fetch(HOME_URL).catch(() => {
                // Request failed; source likely offline
                setErrorStatus(`Our content provider is currently offline, apologies.`)
            })
        }
        fetchHealth()
    }, []);

    React.useEffect(() => {
        if (streamRouteMatch) {
            if (streamRouteMatch?.params.type === 'movie' || streamRouteMatch.params.type === 'show') getStream(streamRouteMatch.params.title, streamRouteMatch.params.slug, streamRouteMatch.params.type, streamRouteMatch.params.source);
            else return setErrorStatus("Failed to find movie. Please try searching below.");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const progressData = JSON.parse(localStorage.getItem('video-progress') || "{}")
        let newContinueWatching = []

        Object.keys(progressData).forEach((source) => {
            const all = [
                ...Object.entries(progressData[source]?.show ?? {}),
                ...Object.entries(progressData[source]?.movie ?? {})
            ];

            for (const [slug, data] of all) {
                for (let subselection of Object.values(data)) {
                    let entry = {
                        slug,
                        data: subselection,
                        type: subselection.show ? 'show' : 'movie',
                        percentageDone: Math.floor((subselection.currentlyAt / subselection.totalDuration) * 100),
                        source
                    }

                    if (entry.percentageDone < 90) {
                        newContinueWatching.push(entry)
                    }
                }
            }

            newContinueWatching = newContinueWatching.sort((a, b) => {
                return b.data.updatedAt - a.data.updatedAt
            });

            setContinueWatching(newContinueWatching)
        })
    }, []);

    if (!type || (type !== 'movie' && type !== 'show')) {
        return <Redirect to="/movie" />
    }

    return (
        <div className="cardView">
            <Helmet>
                <title>{type === 'movie' ? 'movies' : 'shows'} | movie-web</title>
            </Helmet>

            {/* Nav */}
            <nav>
                <a className={page === 'search' ? 'selected-link' : ''} onClick={() => setPage('search')} href>Search</a>
                {continueWatching.length > 0 ?
                    <a className={page === 'watching' ? 'selected-link' : ''} onClick={() => setPage('watching')} href>Continue watching</a>
                : ''}
            </nav>

            {/* Search */}
            {page === 'search' ?
                <React.Fragment>
                    <Card>
                        {errorStatus ? <ErrorBanner>{errorStatus}</ErrorBanner> : ''}
                        <Title accent="Because watching content legally is boring">
                            What do you wanna watch?
                        </Title>
                        <TypeSelector
                            setType={(type) => history.push(`/${type}`)}
                            choices={[
                                { label: "Movie", value: "movie" },
                                { label: "TV Show", value: "show" }
                            ]}
                            noWrap={true}
                            selected={type}
                        />
                        <InputBox placeholder={type === "movie" ? "Hamilton" : "Atypical"} onSubmit={(str) => searchMovie(str, type)} />
                        <Progress show={progress > 0} failed={failed} progress={progress} steps={maxSteps} text={text} />
                    </Card>

                    <Card show={showingOptions} doTransition>
                        <Title size="medium">
                            Whoops, there are a few {type}s like that
                        </Title>
                        {Object.entries(options.reduce((a, v) => {
                            if (!a[v.source]) a[v.source] = []
                            a[v.source].push(v)
                            return a;
                        }, {})).map(v => (
                            <div key={v[0]}>
                                <p className="source">{v[0]}</p>
                                {v[1].map((v, i) => (
                                    <MovieRow key={i} title={v.title} slug={v.slug} type={v.type} year={v.year} source={v.source} onClick={() => {
                                        history.push(`${routeMatch.url}/${v.source}/${v.title}/${v.slug}`);
                                        setShowingOptions(false)
                                        getStream(v.title, v.slug, v.type, v.source, v.year)
                                    }} />
                                ))}
                            </div>
                        ))
                        }
                    </Card>
                </React.Fragment> : <React.Fragment />}

            {/* Continue watching */}
            {continueWatching.length > 0 && page === 'watching' ? <Card>
                <Title>Continue watching</Title>
                {Object.entries(continueWatching.reduce((a, v) => {
                    if (!a[v.source]) a[v.source] = []
                    a[v.source].push(v)
                    return a;
                }, {})).map(v => (
                    <div key={v[0]}>
                        <p className="source">{v[0]}</p>
                        {v[1].map((v, i) => (
                            <MovieRow key={i} title={v.data.meta.title} slug={v.data.meta.slug} type={v.type} year={v.data.meta.year} source={v.source} place={v.data.show} percentage={v.percentageDone} onClick={() => {
                                if (v.type === 'show') {
                                    history.push(`${routeMatch.url}/${v.source}/${v.data.meta.title}/${v.slug}/season/${v.data.show.season}/episode/${v.data.show.episode}`)
                                } else {
                                    history.push(`${routeMatch.url}/${v.source}/${v.data.meta.title}/${v.slug}`)
                                }

                                setShowingOptions(false)
                                getStream(v.data.meta.title, v.data.meta.slug, v.type, v.source, v.data.meta.year)
                            }} />
                        ))}
                    </div>
                ))}
            </Card> : <React.Fragment></React.Fragment>}

            <div className="topRightCredits">
                <a href="https://github.com/JamesHawkinss/movie-web" target="_blank" rel="noreferrer">Check it out on GitHub <Arrow /></a>
                <br />
                <a href="https://discord.gg/vXsRvye8BS" target="_blank" rel="noreferrer">Join the Discord <Arrow /></a>
            </div>
        </div>
    )
}
