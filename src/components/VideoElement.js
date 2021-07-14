import React from 'react'
import Hls from 'hls.js'
import './VideoElement.css'

// streamUrl: string
// loading: boolean
export function VideoElement({ streamUrl, loading }) {
    const videoRef = React.useRef(null);
    const [error, setError] = React.useState(false);

    React.useEffect(() => {
        setError(false)
        if (!videoRef || !videoRef.current || !streamUrl || streamUrl.length === 0 || loading) return;
        
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
    }, [videoRef, streamUrl, loading])

    // TODO make better loading/error/empty state

    if (error)
        return (<p className="videoElementText">Your browser is not supported</p>)

    if (loading)
        return <p className="videoElementText">Loading episode</p>
    
    if (!streamUrl || streamUrl.length === 0)
        return <p className="videoElementText">No video selected</p>

    return (
        <video className="videoElement" ref={videoRef} controls autoPlay />
    )
}
