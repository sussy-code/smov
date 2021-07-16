import React from 'react';
import './ErrorBanner.css';

export function ErrorBanner({children}) {
	return (
		<div class="errorBanner">
			{children}
		</div>
	)
}