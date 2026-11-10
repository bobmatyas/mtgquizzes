import type { Choice, QuizTopic, Session } from './types.ts'

export function createSession<TChoice extends Choice>(
  topic: QuizTopic<TChoice>,
  { count = 10, random = Math.random }: { count?: number; random?: () => number } = {},
): Session<TChoice> {
  return {
    topicId: topic.id,
    questions: topic.generateQuestions({ count, random }),
    index: 0,
    score: 0,
    status: 'asking',
    selectedId: null,
    feedback: null,
  }
}

export function answerQuestion<TChoice extends Choice>(
  session: Session<TChoice>,
  topic: QuizTopic<TChoice>,
  choiceId: string,
): Session<TChoice> {
  if (session.status !== 'asking') return session

  const question = session.questions[session.index]
  if (!question) return session

  const correct = topic.validateAnswer(question, choiceId)

  return {
    ...session,
    status: 'feedback',
    selectedId: choiceId,
    score: session.score + (correct ? 1 : 0),
    feedback: topic.getFeedback(question, choiceId),
  }
}

export function advance<TChoice extends Choice>(session: Session<TChoice>): Session<TChoice> {
  if (session.status !== 'feedback') return session

  const nextIndex = session.index + 1
  if (nextIndex >= session.questions.length) {
    return { ...session, status: 'complete' }
  }

  return {
    ...session,
    index: nextIndex,
    status: 'asking',
    selectedId: null,
    feedback: null,
  }
}
