import React from 'react'
import Hls from 'hls.js'
import './VideoElement.css'

// streamUrl: string
export function VideoElement({ streamUrl }) {
    const videoRef = React.useRef(null);

    React.useEffect(() => {
        if (!videoRef || !videoRef.current) return;
        
        const hls = new Hls();
        
        if (!Hls.isSupported() && videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            videoRef.current.src = streamUrl;
            return;
        } else if (!Hls.isSupported()) {
            return; // TODO show error
        }
        
        hls.attachMedia(videoRef.current);
        hls.loadSource(streamUrl);
    }, [videoRef, streamUrl])

    return (
        <video className="videoElement" ref={videoRef} controls autoPlay />
    )
}
