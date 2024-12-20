import OpenAI from "openai";
import { convertResponseToFlashcards } from "./utils/fileOperations";
import { FiszbinSettings, Flashcard } from "./types/types";

export class OpenAiWriter {
  // TO-DO: use electron safeStorage
  // to securely store the API key
  settings: FiszbinSettings;
  openai: OpenAI;

  constructor(settings: FiszbinSettings) {
    this.settings = settings;
    this.openai = new OpenAI({
      apiKey: this.settings.apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  async writeFlashcardsOpenAi(
    model: string,
    textContext: string
  ): Promise<Flashcard[]> {
    const instructions = this.settings.writeFlashcardsPrompt;
    const completion = await this.openai.chat.completions.create({
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
}
