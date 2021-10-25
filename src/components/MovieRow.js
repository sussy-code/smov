import React from 'react'
import { Arrow } from './Arrow'
import { PercentageOverlay } from './PercentageOverlay'
import { VideoProgressStore } from '../lib/storage/VideoProgress'
import './MovieRow.css'

// title: string
// onClick: () => void
export function MovieRow(props) {
    const progressData = VideoProgressStore.get();
    let progress;
    let percentage = null;
    
    if (props.type === "movie") {
        progress = progressData?.[props.source]?.movie?.[props.slug]?.full
        
        if (progress) {
            percentage = Math.floor((progress.currentlyAt / progress.totalDuration) * 100)
        }
    }

    return (
        <div className="movieRow" onClick={() => props.onClick && props.onClick()}>
        
            { props.source === "lookmovie" && (
                <div className="subtitleIcon">
                    <svg id="subtitleIcon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 4H4C2.897 4 2 4.897 2 6V18C2 19.103 2.897 20 4 20H20C21.103 20 22 19.103 22 18V6C22 4.897 21.103 4 20 4ZM11 10H8V14H11V16H8C6.897 16 6 15.103 6 14V10C6 8.897 6.897 8 8 8H11V10ZM18 10H15V14H18V16H15C13.897 16 13 15.103 13 14V10C13 8.897 13.897 8 15 8H18V10Z" fill="#EEEEEE"/>
                    </svg>
                </div>
            ) }
        
            <div className="left">
                {/* <Cross /> */}
                <div className="titleWrapper">
                    <div className="titleText">
                        {props.title}
                        &nbsp;
                        <span className="year">({props.year})</span>
                        <span className="seasonEpisodeSubtitle">{props.place ? ` - S${props.place.season}:E${props.place.episode}` : ''}</span>
                    </div>
                </div>
            </div>

            <div className="watch">
                <p>Watch {props.type}</p>
                <Arrow/>
            </div>
            
            <PercentageOverlay percentage={props.percentage || percentage} />
        </div>
    )
}
