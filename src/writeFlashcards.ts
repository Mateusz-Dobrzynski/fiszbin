import { FiszbinSettings, Flashcard } from "./types/types";
import writeFlashcardsOllama from "./writeFlashcardsOllama";
import { OpenAiWriter } from "./writeFlashcardsOpenAi";

export class FlashcardsWriter {
  settings: FiszbinSettings;
  type: "local" | "remote";

  constructor(settings: FiszbinSettings) {
    this.settings = settings;
    this.type = settings.LLMConnectionType;
  }

  async writeFlashcards(textContext: string): Promise<Flashcard[]> {
    if (this.type === "local") {
      return writeFlashcardsOllama("gemma2:27b", textContext);
    } else if (this.type === "remote") {
      return new OpenAiWriter(this.settings).writeFlashcardsOpenAi(
        "gpt-4o-mini",
        textContext
      );
    }
    throw Error("Could not determine LLM type");
  }
}
