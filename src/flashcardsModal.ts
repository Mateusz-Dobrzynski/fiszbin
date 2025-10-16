import { App, Modal, Notice, Setting } from "obsidian";
import { AnkiConnect } from "./ankiConnect";
import { FiszbinSettings, Flashcard } from "./types/types";
import Fiszbin from "./main";

export class FlashcardsModal extends Modal {
  ankiConnect: AnkiConnect;
  settings: FiszbinSettings;
  deckName: string;
  plugin: Fiszbin;
  constructor(
    app: App,
    settings: FiszbinSettings,
    ankiConnect: AnkiConnect,
    plugin: Fiszbin
  ) {
    super(app);
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
          question: "",
          answer: "",
        };
        this.plugin.pendingFlashcards.push(flashcard);
        setting.addTextArea((textArea) => {
          textArea.setPlaceholder("Question");
          textArea.setValue(flashcard.question).onChange((value) => {
            flashcard.question = value;
          });
        });
        setting.addTextArea((textArea) => {
          textArea.setPlaceholder("Answer");
          textArea.setValue(flashcard.answer).onChange((value) => {
            flashcard.answer = value;
          });
        });
        setting.addButton((deleteButton) => {
          deleteButton
            .setButtonText("Delete")
            .setIcon("trash")
            .onClick(() => {
              this.plugin.pendingFlashcards.remove(flashcard);
              setting.settingEl.remove();
            });
        });
      });
    });

    // Clear all button
    mainSetting.addButton((button) => {
      button.setButtonText("Clear all").onClick(() => {
        console.log(this.contentEl.children);
        this.plugin.pendingFlashcards = [];
        for (let i = this.contentEl.children.length; i > 0; i--) {
          const element = this.contentEl.children.item(i);
          if (element?.className == "setting-item fiszbin_flashcard_rows") {
            element?.remove();
          }
        }
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
            this.plugin.pendingFlashcards,
            this.deckName
          );

          const createdNotesCount = createdNotesIds.length;
          const emptyNotesNotice =
            createdNotesCount != this.plugin.pendingFlashcards.length
              ? ` ${
                  this.plugin.pendingFlashcards.length - createdNotesCount
                } empty flashcards were skipped`
              : "";
          new Notice(
            `${createdNotesIds.length} flashcards successfully sent to Anki.${emptyNotesNotice}`
          );
          this.plugin.pendingFlashcards = [];
        } catch (error) {
          new Notice(`Failed to send flashcards to Anki: ${error}`);
        }
        this.close();
      });
    });

    // Rows including generated flashcards
    this.plugin.pendingFlashcards.map((flashcard) => {
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
            this.plugin.pendingFlashcards.remove(flashcard);
            setting.settingEl.remove();
          });
      });
    });
  }
}
