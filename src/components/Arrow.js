import React from 'react'
import './Arrow.css'

// left?: boolean
export function Arrow(props) {
    return (
        <span className="arrow" dangerouslySetInnerHTML={{ __html: `
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather ${props.left?'left':''}"}>
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
        `}}>
        </span>
    )
}
