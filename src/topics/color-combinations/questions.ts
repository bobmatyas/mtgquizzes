import quizColorJson from '../../../json/quiz-color.json' with { type: 'json' }
import type { Choice, GenerateOptions, Question } from '../../quiz/types.ts'

const QUESTION_COUNT = 10

export type ColorCode = 'W' | 'U' | 'B' | 'R' | 'G'

export interface Combination {
  id: string
  name: string
  colorIdentity: string
  colors: ColorCode[]
  colorNames: string[]
  count: number
  category: 'guild' | 'shard' | 'wedge' | 'four-color' | 'five-color'
  omittedColor?: ColorCode
  omittedColorName?: string
}

interface QuizColorData {
  colors: Record<ColorCode, string>
  combinations: Combination[]
}

export interface ColorAnswer extends Choice {
  colors?: ColorCode[]
}

const quizColor = quizColorJson as QuizColorData

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    const current = copy[index]
    copy[index] = copy[swapIndex]
    copy[swapIndex] = current
  }
  return copy
}

function formatColorList(colorNames: readonly string[]): string {
  if (colorNames.length <= 1) return colorNames[0] ?? ''
  if (colorNames.length === 2) return `${colorNames[0]} and ${colorNames[1]}`
  return `${colorNames.slice(0, -1).join(', ')}, and ${colorNames.at(-1)}`
}

function explain(combo: Combination): string {
  const colors = formatColorList(combo.colorNames)
  if (combo.omittedColorName) {
    return `${combo.name} is ${colors}. It leaves out ${combo.omittedColorName}.`
  }
  return `${combo.name} is ${colors}.`
}

function distractorsFor(
  combinations: readonly Combination[],
  subject: Combination,
  random: () => number,
): Combination[] {
  const others = combinations.filter((combo) => combo.id !== subject.id)
  const sameCategory = others.filter((combo) => combo.category === subject.category)
  if (sameCategory.length >= 3) return shuffle(sameCategory, random).slice(0, 3)

  const ranked: Combination[] = []
  const distances = [...new Set(others.map((combo) => Math.abs(combo.count - subject.count)))].sort(
    (left, right) => left - right,
  )
  for (const distance of distances) {
    const group = others.filter((combo) => Math.abs(combo.count - subject.count) === distance)
    ranked.push(...shuffle(group, random))
    if (ranked.length >= 3) break
  }
  return ranked.slice(0, 3)
}

function colorListChoice(combo: Combination): ColorAnswer {
  return {
    id: combo.colorIdentity,
    label: formatColorList(combo.colorNames),
    colors: combo.colors,
  }
}

function nameChoice(combo: Combination): ColorAnswer {
  return { id: combo.id, label: combo.name }
}

function colorChoice(code: ColorCode): ColorAnswer {
  return {
    id: code,
    label: quizColor.colors[code],
    colors: [code],
  }
}

function nameToColors(
  combo: Combination,
  combinations: readonly Combination[],
  random: () => number,
): Question<ColorAnswer> {
  const choices = shuffle(
    [colorListChoice(combo), ...distractorsFor(combinations, combo, random).map(colorListChoice)],
    random,
  )
  return {
    id: `${combo.id}:name-to-colors`,
    kind: 'name-to-colors',
    prompt: `Which colors make up ${combo.name}?`,
    choices,
    answer: combo.colorIdentity,
    explanation: explain(combo),
  }
}

function colorsToName(
  combo: Combination,
  combinations: readonly Combination[],
  random: () => number,
): Question<ColorAnswer> {
  const choices = shuffle(
    [nameChoice(combo), ...distractorsFor(combinations, combo, random).map(nameChoice)],
    random,
  )
  return {
    id: `${combo.id}:colors-to-name`,
    kind: 'colors-to-name',
    prompt: `What is the name for ${formatColorList(combo.colorNames)}?`,
    choices,
    answer: combo.id,
    explanation: explain(combo),
  }
}

function nameToOmitted(
  combo: Combination & { omittedColor: ColorCode },
  random: () => number,
): Question<ColorAnswer> {
  const correct = colorChoice(combo.omittedColor)
  const included = shuffle(
    combo.colors.map((code) => colorChoice(code)),
    random,
  ).slice(0, 3)
  return {
    id: `${combo.id}:name-to-omitted`,
    kind: 'name-to-omitted',
    prompt: `Which color does ${combo.name} leave out?`,
    choices: shuffle([correct, ...included], random),
    answer: combo.omittedColor,
    explanation: explain(combo),
  }
}

function omittedToName(
  combo: Combination & { omittedColorName: string },
  combinations: readonly Combination[],
  random: () => number,
): Question<ColorAnswer> {
  const choices = shuffle(
    [nameChoice(combo), ...distractorsFor(combinations, combo, random).map(nameChoice)],
    random,
  )
  return {
    id: `${combo.id}:omitted-to-name`,
    kind: 'omitted-to-name',
    prompt: `Which combination includes every color except ${combo.omittedColorName}?`,
    choices,
    answer: combo.id,
    explanation: explain(combo),
  }
}

function hasOmittedColor(
  combo: Combination,
): combo is Combination & { omittedColor: ColorCode; omittedColorName: string } {
  return combo.omittedColor !== undefined && combo.omittedColorName !== undefined
}

function questionsFor(
  combo: Combination,
  combinations: readonly Combination[],
  random: () => number,
): Question<ColorAnswer>[] {
  const questions = [
    nameToColors(combo, combinations, random),
    colorsToName(combo, combinations, random),
  ]
  if (hasOmittedColor(combo)) {
    questions.push(nameToOmitted(combo, random), omittedToName(combo, combinations, random))
  }
  return questions
}

export function generateQuestions({
  count = QUESTION_COUNT,
  random = Math.random,
}: GenerateOptions = {}): Question<ColorAnswer>[] {
  const pool = quizColor.combinations.flatMap((combo) =>
    questionsFor(combo, quizColor.combinations, random),
  )
  return shuffle(pool, random).slice(0, count)
}

export function validateAnswer(question: Question<ColorAnswer>, choiceId: string): boolean {
  return choiceId === question.answer
}

export function getFeedback(question: Question<ColorAnswer>, choiceId: string) {
  return {
    correct: validateAnswer(question, choiceId),
    correctChoiceId: question.answer,
    explanation: question.explanation,
  }
}
