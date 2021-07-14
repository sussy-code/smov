import React from 'react';
import { TypeSelector } from './TypeSelector';
import { NumberSelector } from './NumberSelector';
import './EpisodeSelector.css'

export function EpisodeSelector({ setSeason, setEpisode, seasons, episodes, currentSeason, currentEpisode }) {
    return (
        <div>
            <TypeSelector setType={setSeason} choices={seasons.map(v=>({ value: v.toString(), label: `Season ${v}`}))} selected={currentSeason}/><br></br>
            <NumberSelector setType={(e) => setEpisode({episode: e, season: currentSeason})} choices={episodes.map(v=>({ value: v.toString(), label: v}))} selected={currentEpisode.season === currentSeason?currentEpisode.episode:null}/>
        </div>
    )
}
