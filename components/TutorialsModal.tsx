import React, { useState } from 'react';
import { X, PlayCircle, Video as VideoIcon } from 'lucide-react';

interface TutorialsModalProps {
    onClose: () => void;
    initialVideoId?: number;
}

const VIDEOS = [
    {
        id: 1,
        title: "Introduction to Touch Typing",
        description: "Learn the proper posture and finger placement.",
        src: "assets/Learn teach 1.mp4"
    },
    {
        id: 2,
        title: "Basic Keys & Home Row",
        description: "Master the home row keys and basic hand movements.",
        src: "assets/Learn teach 2.mp4"
    }
];

const TutorialsModal: React.FC<TutorialsModalProps> = ({ onClose, initialVideoId }) => {
    const [currentVideo, setCurrentVideo] = useState(() => {
        if (initialVideoId) {
            return VIDEOS.find(v => v.id === initialVideoId) || VIDEOS[0];
        }
        return VIDEOS[0];
    });

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">

                {/* Video Player Area */}
                <div className="flex-1 bg-black flex flex-col items-center justify-center relative group">
                    <video
                        key={currentVideo.src}
                        controls
                        autoPlay
                        className="max-h-[60vh] md:max-h-full w-full object-contain"
                    >
                        <source src={currentVideo.src} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* Sidebar / List */}
                <div className="w-full md:w-80 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <VideoIcon className="w-5 h-5 text-blue-500" />
                            Tutorials
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {VIDEOS.map((video) => (
                            <button
                                key={video.id}
                                onClick={() => setCurrentVideo(video)}
                                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 flex gap-3 ${currentVideo.id === video.id
                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 ring-1 ring-blue-500/20'
                                    : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-white dark:hover:bg-gray-800'
                                    }`}
                            >
                                <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${currentVideo.id === video.id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                    }`}>
                                    <PlayCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className={`font-semibold text-sm ${currentVideo.id === video.id ? 'text-blue-700 dark:text-blue-400' : 'text-gray-900 dark:text-gray-200'
                                        }`}>
                                        {video.title}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                                        {video.description}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorialsModal;
