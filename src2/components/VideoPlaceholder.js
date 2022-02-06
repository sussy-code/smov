import React from 'react'
import './VideoPlaceholder.css'

export function VideoPlaceholder(props) {
	return (
		<div className="videoPlaceholder">
			<div className="videoPlaceholderBox">
				<p>{props.children}</p>
			</div>
		</div>
	)
}