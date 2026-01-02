import React from 'react'
import { CURRICULUM, Lesson } from '@src/data/lessons'
import '@src/components/CurriculumSelector.css'

interface LessonSelectorProps {
  unlockedIds: string[],
  completedIds: string[],
  onSelect: (lesson: Lesson) => void
}

export const LessonSelector = ({
  unlockedIds,
  completedIds,
  onSelect
}: LessonSelectorProps) => {
  const stages = Array.from(new Set(CURRICULUM.map((l) => l.stage)))

  return (
    <div className="lesson-selector custom-scrollbar">
      {stages.map((stage) => (
        <div key={stage} className="stage-group">
          <h2 className="stage-title">{stage}</h2>
          <div className="lesson-grid">
            {CURRICULUM.filter((l) => l.stage === stage).map((lesson) => {
              const isUnlocked = unlockedIds.includes(lesson.id)
              const isCompleted = completedIds.includes(lesson.id)

              return (
                <button
                  key={lesson.id}
                  className={`lesson-card ${isUnlocked ? 'unlocked' : 'locked'} ${isCompleted ? 'completed' : ''}`}
                  disabled={!isUnlocked}
                  onClick={() => onSelect(lesson)}
                >
                  <div className="lesson-header">
                    <span className="lesson-id">{lesson.id.toUpperCase()}</span>
                    {isCompleted && <span className="check-icon">✓</span>}
                    {!isUnlocked && <span className="lock-icon">🔒</span>}
                  </div>
                  <div className="lesson-body">
                    <h3 className="lesson-title">{lesson.title}</h3>
                    <p className="lesson-desc">{lesson.description}</p>
                  </div>
                  <div className="lesson-footer">
                    <span>Target: {lesson.targetWPM} WPM</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
