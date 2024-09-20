import writeFlashcardsOllama from "./writeFlashcardsOllama";

async function writeFlashcards(textContext: string, type: "local" | "remote") {
  if (type === "local") {
    writeFlashcardsOllama("gemma2:27b", textContext);
  } else if (type === "remote") {
    // TODO implement the remote openai api version
  }
}

export default writeFlashcards;
