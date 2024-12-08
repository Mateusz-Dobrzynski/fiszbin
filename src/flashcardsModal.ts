import { App, Modal, Notice, Setting } from "obsidian";
import { AnkiConnect } from "./ankiConnect";
import { FiszbinSettings, Flashcard } from "./types/types";
import Fiszbin from "./main";

export class FlashcardsModal extends Modal {
  flashcards: Flashcard[];
  ankiConnect: AnkiConnect;
  settings: FiszbinSettings;
  deckName: string;
  plugin: Fiszbin;
  constructor(
    app: App,
    settings: FiszbinSettings,
    flashcards: Flashcard[],
    ankiConnect: AnkiConnect,
    plugin: Fiszbin
  ) {
    super(app);
    this.flashcards = flashcards;
    this.setTitle("Edit your flashcards");
    this.ankiConnect = ankiConnect;
    this.settings = settings;
    this.deckName = settings.deckName;
    this.plugin = plugin;
  }

  onOpen(): void {
    const mainSetting = new Setting(this.contentEl);

    // Target deck name input
    mainSetting.addText((text) => {
      text.setValue(this.settings.deckName).onChange(async (value) => {
        this.deckName = value;
        if (this.settings.rememberDeck) {
          this.settings.deckName = value;
          await this.plugin.saveSettings();
        }
      });
    });

    // New row button
    mainSetting.addButton((button) => {
      button.setButtonText("New row").onClick(() => {
        const setting = new Setting(this.contentEl);
        setting.setClass("fiszbin_flashcard_rows");
        const flashcard: Flashcard = {
          question: "Question",
          answer: "Answer",
        };
        this.flashcards.push(flashcard);
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
    });

    // Send to Anki Button
    mainSetting.addButton((button) => {
      button.setButtonText("Send to Anki").onClick(async () => {
        try {
          if (!(await this.ankiConnect.ankiConnectHealthcheck())) {
            new Notice(
              "Failed to connect to Anki Connect. Make sure Anki is open and Anki Connect is configured"
            );
            return;
          }
          const createdNotesIds = await this.ankiConnect.bulkSendToAnki(
            this.flashcards,
            this.deckName
          );
          new Notice(
            `${createdNotesIds.length} flashcards successfully sent to Anki`
          );
        } catch (error) {
          new Notice(`Failed to send flashcards to Anki: ${error}`);
        }
        this.close();
      });
    });

    // Rows including generated flashcards
    this.flashcards.map((flashcard) => {
      const setting = new Setting(this.contentEl);
      setting.setClass("fiszbin_flashcard_rows").addTextArea((textArea) => {
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
  }
}
