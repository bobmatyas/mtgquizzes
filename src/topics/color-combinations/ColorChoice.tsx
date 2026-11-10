import type { ColorAnswer } from './questions.ts'
import './colors.css'

export function ColorChoice({ choice }: { choice: ColorAnswer }) {
  if (!choice.colors?.length) return choice.label

  return (
    <span className="color-choice">
      <span className="pips" aria-hidden="true">
        {choice.colors.map((color) => (
          <span key={color} className={`pip pip-${color}`} />
        ))}
      </span>
      <span>{choice.label}</span>
    </span>
  )
}
