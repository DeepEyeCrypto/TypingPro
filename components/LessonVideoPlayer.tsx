import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { X, Maximize, Minimize, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface LessonVideoPlayerProps {
    hlsUrl: string;
    onClose?: () => void;
    autoPlay?: boolean;
    className?: string;
}

/**
 * LessonVideoPlayer - Clean Rewrite
 * Optimized for Remote Streaming & User Control
 */
const LessonVideoPlayer: React.FC<LessonVideoPlayerProps> = ({
    hlsUrl,
    onClose,
    autoPlay = true,
    className = ''
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [showUnmutePrompt, setShowUnmutePrompt] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let hls: Hls | null = null;

        const setupVideo = () => {
            if (Hls.isSupported()) {
                hls = new Hls({ enableWorker: true });
                hls.loadSource(hlsUrl);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    if (autoPlay) {
                        video.play().catch(() => {
                            video.muted = true;
                            setIsMuted(true);
                            video.play().then(() => setShowUnmutePrompt(true));
                        });
                    }
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = hlsUrl;
            }
        };

        setupVideo();
        return () => hls?.destroy();
    }, [hlsUrl, autoPlay]);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !videoRef.current.muted;
        setIsMuted(videoRef.current.muted);
        setShowUnmutePrompt(false);
    };

    if (hasError) return <div className="text-red-500">Video Load Failed.</div>;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
            <div className={`relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 ${className}`}>
                <video
                    ref={videoRef}
                    className="w-full h-full"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onClick={togglePlay}
                    playsInline
                />

                {/* Unmute Prompt */}
                {showUnmutePrompt && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <button
                            onClick={toggleMute}
                            className="bg-brand hover:bg-brand/90 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl animate-bounce"
                        >
                            <VolumeX /> Unmute to Listen
                        </button>
                    </div>
                )}

                {/* Overlays */}
                <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={onClose} className="p-2 bg-white/10 hover:bg-red-500/80 rounded-full text-white backdrop-blur-md transition-colors">
                        <X />
                    </button>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between group opacity-0 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-4">
                        <button onClick={togglePlay} className="text-white hover:text-brand transition-colors">
                            {isPlaying ? <Pause /> : <Play />}
                        </button>
                        <button onClick={toggleMute} className="text-white hover:text-brand transition-colors">
                            {isMuted ? <VolumeX /> : <Volume2 />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 -z-10" onClick={onClose} />
        </div>
    );
};

export default LessonVideoPlayer;
