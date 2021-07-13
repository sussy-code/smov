import React from 'react'
import { Title } from '../components/Title'
import { Card } from '../components/Card'

export function NotFound(props) {
    return (
        <div className="cardView">
            <Card>
                <Title accent="How did you end up here?">
                    Oopsie doopsie
                </Title>
            </Card>
        </div>
    )
}
