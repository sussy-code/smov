import React from 'react'
import { Arrow } from './Arrow'
import './MovieRow.css'

// title: string
// onClick: () => void
export function MovieRow(props) {
    return (
        <div className="movieRow" onClick={() => props.onClick && props.onClick()}>
            <div className="left">
                {props.title}
            </div>
            <div className="watch">
                <span className="attribute">year: {props.year}</span>
                <p>Watch {props.type}</p>
                <Arrow/>
            </div>
        </div>
    )
}
