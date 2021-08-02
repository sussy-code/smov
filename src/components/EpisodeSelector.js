import React from 'react';
import { TypeSelector } from './TypeSelector';
import { NumberSelector } from './NumberSelector';
import './EpisodeSelector.css'

export function EpisodeSelector({ setSelectedSeason, setEpisode, seasons, selectedSeason, season, episodes, currentSeason, currentEpisode, source }) {
    const choices = episodes ? episodes.map(v => {
        let progressData = JSON.parse(localStorage.getItem('video-progress') || "{}")
        
        let currentlyAt = 0;
        let totalDuration = 0;

        const progress = progressData?.[source]?.show?.slug?.[`${season}-${v}`]
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
    }) : [];

    return (
        <div className="episodeSelector">
            <TypeSelector setType={setSelectedSeason} choices={seasons.map(v=>({ value: v.toString(), label: `Season ${v}`}))} selected={selectedSeason}/><br></br>
            <NumberSelector setType={(e) => setEpisode({episode: e, season: selectedSeason})} choices={choices} selected={(selectedSeason.toString() === currentSeason) ? currentEpisode : null} />
        </div>
    )
}
