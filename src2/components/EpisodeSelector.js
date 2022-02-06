import React from 'react';
import { TypeSelector } from './TypeSelector';
import { NumberSelector } from './NumberSelector';
import { VideoProgressStore } from '../lib/storage/VideoProgress'
import { SelectBox } from '../components/SelectBox';
import './EpisodeSelector.css'
import { useWindowSize } from '../hooks/useWindowSize';

export function EpisodeSelector({ setSelectedSeason, selectedSeason, setEpisode, seasons, episodes, currentSeason, currentEpisode, streamData }) {
    const choices = episodes ? episodes.map(v => {
        const progressData = VideoProgressStore.get();
        
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

    const windowSize = useWindowSize()

    return (
        <div className="episodeSelector">
            {
                (seasons.length > 0 && (windowSize.width <= 768 || seasons.length > 4)) ? 
                (
                    <SelectBox setSelectedItem={(index) => setSelectedSeason(seasons[index])} selectedItem={seasons.findIndex(s => s === selectedSeason)} options={seasons.map(season => { return {id: season, name: `Season ${season}` }})}/>
                )
                :
                (
                    <TypeSelector setType={setSelectedSeason} selected={selectedSeason} choices={seasons.map(v=>({ value: v.toString(), label: `Season ${v}`}))} />
                )
            }
            <br></br>
            <NumberSelector setType={(e) => setEpisode({episode: e, season: selectedSeason})} choices={choices} selected={(selectedSeason.toString() === currentSeason) ? currentEpisode : null} />
        </div>
    )
}
