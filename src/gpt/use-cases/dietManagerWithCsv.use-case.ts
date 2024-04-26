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
{
	"reportAI" : {
		"Diet": [
			{ "FoodName" : "a", "Energy" : 1, "Carbohydrate" : 1, "Fat" : 1, "Protein" : 1 },
			{ "FoodName" : "b", "Energy" : 2, "Carbohydrate" : 2, "Fat" : 2, "Protein" : 2 },
			{ "FoodName" : "c", "Energy" : 3, "Carbohydrate" : 3, "Fat" : 3, "Protein" : 3 },
		],
		"Nutritional Info": {
			"Energy" : 6, "Carbohydrate" : 6, "Fat" : 6, "Protein" : 6
		},
		"Evaluation": "Your menu is~~"
	}
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
