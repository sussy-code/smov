import React from 'react';
import { TypeSelector } from './TypeSelector';
import { NumberSelector } from './NumberSelector';
import './EpisodeSelector.css'

export function EpisodeSelector({ setSeason, setEpisode, seasons, season, episodes, currentSeason, currentEpisode, slug }) {

    const choices = episodes.map(v => {

        let progressData = JSON.parse(localStorage.getItem('video-progress') || "{}")
        
        let currentlyAt = 0;
        let totalDuration = 0;

        const progress = progressData?.lookmovie?.show?.slug?.[`${season}-${v}`]
        if(progress) {
            currentlyAt = progress.currentlyAt
            totalDuration = progress.totalDuration
        }

        const percentage = Math.round((currentlyAt / totalDuration) * 100)

        return { 
            value: v.toString(), 
            label: v,
            percentage
        }
    })

    return (
        <div className="episodeSelector">
            <TypeSelector setType={setSeason} choices={seasons.map(v=>({ value: v.toString(), label: `Season ${v}`}))} selected={currentSeason}/><br></br>
            <NumberSelector setType={(e) => setEpisode({episode: e, season: currentSeason})} choices={choices} selected={currentEpisode.season === currentSeason?currentEpisode.episode:null}/>
        </div>
    )
}
