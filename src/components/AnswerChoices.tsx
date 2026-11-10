import type { ReactNode } from 'react'
import type { Choice } from '../quiz/types.ts'

interface AnswerChoicesProps<TChoice extends Choice> {
  choices: TChoice[]
  selectedId: string | null
  correctChoiceId: string | null
  revealed: boolean
  onSelect: (choiceId: string) => void
  renderChoice?: (choice: TChoice) => ReactNode
}

function choiceState(
  choice: Choice,
  selectedId: string | null,
  correctChoiceId: string | null,
  revealed: boolean,
): 'idle' | 'correct' | 'incorrect' {
  if (!revealed) return 'idle'
  if (choice.id === correctChoiceId) return 'correct'
  if (choice.id === selectedId) return 'incorrect'
  return 'idle'
}

export function AnswerChoices<TChoice extends Choice>({
  choices,
  selectedId,
  correctChoiceId,
  revealed,
  onSelect,
  renderChoice,
}: AnswerChoicesProps<TChoice>) {
  return (
    <div className="choices" role="group" aria-label="Answer choices">
      {choices.map((choice) => {
        const state = choiceState(choice, selectedId, correctChoiceId, revealed)
        const isSelected = choice.id === selectedId
        return (
          <button
            key={choice.id}
            type="button"
            className={`choice choice-${state}`}
            onClick={() => onSelect(choice.id)}
            disabled={revealed}
            aria-pressed={isSelected}
          >
            {renderChoice ? renderChoice(choice) : choice.label}
            {state === 'correct' && <span className="sr-only"> Correct answer.</span>}
            {state === 'incorrect' && <span className="sr-only"> Your answer, incorrect.</span>}
          </button>
        )
      })}
    </div>
  )
}
