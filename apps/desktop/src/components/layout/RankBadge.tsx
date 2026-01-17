import { getRankForWPM, calculateProgress } from '../../core/rankSystem'
// import './RankBadge.css' // TODO: Restore when CSS exists

interface RankBadgeProps {
    wpm: number
    progress: number
    compact?: boolean
}

export const RankBadge = ({ wpm, compact = false }: RankBadgeProps) => {
    const rankInfo = getRankForWPM(wpm);
    const progress = calculateProgress(wpm);


    return (
        <div className={`rank-badge ${compact ? 'compact' : ''} ${rankInfo.className || ''}`}>
            <div className="rank-icon">
                {/* 
                  Note: In a full implementation, we'd map rank labels to actual icons.
                  For now, we'll use a placeholder or the color context.
                */}
                <span style={{ color: rankInfo.accentColor }}>{rankInfo.icon}</span>

            </div>
            {!compact && (
                <>
                    <div className="rank-info">
                        <div className="rank-name" style={{
                            color: rankInfo.accentColor,
                            textShadow: `0 0 10px ${rankInfo.accentColor}44`
                        }}>
                            {rankInfo.name}
                        </div>
                        <div className="rank-level">Level {rankInfo.level}</div>
                    </div>
                    <div className="rank-progress-bar">
                        <div
                            className="rank-progress-fill"
                            style={{
                                width: `${progress}%`,
                                backgroundColor: rankInfo.accentColor,
                                boxShadow: `0 0 10px ${rankInfo.accentColor}`
                            }}
                        />
                    </div>

                </>
            )}
        </div>
    )
}
