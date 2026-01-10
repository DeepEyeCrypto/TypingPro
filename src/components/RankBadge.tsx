import { getRank } from '@src/utils/rankSystem'
import './RankBadge.css'

interface RankBadgeProps {
    wpm: number
    progress: number
    compact?: boolean
}

export const RankBadge = ({ wpm, progress, compact = false }: RankBadgeProps) => {
    const rankInfo = getRank(wpm);

    return (
        <div className={`rank-badge ${compact ? 'compact' : ''} ${rankInfo.className || ''}`}>
            <div className="rank-icon">
                {/* 
                  Note: In a full implementation, we'd map rank labels to actual icons.
                  For now, we'll use a placeholder or the color context.
                */}
                <span style={{ color: rankInfo.color }}>🏆</span>
            </div>
            {!compact && (
                <>
                    <div className="rank-info">
                        <div className="rank-name" style={{
                            color: rankInfo.color,
                            textShadow: `0 0 10px ${rankInfo.color}44`
                        }}>
                            {rankInfo.label}
                        </div>
                        <div className="rank-level">Elite Tier</div>
                    </div>
                    <div className="rank-progress-bar">
                        <div
                            className="rank-progress-fill"
                            style={{
                                width: `${progress}%`,
                                color: rankInfo.color,
                                background: `linear-gradient(90deg, ${rankInfo.color}, #fff)`
                            }}
                        />
                    </div>
                </>
            )}
        </div>
    )
}
