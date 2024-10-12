type Flashcard = {
  question: string;
  answer: string;
};

interface FiszbinSettings {
  apiKey: string;
  url: string;
  deckName: string;
  model: AnkiModel;
  password?: string;
  ankiConnectVersion: number;
  writeFlashcardsPrompt: string;
  LLMConnectionType: LLMConnectionType;
}

type AnkiModel = {
  name: string;
  inOrderFields: string[];
  cardTemplates: Object[];
};

const defaultModel: AnkiModel = {
  name: "Fiszbin",
  inOrderFields: ["question", "answer"],
  cardTemplates: [
    {
      Name: "Fiszbin",
      Front: "{{question}}",
      Back: "{{answer}}",
    },
  ],
};

type LLMConnectionType = "remote" | "local";

export type { Flashcard, LLMConnectionType, FiszbinSettings, AnkiModel };

export { defaultModel };
