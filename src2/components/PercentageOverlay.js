import React from 'react'
import './PercentageOverlay.css'

export function PercentageOverlay({ percentage }) {

	if(percentage && percentage > 3) percentage = Math.max(20, percentage < 90 ? percentage : 100)

	return percentage > 0 ? (
		<div className="progressBar">
            <div className="progressBarInner" style={{width: `${percentage}%`}}></div>
        </div>
	) : <React.Fragment></React.Fragment>
}