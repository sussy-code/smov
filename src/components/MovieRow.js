import React from 'react'
import { Arrow } from './Arrow'
import './MovieRow.css'

// title: string
// onClick: () => void
export function MovieRow(props) {
    return (
        <div className="movieRow" onClick={() => props.onClick && props.onClick()}>
            <div className="left">
                {props.title}&nbsp;
                <span className="year">({props.year})</span>
            </div>
            <div className="watch">
                <span className='attribute' hidden={props.type === 'show' ? false : true }>{props.season}x{props.episode}</span>
                <p>Watch {props.type}</p>
                <Arrow/>
            </div>
        </div>
    )
}
