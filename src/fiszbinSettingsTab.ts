import { App, PluginSettingTab, Setting } from "obsidian";
import Fiszbin from "./main";
import { LLMConnectionType } from "./types/types";

export class FiszbinSettingsTab extends PluginSettingTab {
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
      .setDesc("Configured in Anki.")
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
      .setName("Default deck")
      .setDesc("By default, your flashcards will be sent to this deck.")
      .addText((text) => {
        text.setValue(this.plugin.settings.deckName).onChange(async (value) => {
          this.plugin.settings.deckName = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName("Remember deck name")
      .setDesc(
        "If enabled, changing a destination deck in the flashcards modal will override the default deck setting."
      )
      .addToggle((toggle) => {
        toggle.onChange(async (value) => {
          this.plugin.settings.rememberDeck = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName("Automatically present new flashcards")
      .setDesc(
        "Automatically display a modal with new flashcards, when they're ready."
      )
      .addToggle((toggle) => {
        toggle.onChange(async (value) => {
          this.plugin.settings.automaticallyPresentNewCards = value;
          await this.plugin.saveSettings();
        });
      });

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
      .setDesc("If you're using a remote connection, paste your API key here.")
      .addText((text) => {
        text.setValue(this.plugin.settings.apiKey).onChange(async (value) => {
          this.plugin.settings.apiKey = value;
          await this.plugin.saveSettings();
        });
      });
  }
}
