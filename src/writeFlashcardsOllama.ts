import ollama from "ollama";
import {
  readFileContent,
  writeToJsonFile,
  createTextImportableToAnki,
  writeToTextFile,
} from "./utils/fileOperations";

async function writeFlashcardsOllama(model: string, textContext: string) {
  const instructions = await readFileContent(
    "src/prompts/generate_flashcards_json.txt"
  );

  const response = await ollama.chat({
    model: model,
    messages: [{ role: "user", content: instructions + textContext }],
  });

  writeToJsonFile("src/responses/response", response.message.content).then(
    async () => {
      const ankiDeck = await createTextImportableToAnki(
        "src/responses/response.json"
      );
      writeToTextFile("src/responses/response", ankiDeck);
    }
  );
}

export default writeFlashcardsOllama;
