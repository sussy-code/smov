import React from 'react'
import Hls from 'hls.js'
import { VideoPlaceholder } from './VideoPlaceholder'

import './VideoElement.css'

// streamUrl: string
// loading: boolean
// setProgress: (event: NativeEvent) => void
// videoRef: useRef
// startTime: number
export function VideoElement({ streamUrl, loading, setProgress, videoRef, startTime, streamData }) {
    const [error, setError] = React.useState(false);

    function onLoad() {
        if (startTime)
            videoRef.current.currentTime = startTime;
    }

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
    }, [videoRef, streamUrl, loading]);

    if (error)
        return (<VideoPlaceholder>Your browser is not supported</VideoPlaceholder>)

    if (loading)
        return <VideoPlaceholder>Loading episode...</VideoPlaceholder>
    
    if (!streamUrl || streamUrl.length === 0)
        return <VideoPlaceholder>No video selected</VideoPlaceholder>

    if (!streamUrl.endsWith('.mp4')) {
        return (
            <video crossorigin="anonymous" className="videoElement" ref={videoRef} controls autoPlay onProgress={setProgress} onLoadedData={onLoad}>
                { streamData.subtitles && streamData.subtitles.map((sub, index) => <track key={index} kind="captions" label={sub.language} src={`${process.env.REACT_APP_CORS_PROXY_URL}https://lookmovie.io${sub.file}` } />) }
            </video>
        )
    } else {
        return (
            <video crossorigin="anonymous" className="videoElement" ref={videoRef} controls autoPlay onProgress={setProgress} onLoadedData={onLoad}>
                { streamData.subtitles && streamData.subtitles.map((sub, index) => <track key={index} kind="captions" label={sub.language} src={`${process.env.REACT_APP_CORS_PROXY_URL}https://lookmovie.io${sub.file}` } />) }
                <source src={streamUrl} type="video/mp4" />
            </video>
        )
    }
}
