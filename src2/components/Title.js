import React from 'react';
import { useHistory } from 'react-router-dom';
import { useMovie } from '../hooks/useMovie'
import { Arrow } from '../components/Arrow'
import './Title.css'

// size: "big" | "medium" | "small" | null
// accent: string | null
// accentLink: string | null
export function Title(props) {
    const { streamData, resetStreamData } = useMovie();
    const history = useHistory();
    const size = props.size || "big";

    const accentLink = props.accentLink || "";
    const accent = props.accent || "";

    function handleAccentClick(){
        if (accentLink.length > 0) {
            history.push(`/${streamData.type}`);
            resetStreamData();
        }
    }

    function handleKeyPress(event){
        if (event.code === 'Enter' || event.code === 'Space'){
            handleAccentClick();
        }
    }
    
    return (
        <div>
            {accent.length > 0 ? (
                <p onClick={handleAccentClick} className={`title-accent ${accentLink.length > 0 ? 'title-accent-link' : ''}`} tabIndex={accentLink.length > 0 ? 0 : undefined} onKeyPress={handleKeyPress}>
                    {accentLink.length > 0 ? (<Arrow left/>) : null}{accent}
                </p>
            ) : null}
            <h1 className={"title " + ( size ? `title-size-${size}` : '' )}>{props.children}</h1>
        </div>
    )
}
