import { Editor, MarkdownView, Notice, Plugin } from "obsidian";
import { defaultModel } from "./types/types";
import { generate_flashcards_prompt } from "./prompts/generate_flashcards_json";
import { FlashcardsWriter } from "./writeFlashcards";
import { FiszbinSettings } from "./types/types";
import { AnkiConnect } from "./ankiConnect";
import { FiszbinSettingsTab } from "./fiszbinSettingsTab";
import { FlashcardsModal } from "./flashcardsModal";

const DEFAULT_SETTINGS: FiszbinSettings = {
  apiKey: "",
  url: "http://127.0.0.1:8765",
  deckName: "Fiszbin",
  model: defaultModel,
  password: undefined,
  ankiConnectVersion: 6,
  writeFlashcardsPrompt: generate_flashcards_prompt,
  LLMConnectionType: "remote",
  rememberDeck: false,
};

export default class Fiszbin extends Plugin {
  settings: FiszbinSettings;

  async onload() {
    await this.loadSettings();
    const flashcardsWriter = new FlashcardsWriter(this.settings);
    const ankiConnect = new AnkiConnect(this.settings);

    this.addCommand({
      id: "fiszbin-create-flashcards-from-current-note",
      name: "Create flashcards from current note",
      callback: async () => writeFlashcardsFromFile(),
    });

    const writeFlashcardsFromFile = async () => {
      const view = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (!view) {
        return;
      }
      const fileContents = view.editor.getValue();

      new Notice(`Writing flashcards from "${view.file?.name}"`);
      const flashcards = await flashcardsWriter.writeFlashcards(fileContents);

      new FlashcardsModal(
        this.app,
        this.settings,
        flashcards,
        ankiConnect,
        this
      ).open();
    };

    const writeFlashcardsFromSelection = async (editor: Editor) => {
      const selection = editor.getSelection();
      if (selection == "") {
        await writeFlashcardsFromFile();
        return;
      }
      new Notice(`Writing flashcards from "${selection.substring(0, 15)}..."`);
      const flashcards = await flashcardsWriter.writeFlashcards(selection);
      new FlashcardsModal(
        this.app,
        this.settings,
        flashcards,
        ankiConnect,
        this
      ).open();
    };

    this.addCommand({
      id: "fiszbin-create-flashcards-from-current-selection",
      name: "Create flashcards from current selection",
      editorCallback: async (editor: Editor) => {
        await writeFlashcardsFromSelection(editor);
      },
    });

    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu, editor, view) => {
        menu.addItem((item) => {
          item
            .setTitle("Write flashcards from selection")
            .setIcon("notebook-pen")
            .onClick(async () => {
              await writeFlashcardsFromSelection(editor);
            });
        });
      })
    );

    this.addCommand({
      id: "test-flashcards-modal",
      name: "Display flashcards modal (for testing)",
      callback: () => {
        new FlashcardsModal(
          this.app,
          this.settings,
          [
            { question: "Question 1", answer: "Answer 1" },
            { question: "Question 2", answer: "Answer 2" },
            { question: "Question 3", answer: "Answer 3" },
          ],
          ankiConnect,
          this
        ).open();
      },
    });

    this.addSettingTab(new FiszbinSettingsTab(this.app, this));
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
