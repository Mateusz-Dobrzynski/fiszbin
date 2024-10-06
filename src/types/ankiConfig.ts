type AnkiConfig = {
  url: string;
  deckName: string;
  model: AnkiModel;
  password?: string;
  ankiConnectVersion: number;
};

const readConfig = () => {
  // TO-DO: implement reading a config
  // possibly to be implemented when integrating with Obsidian
  // (it has its own way of handling settings)
  return defaultConfig;
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

const defaultConfig: AnkiConfig = {
  url: "http://127.0.0.1:8765",
  deckName: "Fiszbin",
  model: defaultModel,
  password: undefined,
  ankiConnectVersion: 6,
};

export type { AnkiConfig };
export default { defaultConfig };
export { readConfig };
