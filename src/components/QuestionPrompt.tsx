import { useEffect, useRef } from 'react'

interface QuestionPromptProps {
  id: string
  prompt: string
}

export function QuestionPrompt({ id, prompt }: QuestionPromptProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [prompt])

  return (
    <h2 ref={headingRef} id={id} tabIndex={-1} className="question-prompt">
      {prompt}
    </h2>
  )
}
