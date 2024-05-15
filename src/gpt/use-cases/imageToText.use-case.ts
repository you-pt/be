import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const imageToText = async (openai: OpenAI, { prompt }: Options) => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Please identify the food in the image.
Do the same for images with multiple foods.
I just want a description of the food's name and contents.
Don't say anything else.
Please tell me about 60 tokens per food.
You don't have to use up to the maximum token.
Please refer to the following example.
##example##
Menu: Pizza, with some toppings on it.
Menu: It looks like oven pasta, tomato pasta.
Menu: Oven chicken, it looks less greasy.`,
          },
          {
            type: 'image_url',
            image_url: {
              url: prompt,
              detail: 'low',
            },
          },
        ],
      },
    ],
    model: 'gpt-4-vision-preview',
    temperature: 0.8,
    max_tokens: 600,
  });

  return completion.choices[0].message;
};
