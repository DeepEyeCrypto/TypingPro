import React from 'react';
import { HistoryEntry } from '../types';
import { X, Trash2, Calendar, Clock, Trophy } from 'lucide-react';

interface HistoryModalProps {
    history: HistoryEntry[];
    onClose: () => void;
    onClear: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ history, onClose, onClear }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#111827] w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] border border-gray-200 dark:border-gray-700">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Session History</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Your recent practice sessions</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-0">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
                            <Calendar className="w-12 h-12 mb-3 opacity-20" />
                            <p>No history recorded yet.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-800/50 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 font-semibold text-gray-600 dark:text-gray-300">Date</th>
                                    <th className="px-6 py-3 font-semibold text-gray-600 dark:text-gray-300">Lesson</th>
                                    <th className="px-6 py-3 font-semibold text-gray-600 dark:text-gray-300">WPM</th>
                                    <th className="px-6 py-3 font-semibold text-gray-600 dark:text-gray-300">Accuracy</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {history.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                                            {new Date(entry.date).toLocaleDateString()} <span className="text-xs opacity-50 ml-1">{new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </td>
                                        <td className="px-6 py-3 text-gray-800 dark:text-gray-200 font-medium">
                                            Lesson {entry.lessonId}
                                        </td>
                                        <td className="px-6 py-3 font-mono font-bold text-gray-800 dark:text-white">
                                            {entry.wpm}
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${entry.accuracy >= 98 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                    entry.accuracy >= 95 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                {entry.accuracy}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-[#111827]">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        Total Sessions: <span className="font-semibold">{history.length}</span>
                    </div>
                    {history.length > 0 && (
                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to clear your entire history?')) {
                                    onClear();
                                }
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
                        >
                            <Trash2 className="w-4 h-4" /> Clear History
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryModal;
