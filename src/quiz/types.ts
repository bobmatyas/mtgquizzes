import type { ReactNode } from 'react'

export interface Choice {
  id: string
  label: string
}

export interface Question<TChoice extends Choice = Choice> {
  id: string
  kind: string
  prompt: string
  choices: TChoice[]
  answer: string
  explanation: string
}

export interface AnswerFeedback {
  correct: boolean
  correctChoiceId: string
  explanation: string
}

export interface GenerateOptions {
  count?: number
  random?: () => number
}

export interface QuizTopic<TChoice extends Choice = Choice> {
  id: string
  name: string
  description: string
  generateQuestions: (options?: GenerateOptions) => Question<TChoice>[]
  validateAnswer: (question: Question<TChoice>, choiceId: string) => boolean
  getFeedback: (question: Question<TChoice>, choiceId: string) => AnswerFeedback
  renderChoice?: (choice: TChoice) => ReactNode
}

interface SessionBase<TChoice extends Choice> {
  topicId: string
  questions: Question<TChoice>[]
  index: number
  score: number
}

export type Session<TChoice extends Choice = Choice> = SessionBase<TChoice> &
  (
    | { status: 'asking'; selectedId: null; feedback: null }
    | { status: 'feedback'; selectedId: string; feedback: AnswerFeedback }
    | { status: 'complete'; selectedId: string | null; feedback: AnswerFeedback | null }
  )
