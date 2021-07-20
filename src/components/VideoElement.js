import React from 'react'
import Hls from 'hls.js'
import { VideoPlaceholder } from './VideoPlaceholder'

import './VideoElement.css'

// streamUrl: string
// loading: boolean
export function VideoElement({ streamUrl, loading, setProgress }) {
    const videoRef = React.useRef(null);
    const [error, setError] = React.useState(false);

    React.useEffect(() => {
        if (!streamUrl.endsWith('.mp4')) {
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
        }
    }, [videoRef, streamUrl, loading])

    if (error)
        return (<VideoPlaceholder>Your browser is not supported</VideoPlaceholder>)

    if (loading)
        return <VideoPlaceholder>Loading episode...</VideoPlaceholder>
    
    if (!streamUrl || streamUrl.length === 0)
        return <VideoPlaceholder>No video selected</VideoPlaceholder>

    if (!streamUrl.endsWith('.mp4')) {
        return (
            <video className="videoElement" ref={videoRef} controls autoPlay onProgress={setProgress} />
        )
    } else {
        return (
            <video className="videoElement" ref={videoRef} controls autoPlay onProgress={setProgress}>
                <source src={streamUrl} type="video/mp4" />
            </video>
        )
    }
}
