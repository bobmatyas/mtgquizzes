import { useEffect, useRef } from 'react'

interface ResultsProps {
  score: number
  total: number
  onRestart: () => void
}

function encouragement(score: number, total: number): string {
  if (total === 0) return 'Start a round whenever you are ready.'
  const ratio = score / total
  if (ratio === 1) return 'Perfect. You know these combinations cold.'
  if (ratio >= 0.7) return 'Strong work. A few more passes and these names will stick.'
  if (ratio >= 0.4) return 'You are building the map. Try another round and notice the color groups.'
  return 'Good start. The names get easier once the color groups feel familiar.'
}

export function Results({ score, total, onRestart }: ResultsProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <section className="panel results">
      <h2 ref={headingRef} tabIndex={-1} className="panel-title">
        Quiz complete
      </h2>
      <p className="results-score">
        <span className="results-score-value">{score}</span>
        <span className="results-score-total">out of {total}</span>
      </p>
      <p className="lede">{encouragement(score, total)}</p>
      <button type="button" className="primary" onClick={onRestart}>
        Start over
      </button>
    </section>
  )
}
