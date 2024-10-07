import writeFlashcards from "./writeFlashcards";
import {
  createTextImportableToAnki,
  readFileContent,
  writeFlashcardsToJsonFile,
  writeToTextFile,
} from "./utils/fileOperations";
import { ankiConnectHealthcheck, bulkSendToAnki } from "./ankiConnect";
import { Flashcard } from "./types/flashcard";

// This is the main function that will be called to generate the flashcards
// The first argument is the model name, the second argument is the path to the text content
// The text content can be in markdown format
// The output will be saved in the responses folder
// The model you want to use, must be downloaded locally on ollama
// Bigger models will take more time to generate the flashcards but will be more accurate
// The model I found to work pretty good is "gemma2:27b"
// You can experiment with other (possibly smaller) models

// TODO check if possible to run await without a wrapper main function
// If done so, it causes an error in the current setup
// if module in the tsconfig file set to: "module": "es2022", then ollama library import doesn't work
const main = async () => {
  await ankiConnectHealthcheck();
  const textContext = await readFileContent("test/notes/Sieć Neuronowa.md");
  const flashcards = await writeFlashcards(textContext, "remote");
  flashcards.forEach((flashcard) => console.log(flashcard));
  await bulkSendToAnki(flashcards);
};

main();
