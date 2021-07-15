import React from 'react';
// import { Arrow } from './Arrow';
import './NumberSelector.css'
import { PercentageOverlay } from './PercentageOverlay';

// setType: (txt: string) => void
// choices: { label: string, value: string }[]
// selected: string
export function NumberSelector({ setType, choices, selected }) {
    return (
        <div className="numberSelector">
            {choices.map(v=>(
                <div key={v.value} className="choiceWrapper">
                    <div className={`choice ${selected&&selected===v.value?'selected':''}`} onClick={() => setType(v.value)}>
                        {v.label}
                        <PercentageOverlay percentage={v.percentage} />
                    </div>
                </div>
            ))}
        </div>
    )
}
