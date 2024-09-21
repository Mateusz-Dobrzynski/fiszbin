import { Flashcards } from "./@types/flashcards";
import writeFlashcardsOllama from "./writeFlashcardsOllama";
import writeFlashcardsOpenAi from "./writeFlashcardsOpenAi";

async function writeFlashcards(
  textContext: string,
  type: "local" | "remote"
): Promise<Flashcards> {
  if (type === "local") {
    return writeFlashcardsOllama("gemma2:27b", textContext);
  } else if (type === "remote") {
    return writeFlashcardsOpenAi("gpt-4o-mini", textContext);
  }
  throw Error("Could not determine LLM type");
}

export default writeFlashcards;
