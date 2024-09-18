import { promises as fs } from "fs";
import path from "path";

async function readFileContent(filePath: string): Promise<string> {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return data;
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
}

function convertStringToJson(data: string): any {
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    throw error;
  }
}

async function writeToJsonFile(filePath: string, data: string): Promise<void> {
  try {
    const jsonData = convertStringToJson(data);
    await fs.writeFile(
      filePath + ".json",
      JSON.stringify(jsonData, null, 2),
      "utf-8"
    );
    console.log(`Response written successfully to ${filePath}.json`);
  } catch (error) {
    console.error("Error while saving as JSON:", error);
    console.log("Trying to save as text instead...");
    writeToTextFile(filePath, data);
  }
}

async function writeToTextFile(filePath: string, data: string): Promise<void> {
  try {
    await fs.writeFile(filePath + ".txt", data, "utf-8");
    console.log(`Response written successfully to ${filePath}.txt`);
  } catch (error) {
    console.error("Error writing file:", error);
    throw error;
  }
}

async function convertToAnkiDeck(filePath: string): Promise<string> {
  try {
    const absolutePath = path.resolve(filePath);
    const fileContent = await fs.readFile(absolutePath, "utf-8");
    const jsonData = JSON.parse(fileContent);
    let ankiDeck = "";
    for (const item of jsonData) {
      if (item.question && item.answer) {
        ankiDeck += item.question + ";" + item.answer + "\n";
      }
    }
    return ankiDeck;
  } catch (error) {
    console.error("Error converting to Anki deck:", error);
    throw error;
  }
}

export { readFileContent, writeToTextFile, writeToJsonFile, convertToAnkiDeck };
