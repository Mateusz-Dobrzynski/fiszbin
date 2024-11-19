import { App, Modal, Setting } from "obsidian";
import { AnkiConnect } from "./ankiConnect";
import { FiszbinSettings, Flashcard } from "./types/types";

export class FlashcardsModal extends Modal {
  flashcards: Flashcard[];
  ankiConnect: AnkiConnect;
  settings: FiszbinSettings;
  deckName: string;
  constructor(
    app: App,
    settings: FiszbinSettings,
    flashcards: Flashcard[],
    ankiConnect: AnkiConnect
  ) {
    super(app);
    this.flashcards = flashcards;
    this.setTitle("Edit your flashcards");
    this.ankiConnect = ankiConnect;
    this.settings = settings;
    this.deckName = settings.deckName;
  }

  onOpen(): void {
    const mainSetting = new Setting(this.contentEl);

    // Target deck name input
    mainSetting.addText((text) => {
      text.setValue(this.settings.deckName).onChange((value) => {
        this.deckName = value;
      });
    });

    // New row button
    mainSetting.addButton((button) => {
      button.setButtonText("New row").onClick(() => {
        const setting = new Setting(this.contentEl);
        const flashcard: Flashcard = {
          question: "Question",
          answer: "Answer",
        };
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
      button.setButtonText("Send to Anki").onClick(() => {
        this.ankiConnect.bulkSendToAnki(this.flashcards, this.deckName);
        this.close();
      });
    });

    // Rows including generated flashcards
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
  }
}
