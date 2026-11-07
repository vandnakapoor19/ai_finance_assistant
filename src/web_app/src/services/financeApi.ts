type FinanceAnswer = {
  answer: string;
};

export async function askFinanceQuestion(
  question: string,
): Promise<string> {
  const response = await fetch('/api/finance-qa', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof data.detail === 'string'
        ? data.detail
        : 'Unable to answer your question. Please try again.',
    );
  }

  const result = data as FinanceAnswer;

  if (typeof result.answer !== 'string' || !result.answer.trim()) {
    throw new Error('The backend returned an empty answer.');
  }

  return result.answer;
}