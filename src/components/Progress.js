import React from 'react'
import './Progress.css'

// show: boolean
// progress: number
// steps: number
// text: string
// failed: boolean
export function Progress(props) {
    return (
        <div className={`progress ${props.show?'':'hide'} ${props.failed?'failed':''}`}>
            { props.text && props.text.length > 0 ? (
                <p>{props.text}</p>) : null}
            <div className="bar">
                <div className="bar-inner" style={{
                    width: (props.progress / props.steps * 100).toFixed(0) + "%"
                }}/>
            </div>
        </div>
    )
}