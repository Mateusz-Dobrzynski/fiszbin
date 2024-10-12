import { promises as fs } from "fs";
import { assert } from "console";
import { Flashcard } from "src/types/types";

async function readFileContent(filePath: string): Promise<string> {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return data;
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
}

function convertResponseToJson(data: string): JSON[] {
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    throw error;
  }
}

function convertResponseToFlashcards(aiResponse: string): Flashcard[] {
  const json = convertResponseToJson(aiResponse);
  const flashcards = [];
  for (const element of json) {
    try {
      flashcards.push(convertJsonToFlashcard(element));
    } catch {
      continue;
    }
  }
  return flashcards;
}

function convertJsonToFlashcard(json: JSON): Flashcard {
  const keys = Object.keys(json);
  assert(keys.includes("question"));
  assert(keys.includes("answer"));
  return json as unknown as Flashcard;
}

async function writeFlashcardsToJsonFile(
  filePath: string,
  flashcards: Flashcard[]
): Promise<void> {
  try {
    await fs.writeFile(filePath, JSON.stringify(flashcards, null, 2), "utf-8");
    console.log(`Response written successfully to ${filePath}`);
  } catch (error) {
    console.error("Error while saving as JSON:", error);
    throw error;
  }
}

async function writeToTextFile(filePath: string, data: string): Promise<void> {
  try {
    await fs.writeFile(filePath, data, "utf-8");
    console.log(`Text written successfully to ${filePath}`);
  } catch (error) {
    console.error("Error writing file:", error);
    throw error;
  }
}

function createTextImportableToAnki(flashcards: Flashcard[]): string {
  try {
    let ankiDeck = "";
    for (const flashcard of flashcards) {
      if (flashcard.question && flashcard.answer) {
        ankiDeck += flashcard.question + ";" + flashcard.answer + "\n";
      }
    }
    return ankiDeck;
  } catch (error) {
    console.error("Error while compiling an importable Anki text:", error);
    throw error;
  }
}

export {
  readFileContent,
  writeToTextFile,
  writeFlashcardsToJsonFile,
  createTextImportableToAnki,
  convertResponseToJson,
  convertResponseToFlashcards,
};
