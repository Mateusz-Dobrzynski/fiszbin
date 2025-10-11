import { Editor, MarkdownView, Notice, Plugin } from "obsidian";
import { defaultModel, Flashcard } from "./types/types";
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
  automaticallyPresentNewCards: true,
};

export default class Fiszbin extends Plugin {
  settings: FiszbinSettings;
  pendingFlashcards: Flashcard[] = [];

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

      const fileName = view.file?.name || "file";
      new Notice(`Writing flashcards from "${fileName}"`);
      const flashcards = await flashcardsWriter.writeFlashcards(fileContents);

      handleNewFlashcards(flashcards, fileName);
    };

    const handleNewFlashcards = async (
      newFlashcards: Flashcard[],
      source: string
    ) => {
      this.pendingFlashcards = this.pendingFlashcards.concat(newFlashcards);
      if (this.settings.automaticallyPresentNewCards) {
        new FlashcardsModal(this.app, this.settings, ankiConnect, this).open();
      } else {
        new Notice(
          `${newFlashcards.length} flashcard${
            newFlashcards.length > 1 ? "s" : ""
          } from ${source} pending`
        );
      }
    };

    const writeFlashcardsFromSelection = async (editor: Editor) => {
      const selection = editor.getSelection();
      if (selection == "") {
        await writeFlashcardsFromFile();
        return;
      }
      const selectionStart = `${selection.substring(0, 15)}..."`;
      new Notice(`Writing flashcards from ${selectionStart}`);
      const flashcards = await flashcardsWriter.writeFlashcards(selection);
      handleNewFlashcards(flashcards, selectionStart);
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
      id: "fiszbin-view-pending-flashcards",
      name: "View pending flashcards",
      callback: () => {
        new FlashcardsModal(this.app, this.settings, ankiConnect, this).open();
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
