import { useEffect, useRef } from 'react'
import type { AnswerFeedback } from '../quiz/types.ts'

export function Feedback({ feedback }: { feedback: AnswerFeedback }) {
  const regionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    regionRef.current?.focus()
  }, [feedback])

  const tone = feedback.correct ? 'correct' : 'incorrect'

  return (
    <div
      ref={regionRef}
      tabIndex={-1}
      className={`feedback feedback-${tone}`}
      role="status"
      aria-live="polite"
    >
      <p className="feedback-heading">{feedback.correct ? 'Correct' : 'Not quite'}</p>
      <p>{feedback.explanation}</p>
    </div>
  )
}
