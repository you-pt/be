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
And you must manage client's diet.
You must knsow additional data from a ##info##

##info##
${csvData}

##Work ###
Check what food is in the entered word,
And see <Input> and <Output> in ##Example##.
The maximum token of evaluation is 100.
And you can evaluate Diet yourself.

##Example ##
<Input>
["Food 1", "Food 2"]

<Output>
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
}`,
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
