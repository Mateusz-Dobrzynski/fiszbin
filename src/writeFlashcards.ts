import { FiszbinSettings, Flashcard, LLMConnectionType } from "./types/types";
import { OllamaWriter } from "./writeFlashcardsOllama";
import { OpenAiWriter } from "./writeFlashcardsOpenAi";

export class FlashcardsWriter {
  settings: FiszbinSettings;
  type: LLMConnectionType;

  constructor(settings: FiszbinSettings) {
    this.settings = settings;
    this.type = settings.LLMConnectionType;
  }

  async writeFlashcards(textContext: string): Promise<Flashcard[]> {
    if (this.type === "local") {
      return new OllamaWriter(this.settings).writeFlashcardsOllama(
        "gemma2:27b",
        textContext
      );
    } else if (this.type === "remote") {
      return new OpenAiWriter(this.settings).writeFlashcardsOpenAi(
        "gpt-4o-mini",
        textContext
      );
    }
    throw Error("Could not determine LLM type");
  }
}
