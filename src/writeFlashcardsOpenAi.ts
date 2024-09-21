import OpenAI from "openai";
import { readFileContent, writeToJsonFile } from "./utils/fileOperations";
const openai = new OpenAI();

async function writeFlashcardsOpenAi(model: string, textContext: string) {
  const instructions = await readFileContent(
    "src/prompts/generate_flashcards_json.txt"
  );
  const completion = await openai.chat.completions.create({
    model: model,
    messages: [
      { role: "system", content: instructions },
      {
        role: "user",
        content: textContext,
      },
    ],
  });
  const response = completion.choices[0].message.content;
  if (response) {
    writeToJsonFile("src/responses/response", response);
  }
}

export default writeFlashcardsOpenAi;
