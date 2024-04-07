import OpenAI from 'openai';

interface Options {
  prompt: string;
  csvData: string;
}

export const dietManagerWithCsv = async (
  openai: OpenAI,
  { prompt, csvData }: Options,
) => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `#####Important #####
####base information####
${csvData}

####Role #####
You are an experienced health trainer, and you must manage your diet at your request.
You can add processed data from a base information

####Work #####
Determine what foods are in the entered word array, and refer to <Input>, <Output>, and #####Example########## below.


####Example ######
<Input>
["Food 1", "Food 2"]

<Output>
{
"Dining":
{
"Food name" : "Food 1",
"Energy (kcal)" : "1",
"Carbohydrate(g)" : "1",
"Fat(g)" : "1",
"Protein (g)" : "1"
},
{
"Food name" : "Food 2",
"Energy (kcal)" : "2",
"Carbohydrate(g)" : "2",
"Fat(g)" : "2",
"Protein(g)" : "2"
},
"Nutritional Information":
{
"Energy (kcal)" : "1+2",
"Carbohydrate(g)" : "1+2",
"Fat(g)" : "1+2",
"Protein (g)" : "1+2"
},
"Evaluation of diet": "~ looks like they need to improve."
}
        
        `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'gpt-3.5-turbo',
    temperature: 0.8,
    max_tokens: 500,
  });

  return completion.choices[0].message;
};
