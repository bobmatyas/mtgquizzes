import { AnswerChoices } from './components/AnswerChoices.tsx'
import { Feedback } from './components/Feedback.tsx'
import { Progress } from './components/Progress.tsx'
import { QuestionPrompt } from './components/QuestionPrompt.tsx'
import { Results } from './components/Results.tsx'
import { StartScreen } from './components/StartScreen.tsx'
import { topics } from './quiz/topics.ts'
import { useQuiz } from './quiz/useQuiz.ts'

const topic = topics[0]

export default function App() {
  const quiz = useQuiz(topic)
  const session = quiz.session
  const question = session?.questions[session.index]
  const revealed = session?.status === 'feedback'
  const isLast = session ? session.index === session.questions.length - 1 : false

  return (
    <main className="app">
      <header className="site-header">
        <p className="kicker">Beginner study</p>
        <h1>MTG Quizzes</h1>
      </header>

      {quiz.phase === 'start' && <StartScreen topic={topic} onStart={quiz.start} />}

      {quiz.phase === 'quiz' && session && question && (
        <section className="panel quiz" aria-labelledby="question-heading" key={question.id}>
          <Progress
            current={session.index + 1}
            total={session.questions.length}
            score={session.score}
            answered={session.status === 'feedback' ? session.index + 1 : session.index}
          />
          <QuestionPrompt id="question-heading" prompt={question.prompt} />
          <AnswerChoices
            choices={question.choices}
            selectedId={session.selectedId}
            correctChoiceId={session.status === 'feedback' ? session.feedback.correctChoiceId : null}
            revealed={revealed}
            onSelect={quiz.choose}
            renderChoice={topic.renderChoice}
          />
          {session.status === 'feedback' && (
            <>
              <Feedback feedback={session.feedback} />
              <button type="button" className="primary next-question" onClick={quiz.next}>
                {isLast ? 'See results' : 'Next question'}
              </button>
            </>
          )}
        </section>
      )}

      {quiz.phase === 'results' && session && (
        <Results score={session.score} total={session.questions.length} onRestart={quiz.restart} />
      )}
    </main>
  )
}
