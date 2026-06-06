const numericAnswerPattern = /^[+-]?(?:\d+\.?\d*|\.\d+)$/;
const DECIMAL_ANSWER_TOLERANCE = 0.01;

function isNumericAnswer(answer: string) {
  return numericAnswerPattern.test(answer.trim());
}

export function isAcceptedAnswer(userAnswer: string, correctAnswer: string) {
  const normalizedUserAnswer = userAnswer.trim();
  const normalizedCorrectAnswer = correctAnswer.trim();

  if (
    isNumericAnswer(normalizedUserAnswer) &&
    isNumericAnswer(normalizedCorrectAnswer)
  ) {
    const userNumber = Number(normalizedUserAnswer);
    const correctNumber = Number(normalizedCorrectAnswer);

    if (userNumber === correctNumber) return true;
    if (Number.isInteger(correctNumber)) return false;

    return (
      Math.abs(userNumber - correctNumber) <=
      DECIMAL_ANSWER_TOLERANCE + Number.EPSILON
    );
  }

  return normalizedUserAnswer === normalizedCorrectAnswer;
}
