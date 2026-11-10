interface ProgressProps {
  current: number
  total: number
  score: number
  answered: number
}

export function Progress({ current, total, score, answered }: ProgressProps) {
  const width = total === 0 ? 0 : (answered / total) * 100

  return (
    <div className="progress">
      <p className="progress-label">
        <span>
          Question {current} of {total}
        </span>
        <span>{score} correct</span>
      </p>
      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}
