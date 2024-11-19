import {
  App,
  ButtonComponent,
  Editor,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
} from "obsidian";
import { defaultModel, Flashcard } from "./types/types";
import { generate_flashcards_prompt } from "./prompts/generate_flashcards_json";
import { FlashcardsWriter } from "./writeFlashcards";
import { FiszbinSettings, LLMConnectionType } from "./types/types";
import { AnkiConnect } from "./ankiConnect";

// Remember to rename these classes and interfaces!

const DEFAULT_SETTINGS: FiszbinSettings = {
  apiKey: "",
  url: "http://127.0.0.1:8765",
  deckName: "Fiszbin",
  model: defaultModel,
  password: undefined,
  ankiConnectVersion: 6,
  writeFlashcardsPrompt: generate_flashcards_prompt,
  LLMConnectionType: "remote",
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
      editorCallback: async (editor: Editor) => {
        if (!(await ankiConnect.ankiConnectHealthcheck())) {
          new Notice("Fiszbin: Failed to connect to Anki Connect!");
          return;
        }

        const file_content = editor.getValue();
        const flashcards = await flashcardsWriter.writeFlashcards(file_content);

        new FlashcardsModal(this.app, flashcards, ankiConnect).open();
      },
    });

    this.addCommand({
      id: "fiszbin-create-flashcards-from-current-selection",
      name: "Create flashcards from current selection",
      editorCallback: async (editor: Editor) => {
        if (!(await ankiConnect.ankiConnectHealthcheck())) {
          new Notice("Fiszbin: Failed to connect to Anki Connect!");
          return;
        }
        const selection = editor.getSelection();
        const flashcards = await flashcardsWriter.writeFlashcards(selection);
        new FlashcardsModal(this.app, flashcards, ankiConnect).open();
      },
    });

    this.addCommand({
      id: "test-flashcards-modal",
      name: "Display flashcards modal (for testing)",
      callback: () => {
        new FlashcardsModal(
          this.app,
          [
            { question: "Question 1", answer: "Answer 1" },
            { question: "Question 2", answer: "Answer 2" },
            { question: "Question 3", answer: "Answer 3" },
          ],
          ankiConnect
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

class FlashcardsModal extends Modal {
  flashcards: Flashcard[];
  ankiConnect: AnkiConnect;
  constructor(app: App, flashcards: Flashcard[], ankiConnect: AnkiConnect) {
    super(app);
    this.flashcards = flashcards;
    this.setTitle("Edit your flashcards");
    this.ankiConnect = ankiConnect;
  }

  onOpen(): void {
    // TO-DO: Create an input for defining the destination deck
    this.flashcards.map((flashcard) => {
      const setting = new Setting(this.contentEl);
      setting.addTextArea((textArea) => {
        textArea.setValue(flashcard.question).onChange((value) => {
          flashcard.question = value;
        });
      });
      setting.addTextArea((textArea) => {
        textArea.setValue(flashcard.answer).onChange((value) => {
          flashcard.answer = value;
        });
      });
      setting.addButton((deleteButton) => {
        deleteButton
          .setButtonText("Delete")
          .setIcon("trash")
          .onClick(() => {
            this.flashcards.remove(flashcard);
            setting.settingEl.remove();
          });
      });
    });
    // TO-DO: create a button to add new rows
    new ButtonComponent(this.contentEl)
      .setButtonText("Send to Anki")
      .onClick(() => {
        this.ankiConnect.bulkSendToAnki(this.flashcards);
        this.close();
      });
  }
}

class FiszbinSettingsTab extends PluginSettingTab {
  plugin: Fiszbin;

  constructor(app: App, plugin: Fiszbin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Anki Connect URL")
      .setDesc("Configured in Anki")
      .addText((text) =>
        text
          .setPlaceholder("http://127.0.0.1:8765")
          .setValue(this.plugin.settings.url)
          .onChange(async (value) => {
            this.plugin.settings.url = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("LLM connection type")
      .setDesc("")
      .addDropdown((component) => {
        component
          .addOption("local", "Local (Ollama only)")
          .addOption("remote", "Remote (OpenAI only)")
          .setValue(this.plugin.settings.LLMConnectionType)
          .onChange(async (value) => {
            this.plugin.settings.LLMConnectionType = value as LLMConnectionType;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName("Open AI API Key")
      .setDesc("If you're using a remote connection, paste your API key here")
      .addText((text) => {
        text.setValue(this.plugin.settings.apiKey).onChange(async (value) => {
          this.plugin.settings.apiKey = value;
          await this.plugin.saveSettings();
        });
      });
  }
}
