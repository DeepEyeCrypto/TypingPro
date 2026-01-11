import React from 'react'
import { CURRICULUM, Lesson } from '@src/data/lessons'
import { SmartLessonGenerator } from '@src/utils/SmartLessonGenerator'
import { useStatsStore } from '@src/stores/statsStore'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { StatDisplay } from './ui/StatDisplay'

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
    <div className="w-full h-full text-white/90 p-8 overflow-y-auto animate-in fade-in duration-500">
      {/* Dashboard Hero Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Next Lesson Card */}
        <Card className="p-8 bg-black/20 border-white/5 backdrop-blur-md relative overflow-hidden group hover:border-white/10 transition-colors">
          <div className="absolute top-0 right-0 p-4">
            <span className="text-[10px] font-black text-hacker opacity-20 uppercase tracking-[0.5em]">Sequence_Next</span>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Operational_Target</h3>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">{nextLesson.title}</h2>
              <p className="text-sm text-white/40 leading-relaxed max-w-md">{nextLesson.description}</p>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button
                onClick={() => onSelect(nextLesson)}
                variant="primary"
                className="group/btn"
              >
                START_MISSION
                <svg className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
              <div className="flex gap-2">
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                  <span className="text-[10px] font-bold text-white/40 tabular-nums">{nextLesson.targetWPM} WPM_GOAL</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* AI COACH Card */}
        <Card className="p-8 bg-midnight/40 relative overflow-hidden group border-hacker/10">
          <div className="absolute top-0 right-0 p-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-hacker animate-pulse"></div>
              <span className="text-[10px] font-black text-hacker uppercase tracking-[0.5em]">Neural_Active</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-[10px] font-black text-hacker/50 uppercase tracking-[0.3em]">Intelligence_Training</h3>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">Smart_Drill</h2>
              <p className="text-sm text-white/40 leading-relaxed max-w-md">
                Tactical generation targeting mechanical weaknesses and error-prone bigrams.
              </p>
            </div>

            <div className="pt-4">
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
              >
                INITIATE_AI_SYNC
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {stages.map((stage: string) => (
        <div key={stage} className="mb-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-4">
            <h2 className="text-xs font-black text-white/20 uppercase tracking-[0.5em]">{stage}</h2>
            <div className="flex-1 h-px bg-white/5"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {CURRICULUM.filter((l) => l.stage === stage).map((lesson) => {
              const isUnlocked = unlockedIds.includes(lesson.id)
              const isCompleted = completedIds.includes(lesson.id)

              return (
                <button
                  key={lesson.id}
                  disabled={!isUnlocked}
                  onClick={() => onSelect(lesson)}
                  className={`
                    group text-left p-6 rounded-xl border transition-all duration-300 relative overflow-hidden backdrop-blur-sm
                    ${isUnlocked
                      ? 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/20 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(0,255,65,0.05)]'
                      : 'bg-black/20 border-white/5 opacity-30 cursor-not-allowed grayscale'}
                  `}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-black tracking-widest ${isUnlocked ? 'text-neon-cyan/80' : 'text-white/20'}`}>
                        {lesson.id.toUpperCase()}
                      </span>
                      {isCompleted ? (
                        <div className="w-5 h-5 rounded-full bg-neon-cyan/20 flex items-center justify-center border border-neon-cyan/30 shadow-[0_0_10px_rgba(0,243,255,0.3)]">
                          <svg className="w-3 h-3 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : !isUnlocked && (
                        <svg className="w-4 h-4 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className={`font-bold transition-colors ${isUnlocked ? 'text-white group-hover:text-hacker' : 'text-white/30'}`}>
                        {lesson.title}
                      </h3>
                      <p className={`text-[10px] leading-relaxed line-clamp-2 ${isUnlocked ? 'text-white/40' : 'text-white/10'}`}>
                        {lesson.description}
                      </p>
                    </div>

                    <div className="pt-2">
                      <span className={`text-[9px] font-bold ${isUnlocked ? 'text-white/20' : 'text-white/10'}`}>
                        TARGET: {lesson.targetWPM} WPM
                      </span>
                    </div>
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
