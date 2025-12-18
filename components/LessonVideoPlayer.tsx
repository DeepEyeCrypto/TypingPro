import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { X, Maximize, Minimize, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface LessonVideoPlayerProps {
    hlsUrl: string;
    onClose?: () => void;
    autoPlay?: boolean;
    className?: string;
}

const LessonVideoPlayer: React.FC<LessonVideoPlayerProps> = ({
    hlsUrl,
    onClose,
    autoPlay = false,
    className = ''
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasError, setHasError] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true); // Default to muted for safer autoplay, then try to unmute
    const [isAutoplayMuted, setIsAutoplayMuted] = useState(false);

    // Auto-hide controls
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef<NodeJS.Timeout>(null);

    const handleUserActivity = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 3000);
    };

    // Fullscreen logic
    const toggleFullscreen = useCallback(async () => {
        if (!document.fullscreenElement) {
            if (containerRef.current?.requestFullscreen) {
                await containerRef.current.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            }
        }
    }, []);

    useEffect(() => {
        const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFsChange);
        return () => document.removeEventListener('fullscreenchange', handleFsChange);
    }, []);

    // HLS & Video Setup
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let hls: Hls | null = null;

        if (Hls.isSupported()) {
            hls = new Hls({ enableWorker: true, lowLatencyMode: true });
            hls.loadSource(hlsUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.volume = 1.0;
                if (autoPlay) {
                    video.muted = false; // Try unmuted first
                    video.play().catch(() => {
                        console.log("Autoplay with sound blocked, falling back to muted.");
                        video.muted = true;
                        setIsMuted(true);
                        video.play().then(() => {
                            setIsAutoplayMuted(true);
                        }).catch(err => console.error("Muted autoplay also failed:", err));
                    });
                }
            });
            hls.on(Hls.Events.ERROR, (_, data) => {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR: hls?.startLoad(); break;
                        case Hls.ErrorTypes.MEDIA_ERROR: hls?.recoverMediaError(); break;
                        default: hls?.destroy(); setHasError(true); break;
                    }
                }
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = hlsUrl;
            if (autoPlay) {
                // Ensure the video is ready before playing
                video.addEventListener('loadedmetadata', () => {
                    video.muted = false;
                    video.volume = 1.0;
                    video.play().catch(() => { });
                }, { once: true });
            }
        }

        return () => hls?.destroy();
    }, [hlsUrl, autoPlay]);

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (document.fullscreenElement) document.exitFullscreen();
                else onClose?.();
            }
            if (e.key === ' ' || e.key === 'k') {
                e.preventDefault();
                togglePlay();
            }
            if (e.key === 'f') toggleFullscreen();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, toggleFullscreen]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.muted = false; // Unmute on explicit play
                setIsMuted(false);
                setIsAutoplayMuted(false);
                videoRef.current.volume = 1.0;
                videoRef.current.play().catch(err => {
                    console.warn("Play failed:", err);
                });
            } else {
                videoRef.current.pause();
            }
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    if (hasError) return null; // Or error UI

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            {/* Main Player Container */}
            <div
                ref={containerRef}
                className={`relative w-full aspect-video bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/20 group ${className}`}
                onMouseMove={handleUserActivity}
                onMouseLeave={() => isPlaying && setShowControls(false)}
            >
                <video
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    playsInline
                    onClick={togglePlay}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                />

                {/* Glass Controls Overlay */}
                <div
                    className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
                >
                    <div className="flex items-center justify-between gap-4 p-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">

                        <div className="flex items-center gap-2">
                            <button onClick={togglePlay} className="p-2 hover:bg-white/20 rounded-lg text-white transition">
                                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                            </button>
                            <button onClick={toggleMute} className="p-2 hover:bg-white/20 rounded-lg text-white transition">
                                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleFullscreen}
                                className="p-2 hover:bg-white/20 rounded-lg text-white transition"
                                title="Toggle Fullscreen (f)"
                            >
                                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                            </button>

                            {onClose && (
                                <button
                                    onClick={onClose}
                                    className="p-2 bg-red-500/80 hover:bg-red-600 rounded-lg text-white transition shadow-sm"
                                    title="Close Player (Esc)"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Big Center Play Button (only when paused) */}
                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl">
                            <Play className="w-8 h-8 text-white fill-current ml-1" />
                        </div>
                    </div>
                )}

                {/* Unmute Prompt for Autoplay */}
                {isAutoplayMuted && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[60]">
                        <button
                            onClick={() => {
                                if (videoRef.current) {
                                    videoRef.current.muted = false;
                                    setIsMuted(false);
                                    setIsAutoplayMuted(false);
                                }
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-full font-bold shadow-2xl hover:bg-brand-hover animate-bounce"
                        >
                            <Volume2 className="w-5 h-5" />
                            Click to Unmute
                        </button>
                    </div>
                )}
            </div>

            {/* Backdrop Close Area */}
            <div className="absolute inset-0 -z-10" onClick={onClose} />
        </div>
    );
};

export default LessonVideoPlayer;
