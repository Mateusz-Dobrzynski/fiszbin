import ollama from "ollama";
import {
  readFileContent,
  convertResponseToFlashcards,
} from "./utils/fileOperations";
import { Flashcard } from "./types/flashcard";

async function writeFlashcardsOllama(
  model: string,
  textContext: string
): Promise<Flashcard[]> {
  const instructions = await readFileContent(
    "src/prompts/generate_flashcards_json.txt"
  );

  const response = await ollama.chat({
    model: model,
    messages: [{ role: "user", content: instructions + textContext }],
  });

  return convertResponseToFlashcards(response.message.content);
}

export default writeFlashcardsOllama;
