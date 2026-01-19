import React from 'react'
import { CURRICULUM, Lesson } from '../../../data/lessons'
import { SmartLessonGenerator } from '../../../utils/SmartLessonGenerator'
import { useStatsStore } from '../../../core/store/statsStore'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { StatDisplay } from '../../ui/StatDisplay'

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
    <div className="w-full h-full p-8 overflow-y-auto animate-in fade-in duration-500" style={{ color: 'var(--text-primary)' }}>
      {/* Dashboard Hero Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Next Lesson Card */}
        <Card blurLevel="l3" className="relative group overflow-hidden bg-[var(--glass-bg)] border border-glass rounded-[3rem] p-10 shadow-2xl transition-all hover:bg-[var(--glass-hover)]">
          <div className="absolute top-0 right-0 p-6">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30" style={{ color: 'var(--text-primary)' }}>Up Next</span>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic" style={{ color: 'var(--text-accent)' }}>OPERATIONAL_TASK</h3>
              <h2 className="text-4xl font-black tracking-tight uppercase leading-none italic" style={{ color: 'var(--text-primary)' }}>{nextLesson.title}</h2>
              <p className="text-sm opacity-60 leading-relaxed max-w-md font-bold" style={{ color: 'var(--text-primary)' }}>{nextLesson.description}</p>
            </div>

            <div className="flex items-center gap-6 pt-6">
              <Button
                onClick={() => onSelect(nextLesson)}
                variant="primary"
                className="group/btn !rounded-2xl !px-10 !py-6 shadow-xl shadow-[var(--text-accent)]/20 text-[10px] font-black uppercase tracking-[0.4em]"
              >
                Start Training
              </Button>
              <div className="flex gap-2">
                <div className="px-5 py-2 bg-[var(--accent-soft)] border border-[var(--text-accent)]/20 rounded-full">
                  <span className="text-[10px] font-black tabular-nums italic text-[var(--text-accent)]">{nextLesson.targetWPM} WPM Goal</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* AI COACH Card */}
        <Card blurLevel="l3" className="relative group overflow-hidden bg-[var(--glass-bg)] border border-glass rounded-[3rem] p-10 shadow-2xl transition-all hover:bg-[var(--glass-hover)] shadow-[0_32px_64px_-16px_rgba(var(--text-accent),0.1)]">
          <div className="absolute top-0 right-0 p-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--text-accent)] animate-pulse shadow-[0_0_8px_var(--text-accent)]"></div>
              <span className="text-[10px] font-black opacity-80 uppercase tracking-[0.5em] text-[var(--text-accent)]">AI Active</span>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic" style={{ color: 'var(--text-accent)' }}>SYNAPTIC_OVERLAY</h3>
              <h2 className="text-4xl font-black tracking-tight uppercase leading-none italic" style={{ color: 'var(--text-primary)' }}>Neural Drill</h2>
              <p className="text-sm opacity-60 leading-relaxed max-w-md font-bold" style={{ color: 'var(--text-primary)' }}>
                Tactical generation targeting mechanical weaknesses and error-prone bigrams.
              </p>
            </div>

            <div className="pt-6">
              <Button
                onClick={async () => {
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
                }}
                variant="primary"
                className="!rounded-2xl !px-10 !py-6 shadow-xl shadow-[var(--text-accent)]/20 text-[10px] font-black uppercase tracking-[0.4em]"
              >
                Initiate Neural Drill
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {stages.map((stage: string) => (
        <div key={stage} className="mb-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-4">
            <h2 className="text-xs font-black uppercase tracking-[0.5em] opacity-40" style={{ color: 'var(--text-primary)' }}>{stage}</h2>
            <div className="flex-1 h-px border-t border-glass"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {CURRICULUM.filter((l) => l.stage === stage).map((lesson) => {
              const isUnlocked = unlockedIds.includes(lesson.id)
              const isCompleted = completedIds.includes(lesson.id)

              return (
                <button
                  key={lesson.id}
                  onClick={() => onSelect(lesson)}
                  className={`
                    group text-left p-10 rounded-[3rem] border transition-all duration-500 relative overflow-hidden bg-[var(--glass-bg)]
                    border-glass hover:bg-[var(--glass-hover)] hover:border-[var(--text-accent)] cursor-pointer shadow-2xl hover:translate-y-[-4px]
                  `}
                >
                  <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-black tracking-[0.3em] opacity-20 group-hover:opacity-100 transition-opacity uppercase italic`} style={{ color: 'var(--text-primary)' }}>
                        {lesson.id.toUpperCase()}
                      </span>
                      {isCompleted && (
                        <div className="w-8 h-8 rounded-full bg-[var(--text-accent)] flex items-center justify-center border border-[var(--text-accent)] shadow-lg shadow-[var(--text-accent)]/30 scale-110">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3 className={`text-xl font-black italic transition-colors leading-none`} style={{ color: 'var(--text-primary)' }}>
                        {lesson.title}
                      </h3>
                      <p className={`text-[10px] font-bold leading-relaxed line-clamp-2 opacity-50`} style={{ color: 'var(--text-primary)' }}>
                        {lesson.description}
                      </p>
                    </div>

                    <div className="pt-2 flex justify-between items-baseline">
                      <span className="text-[10px] font-black italic text-[var(--text-accent)]">
                        {lesson.targetWPM} WPM
                      </span>
                      {isUnlocked ? (
                        <span className="text-[8px] font-black tracking-widest opacity-20 uppercase" style={{ color: 'var(--text-primary)' }}>Deciphered</span>
                      ) : (
                        <span className="text-[8px] font-black tracking-widest opacity-20 uppercase" style={{ color: 'var(--text-primary)' }}>Locked</span>
                      )}
                    </div>
                  </div>
                  {/* Inner Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--text-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
