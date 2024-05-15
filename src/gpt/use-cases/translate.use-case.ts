import OpenAI from 'openai';

interface Options {
  prompt: string;
  lang: string;
}

export const translateUseCase = async (
  openai: OpenAI,
  { prompt, lang }: Options,
) => {
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `번역 해줘... ${lang}:${prompt}`,
      },
    ],
    model: 'gpt-3.5-turbo',
    temperature: 0.2,
    // max_tokens: 500,
  });

  return {
    message: response.choices[0].message.content,
  };
};
