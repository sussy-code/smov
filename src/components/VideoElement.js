import React from 'react'
import Hls from 'hls.js'
import './VideoElement.css'

// streamUrl: string
export function VideoElement({ streamUrl }) {
    const videoRef = React.useRef(null);
    const [error, setError] = React.useState(false);

    React.useEffect(() => {
        setError(false)
        if (!videoRef || !videoRef.current) return;
        
        const hls = new Hls();
        
        if (!Hls.isSupported() && videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            videoRef.current.src = streamUrl;
            return;
        } else if (!Hls.isSupported()) {
            setError(true)
            return;
        }
        
        hls.attachMedia(videoRef.current);
        hls.loadSource(streamUrl);
    }, [videoRef, streamUrl])

    if (error)
        return (<p className="videoElementText">Your browser is not supported</p>)

    return (
        <video className="videoElement" ref={videoRef} controls autoPlay />
    )
}
