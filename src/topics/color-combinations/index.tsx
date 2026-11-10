import type { QuizTopic } from '../../quiz/types.ts'
import { ColorChoice } from './ColorChoice.tsx'
import {
  type ColorAnswer,
  generateQuestions,
  getFeedback,
  validateAnswer,
} from './questions.ts'

export const colorCombinationsTopic = {
  id: 'color-combinations',
  name: 'Color Combinations',
  description:
    'Practice the 26 named color combinations. Match a name to its colors, or colors to a name. Four-color combinations also ask which color they leave out. Each round is ten questions.',
  generateQuestions,
  validateAnswer,
  getFeedback,
  renderChoice(choice: ColorAnswer) {
    return <ColorChoice choice={choice} />
  },
} satisfies QuizTopic<ColorAnswer>
