import React from 'react'
import { Title } from '../components/Title'
import { Card } from '../components/Card'
import { useMovie } from '../hooks/useMovie'
import { VideoElement } from '../components/VideoElement'

export function MovieView(props) {
    const { streamUrl, streamData } = useMovie();

    return (
        <div className="cardView">
            <Card fullWidth>
                <Title accent="Return to home" accentLink="search">
                    {streamData.title} {streamData.type === "show" ? `(${streamData.season}x${streamData.episode})` : '' }
                </Title>
                <VideoElement streamUrl={streamUrl}/>
            </Card>
        </div>
    )
}
