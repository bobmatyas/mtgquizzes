import { useEffect, useRef } from 'react'

interface StartScreenProps {
  topic: {
    name: string
    description: string
  }
  onStart: () => void
}

export function StartScreen({ topic, onStart }: StartScreenProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <section className="panel">
      <h2 ref={headingRef} tabIndex={-1} className="panel-title">
        {topic.name}
      </h2>
      <p className="lede">{topic.description}</p>
      <button type="button" className="primary" onClick={onStart}>
        Start quiz
      </button>
    </section>
  )
}
