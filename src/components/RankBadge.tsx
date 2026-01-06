import { Rank } from '@src/services/rankSystem'
import './RankBadge.css'

interface RankBadgeProps {
    rank: Rank
    progress: number
    compact?: boolean
}

export const RankBadge = ({ rank, progress, compact = false }: RankBadgeProps) => {
    return (
        <div className={`rank-badge ${compact ? 'compact' : ''}`}>
            <div className="rank-icon" style={{ color: rank.accentColor }}>
                {rank.icon}
            </div>
            {!compact && (
                <>
                    <div className="rank-info">
                        <div className="rank-name" style={{ color: rank.accentColor }}>
                            {rank.name}
                        </div>
                        <div className="rank-level">Level {rank.level}</div>
                    </div>
                    <div className="rank-progress-bar">
                        <div
                            className="rank-progress-fill"
                            style={{
                                width: `${progress}%`,
                                background: rank.accentColor
                            }}
                        />
                    </div>
                </>
            )}
        </div>
    )
}
