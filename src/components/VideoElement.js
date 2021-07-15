import React from 'react'
import Hls from 'hls.js'
import './VideoElement.css'
import { VideoPlaceholder } from './VideoPlaceholder'

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

    if (error)
        return (<VideoPlaceholder>Your browser is not supported</VideoPlaceholder>)

    if (loading)
        return <VideoPlaceholder>Loading episode...</VideoPlaceholder>
    
    if (!streamUrl || streamUrl.length === 0)
        return <videoPlaceholder>No video selected</videoPlaceholder>

    return (
        <video className="videoElement" ref={videoRef} controls autoPlay />
    )
}
