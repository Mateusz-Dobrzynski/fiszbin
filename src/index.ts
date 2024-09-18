import writeFlashcardsOllama from "./writeFlashcardsOllama";

// This is the main function that will be called to generate the flashcards
// The first argument is the model name, the second argument is the path to the text content
// The text content can be in markdown format
// The output will be saved in the responses folder
// The model you want to use, must be downloaded locally on ollama
// Bigger models will take more time to generate the flashcards but will be more accurate
// The model I found to work pretty good is "gemma2:27b"
// You can experiment with other (possibly smaller) models

writeFlashcardsOllama("gemma2:27b", "test/notes/Oświecenie.md");
