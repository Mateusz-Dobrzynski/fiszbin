interface FiszbinSettings {
  apiKey: string;
  url: string;
  deckName: string;
  model: AnkiModel;
  password?: string;
  ankiConnectVersion: number;
}

const readConfig = () => {
  // TO-DO: implement reading a config
  // possibly to be implemented when integrating with Obsidian
  // (it has its own way of handling settings)
  return "";
};

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

export type { FiszbinSettings as AnkiConfig };
export { readConfig, defaultModel };
