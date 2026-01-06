import React from 'react'
import { CURRICULUM, Lesson } from '@src/data/lessons'
import { SmartLessonGenerator } from '@src/utils/SmartLessonGenerator'
import { useStatsStore } from '@src/stores/statsStore'
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
  const nextLessonId = unlockedIds[unlockedIds.length - 1]
  const nextLesson = CURRICULUM.find(l => l.id === nextLessonId) || CURRICULUM[0]
  const stages = Array.from(new Set(CURRICULUM.map((l) => l.stage)))

  return (
    <div className="lesson-selector custom-scrollbar">
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-card liquid-glass-card">
            <div className="hero-info">
              <span className="hero-label">NEXT LESSON</span>
              <h2 className="hero-lesson-title">{nextLesson.title}</h2>
              <p className="hero-lesson-desc">{nextLesson.description}</p>
            </div>
            <button className="hero-cta" onClick={() => onSelect(nextLesson)}>
              Start Session
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="hero-card liquid-glass-card smart-training-card" style={{ background: 'rgba(25, 25, 35, 0.6)' }}>
            <div className="hero-info">
              <span className="hero-label" style={{ color: '#00f0ff' }}>🧠 AI COACH</span>
              <h2 className="hero-lesson-title">Intelligent Training</h2>
              <p className="hero-lesson-desc">
                AI-generated drill targeting your weak keys based on latency and error analysis.
              </p>
            </div>
            <button className="hero-cta" onClick={async () => {
              const text = await SmartLessonGenerator.generateIntelligentDrill(50)
              const title = await SmartLessonGenerator.getIntelligentDrillTitle()

              const aiLesson: Lesson = {
                id: 'ai-coach-drill',
                title,
                description: 'Personalized weakness targeting (60% weak + 20% bigrams + 20% flow)',
                text,
                targetWPM: 30,
                focusFingers: ['All'],
                stage: 'AI Coach'
              }
              onSelect(aiLesson)
            }}>
              Start AI Drill
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {stages.map((stage: string) => (
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
