import { AnkiModel, FiszbinSettings, Flashcard } from "./types/types";

export class AnkiConnect {
  config: {
    url: string;
    deckName: string;
    model: AnkiModel;
    password?: string;
    ankiConnectVersion: number;
  };

  constructor(settings: FiszbinSettings) {
    this.config = {
      url: settings.url,
      deckName: settings.deckName,
      model: settings.model,
      password: settings.password,
      ankiConnectVersion: settings.ankiConnectVersion,
    };
  }

  async bulkSendToAnki(
    flashcards: Flashcard[],
    deckName?: string,
    modelName?: string
  ): Promise<number[]> {
    if (deckName == undefined) {
      deckName = this.config.deckName;
    }
    if (modelName == undefined) {
      modelName = this.config.model.name;
    }
    await this.ensureDeckExists(deckName);
    await this.ensureModelExists(modelName);
    const notes = flashcards
      .filter((flashcard) => {
        return flashcard.question != "" && flashcard.question != "";
      })
      .map((flashcard) => {
        return {
          deckName: deckName,
          modelName: modelName,
          fields: {
            question: flashcard.question,
            answer: flashcard.answer,
          },
        };
      });
    const createdNotesId = await this.ankiRequest("addNotes", {
      notes: notes,
    });
    return createdNotesId as number[];
  }

  async sendToAnki(
    flashcard: Flashcard,
    deckName?: string,
    modelName?: string
  ): Promise<void> {
    if (deckName == undefined) {
      deckName = this.config.deckName;
    }
    if (modelName == undefined) {
      modelName = this.config.model.name;
    }
    await this.ensureDeckExists(deckName);
    await this.ensureModelExists(modelName);
    await this.ankiRequest("addNote", {
      note: {
        deckName: deckName,
        modelName: modelName,
        fields: {
          question: flashcard.question,
          answer: flashcard.answer,
        },
      },
    });
  }

  async ensureDeckExists(deckName: string): Promise<void> {
    if (!(await this.deckExists(deckName))) {
      await this.createDeck(deckName);
    }
  }

  async deckExists(deckName: string): Promise<boolean> {
    const deckNames = (await this.ankiRequest("deckNames")) as string[];
    return deckNames.includes(deckName);
  }

  async createDeck(deckName: string): Promise<void> {
    await this.ankiRequest("createDeck", {
      deck: deckName,
    });
  }

  async ensureModelExists(modelName: string): Promise<void> {
    if (!(await this.modelExists(modelName))) {
      await this.createModel(modelName);
    }
  }

  async modelExists(modelName: string): Promise<boolean> {
    const deckNames = (await this.ankiRequest("modelNames")) as string[];
    return deckNames.includes(modelName);
  }

  async createModel(
    modelName: string,
    inOrderFields?: string[],
    cardTemplates?: Object[]
  ): Promise<void> {
    const defaultModel = this.config.model;
    if (inOrderFields == undefined) {
      inOrderFields = defaultModel.inOrderFields;
    }
    if (cardTemplates == undefined) {
      cardTemplates = defaultModel.cardTemplates;
    }

    await this.ankiRequest("createModel", {
      modelName: modelName,
      inOrderFields: inOrderFields,
      cardTemplates: cardTemplates,
    });
  }

  async ankiConnectHealthcheck(): Promise<boolean> {
    try {
      await this.ankiRequest("deckNames");
      return true;
    } catch (error) {
      return false;
    }
  }

  async ankiRequest(action: string, params = {}): Promise<any | any[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const config = this.config;
        const response = await fetch(config.url, {
          method: "POST",
          body: JSON.stringify({
            version: config.ankiConnectVersion,
            action: action,
            params: params,
          }),
        });
        const json: any = await response.json();
        const result = json.result;
        const error = json.error;
        if (error != null) {
          reject(
            `Failed to send a request to Anki Connect:\n${error}\n${action}\n${params}`
          );
        }
        resolve(result);
      } catch (error) {
        reject(
          `Failed to send a request to Anki Connect:\n${error}\n${action}\n${params}`
        );
      }
    });
  }
}
