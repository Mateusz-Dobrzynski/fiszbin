import writeFlashcardsOllama from "./writeFlashcardsOllama";
import writeFlashcardsOpenAi from "./writeFlashcardsOpenAi";

async function writeFlashcards(textContext: string, type: "local" | "remote") {
  if (type === "local") {
    writeFlashcardsOllama("gemma2:27b", textContext);
  } else if (type === "remote") {
    writeFlashcardsOpenAi("gpt-4o-mini", textContext);
  }
}

export default writeFlashcards;
