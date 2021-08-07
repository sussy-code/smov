import React from 'react';
import { TypeSelector } from './TypeSelector';
import { NumberSelector } from './NumberSelector';
import './EpisodeSelector.css'

export function EpisodeSelector({ setSelectedSeason, selectedSeason, setEpisode, seasons, episodes, currentSeason, currentEpisode, streamData }) {
    const choices = episodes ? episodes.map(v => {
        let progressData = JSON.parse(localStorage.getItem('video-progress') || "{}")
        
        let currentlyAt = 0;
        let totalDuration = 0;

        const progress = progressData?.[streamData.source]?.[streamData.type]?.[streamData.slug]?.[`${selectedSeason}-${v}`]

        if (progress) {
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
            <TypeSelector setType={setSelectedSeason} selected={selectedSeason} choices={seasons.map(v=>({ value: v.toString(), label: `Season ${v}`}))} /><br></br>
            <NumberSelector setType={(e) => setEpisode({episode: e, season: selectedSeason})} choices={choices} selected={(selectedSeason.toString() === currentSeason) ? currentEpisode : null} />
        </div>
    )
}
