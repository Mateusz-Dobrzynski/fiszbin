import { readConfig } from "./types/ankiConfig";
import { Flashcard } from "./types/flashcard";

async function bulkSendToAnki(
  flashcards: Flashcard[],
  deckName?: string,
  modelName?: string
): Promise<void> {
  if (deckName == undefined) {
    deckName = readConfig().deckName;
  }
  if (modelName == undefined) {
    modelName = readConfig().model.name;
  }
  ensureDeckExists(deckName);
  ensureModelExists(modelName);
  const notes = flashcards.map((flashcard) => {
    return {
      deckName: deckName,
      modelName: modelName,
      fields: {
        question: flashcard.question,
        answer: flashcard.answer,
      },
    };
  });
  ankiRequest("addNotes", {
    notes: notes,
  });
}

async function sendToAnki(
  flashcard: Flashcard,
  deckName?: string,
  modelName?: string
): Promise<void> {
  if (deckName == undefined) {
    deckName = readConfig().deckName;
  }
  if (modelName == undefined) {
    modelName = readConfig().model.name;
  }
  ensureDeckExists(deckName);
  ensureModelExists(modelName);
  ankiRequest("addNote", {
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

async function ensureDeckExists(deckName: string): Promise<void> {
  if (!(await deckExists(deckName))) {
    await createDeck(deckName);
  }
}

async function deckExists(deckName: string): Promise<boolean> {
  const deckNames = (await ankiRequest("deckNames")) as string[];
  return deckNames.includes(deckName);
}

async function createDeck(deckName: string): Promise<void> {
  await ankiRequest("createDeck", {
    deck: deckName,
  });
}

async function ensureModelExists(modelName: string): Promise<void> {
  if (!(await modelExists(modelName))) {
    await createModel(modelName);
  }
}

async function modelExists(modelName: string): Promise<boolean> {
  const deckNames = (await ankiRequest("modelNames")) as string[];
  return deckNames.includes(modelName);
}

async function createModel(
  modelName: string,
  inOrderFields?: string[],
  cardTemplates?: Object[]
): Promise<void> {
  const defaultModel = readConfig().model;
  if (inOrderFields == undefined) {
    inOrderFields = defaultModel.inOrderFields;
  }
  if (cardTemplates == undefined) {
    cardTemplates = defaultModel.cardTemplates;
  }

  await ankiRequest("createModel", {
    modelName: modelName,
    inOrderFields: inOrderFields,
    cardTemplates: cardTemplates,
  });
}

async function ankiConnectHealthcheck() {
  try {
    await ankiRequest("deckNames");
  } catch (error) {
    throw Error(`Anki Connect health check failed!\n${error}`);
  }
}

async function ankiRequest(
  action: string,
  params = {}
): Promise<string | string[]> {
  return new Promise(async (resolve, reject) => {
    const config = readConfig();
    await fetch(config.url, {
      method: "POST",
      body: JSON.stringify({
        version: config.ankiConnectVersion,
        action: action,
        params: params,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        const result = json.result;
        const error = json.error;
        if (error != null) {
          reject(
            `Failed to send request to Anki Connect:\n${error}\n${action}\n${params}`
          );
        }
        resolve(result);
      });
  });
}

export { ankiConnectHealthcheck, ankiRequest, bulkSendToAnki, sendToAnki };
