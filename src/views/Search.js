import React from 'react';
import { InputBox } from '../components/InputBox'
import { Title } from '../components/Title'
import { Card } from '../components/Card'
import { MovieRow } from '../components/MovieRow'
import { Arrow } from '../components/Arrow'
import { Progress } from '../components/Progress'
import { findContent, getStreamUrl } from '../lib/lookMovie'
import { useMovie } from '../hooks/useMovie';

import './Search.css'

export function SearchView() {
    const { navigate, setStreamUrl, setStreamData } = useMovie();

    const maxSteps = 3;
    const [options, setOptions] = React.useState([]);
    const [progress, setProgress] = React.useState(0);
    const [text, setText] = React.useState("");
    const [failed, setFailed] = React.useState(false);
    const [showingOptions, setShowingOptions] = React.useState(false);

    const fail = (str) => {
        setProgress(maxSteps);
        setText(str)
        setFailed(true)
    }

    async function getStream(title, slug, type, season, episode) {
        setStreamUrl("");
        try {
            setProgress(2);
            setText(`Getting stream for "${title}"`)
            const { url } = await getStreamUrl(slug, type, season, episode);
            setProgress(maxSteps);
            setStreamUrl(url);
            setStreamData({
                title,
                type,
            })
            setText(`Streaming...`)
            navigate("movie")
        } catch (err) {
            fail("Failed to get stream")
        }
    }

    async function searchMovie(query, contentType, season, episode) {
        setFailed(false);
        setText(`Searching for ${contentType} "${query}" ${contentType === 'show' ? ` (${season}x${episode})` : ''}`);
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
            getStream(title, slug, type, season, episode);
        } catch (err) {
            fail(`Failed to watch ${contentType}`)
        }
    }

    return (
        <div className="cardView">
            <Card>
                <Title accent="Because watching content legally is boring">
                    What do you wanna watch?
                </Title>
                <InputBox placeholder="Hamilton" onSubmit={(str, type, season, episode) => searchMovie(str, type, season, episode)} />
                <Progress show={progress > 0} failed={failed} progress={progress} steps={maxSteps} text={text} />
            </Card>

            <Card show={showingOptions} doTransition>
                <Title size="medium">
                    Whoops, there are a few movies like that
                </Title>
                {options?.map((v, i) => (
                    <MovieRow key={i} title={v.title} type={v.type} year={v.year} onClick={() => {
                        setShowingOptions(false)
                        getStream(v.title, v.slug, v.type)
                    }}/>
                ))}
            </Card>
            <div className="topRightCredits">
                <a href="https://github.com/JamesHawkinss/movie-web" target="_blank" rel="noreferrer">Check it out on GitHub <Arrow/></a>
            </div>
        </div>
    )
}
