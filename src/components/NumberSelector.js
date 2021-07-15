import React from 'react';
// import { Arrow } from './Arrow';
import './NumberSelector.css'

// setType: (txt: string) => void
// choices: { label: string, value: string }[]
// selected: string
export function NumberSelector({ setType, choices, selected }) {

    choices.forEach(choice => {
        if(choice.percentage > 3) choice.percentage = Math.max(20, choice.percentage < 90 ? choice.percentage : 100)
    })

    return (
        <div className="numberSelector">
            {choices.map(v=>(
                <div key={v.value} className="choiceWrapper">
                    <div className={`choice ${selected&&selected===v.value?'selected':''}`} onClick={() => setType(v.value)}>
                        {v.label}
                        {v.percentage > 0 ? (
                            <div class="progressBar">
                                <div class="progressBarInner" style={{width: `${v.percentage}%`}}></div>
                            </div>
                        ) : ''}
                    </div>
                </div>
            ))}
        </div>
    )
}
