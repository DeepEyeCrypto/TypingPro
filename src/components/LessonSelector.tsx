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
    <div className="w-full h-full text-white p-8 overflow-y-auto animate-in fade-in duration-500">
      {/* Dashboard Hero Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Next Lesson Card */}
        <Card blurLevel="l3" className="relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white opacity-40">Sequence_Next</span>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white opacity-50">Operational_Target</h3>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">{nextLesson.title}</h2>
              <p className="text-sm text-white opacity-60 leading-relaxed max-w-md">{nextLesson.description}</p>
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
                <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
                  <span className="text-[10px] font-bold tabular-nums text-white opacity-60">{nextLesson.targetWPM} WPM_GOAL</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* AI COACH Card */}
        <Card blurLevel="l3" className="relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
              <span className="text-[10px] font-black opacity-80 uppercase tracking-[0.5em] text-white">Neural_Active</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white opacity-60">Intelligence_Training</h3>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">Smart_Drill</h2>
              <p className="text-sm text-white opacity-60 leading-relaxed max-w-md">
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
            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-white opacity-40">{stage}</h2>
            <div className="flex-1 h-px bg-white/10"></div>
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
                    group text-left p-10 rounded-[3rem] border transition-all duration-500 relative overflow-hidden bg-white/5 backdrop-blur-[64px]
                    border-white/5 hover:bg-white/10 hover:border-white/10 cursor-pointer shadow-2xl hover:translate-y-[-4px] text-white
                  `}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-black tracking-widest text-white opacity-20 group-hover:opacity-80 transition-opacity`}>
                        {lesson.id.toUpperCase()}
                      </span>
                      {isCompleted && (
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center border border-white/10 shadow-md">
                          <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className={`font-bold transition-colors text-white`}>
                        {lesson.title}
                      </h3>
                      <p className={`text-[10px] leading-relaxed line-clamp-2 text-white opacity-60`}>
                        {lesson.description}
                      </p>
                    </div>

                    <div className="pt-2">
                      <span className="text-[9px] font-bold text-white opacity-30">
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
