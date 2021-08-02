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
    return (
        <div>
            {accent.length > 0 ? (
                <p onClick={() => {
                    if (accentLink.length > 0) {
                        history.push(`/${streamData.type}`);
                        resetStreamData();
                    }
                }} className={`title-accent ${accentLink.length > 0 ? 'title-accent-link' : ''}`}>
                    {accentLink.length > 0 ? (<Arrow left/>) : null}{accent}
                </p>
            ) : null}
            <h1 className={"title " + ( size ? 'title-size-' + size : '' )}>{props.children}</h1>
        </div>
    )
}
