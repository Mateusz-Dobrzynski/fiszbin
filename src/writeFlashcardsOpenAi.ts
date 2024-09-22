import OpenAI from "openai";
import {
  convertResponseToFlashcards,
  readFileContent,
} from "./utils/fileOperations";
import { Flashcard } from "./@types/flashcards";
const openai = new OpenAI();

async function writeFlashcardsOpenAi(
  model: string,
  textContext: string
): Promise<Flashcard[]> {
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
    return convertResponseToFlashcards(response);
  }
  throw Error("Failed to generate flashcards with Open AI");
}

export default writeFlashcardsOpenAi;
