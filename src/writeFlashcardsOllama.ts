import ollama from "ollama";
import {
  readFileContent,
  writeToJsonFile,
  convertToAnkiDeck,
  writeToTextFile,
} from "./utils/fileOperations";

async function writeFlashcardsOllama(model: string, inputTextPath: string) {
  const instructions = await readFileContent("src/prompts/prompt_json.txt");
  const textContext = await readFileContent(inputTextPath);

  const response = await ollama.chat({
    model: model,
    messages: [{ role: "user", content: instructions + textContext }],
  });

  writeToJsonFile("src/responses/response", response.message.content).then(
    async () => {
      const ankiDeck = await convertToAnkiDeck("src/responses/response.json");
      writeToTextFile("src/responses/response", ankiDeck);
    }
  );
}

export default writeFlashcardsOllama;
