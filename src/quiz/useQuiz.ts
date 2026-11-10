import { useCallback, useState } from 'react'
import { advance, answerQuestion, createSession } from './engine.ts'
import type { Choice, QuizTopic, Session } from './types.ts'

export function useQuiz<TChoice extends Choice>(topic: QuizTopic<TChoice>) {
  const [session, setSession] = useState<Session<TChoice> | null>(null)

  const start = useCallback(() => {
    setSession(createSession(topic))
  }, [topic])

  const choose = useCallback(
    (choiceId: string) => {
      setSession((current) => (current ? answerQuestion(current, topic, choiceId) : current))
    },
    [topic],
  )

  const next = useCallback(() => {
    setSession((current) => (current ? advance(current) : current))
  }, [])

  const restart = useCallback(() => {
    setSession(null)
  }, [])

  let phase: 'start' | 'quiz' | 'results' = 'start'
  if (session?.status === 'complete') phase = 'results'
  else if (session) phase = 'quiz'

  return { phase, session, start, choose, next, restart }
}
