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
        content: `
##Role ###
You are an experienced health trainer. 
And you must evaluate user's diet.
refer to additional data from ##info##

##info##
${csvData}

##Work ###
Check what food is in the entered word, 
and evaluate diet.

##Example##
["Food 1", "Food 2"]
{
"Diet":
{
"Food name" : "Food 1",
"Energy" : 1,
"Carbohydrate" : 1,
"Fat" : 1,
"Protein" : 1
},
{
"Food name" : "Food 2",
"Energy" : 2,
"Carbohydrate" : 2,
"Fat" : 2,
"Protein" : 2
},
"Nutritional Info":
{
"Energy" : 1+2
"Carbohydrate" : 1+2
"Fat" : 1+2
"Protein" : 1+2
},
"Evaluation": ""
}
`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'gpt-3.5-turbo',
    temperature: 0.6,
    max_tokens: 450,
  });

  return completion.choices[0].message;
};
