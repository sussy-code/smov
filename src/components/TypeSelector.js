import React from 'react';
import './TypeSelector.css'

// setType: (txt: string) => void
// choices: { label: string, value: string }[]
// selected: string
export function TypeSelector({ setType, choices, selected, noWrap = false }) {
    const selectedIndex = choices.findIndex(v=>v.value===selected);
    const transformStyles = {
        opacity: selectedIndex!==-1?1:0,
        transform: `translateX(${selectedIndex!==-1?selectedIndex*7:0}rem)`
    }
    return (
        <div className={`typeSelector ${noWrap ? 'nowrap' : ''}`}>
            {choices.map(v=>(
                <div key={v.value} className={`choice ${selected===v.value?'selected':''}`} onClick={() => setType(v.value)}>
                    {v.label}
                </div>
            ))}
            <div className="selectedBar" style={transformStyles}/>
        </div>
    )
}
