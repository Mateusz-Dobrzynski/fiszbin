import ollama from "ollama";
import { convertResponseToFlashcards } from "./utils/fileOperations";
import { FiszbinSettings, Flashcard } from "./types/types";

export class OllamaWriter {
  settings: FiszbinSettings;

  constructor(settings: FiszbinSettings) {
    this.settings = settings;
  }

  async writeFlashcardsOllama(
    model: string,
    textContext: string
  ): Promise<Flashcard[]> {
    const instructions = this.writeFlashcardsOllama;

    const response = await ollama.chat({
      model: model,
      messages: [{ role: "user", content: instructions + textContext }],
    });

    return convertResponseToFlashcards(response.message.content);
  }
}
