import { App, PluginSettingTab, Setting } from 'obsidian';
import type ProjectOSPlugin from './main';

export interface ProjectOSSettings {
  nearDeadlineDays: number;
  urgentDeadlineDays: number;
}

export const DEFAULT_SETTINGS: ProjectOSSettings = {
  nearDeadlineDays: 7,
  urgentDeadlineDays: 2
};

export class ProjectOSSettingTab extends PluginSettingTab {
  plugin: ProjectOSPlugin;

  constructor(app: App, plugin: ProjectOSPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName('Near deadline threshold (days)')
      .setDesc('Tasks due within this many days will be highlighted as near their deadline.')
      .addText(text => text
        .setPlaceholder('7')
        .setValue(this.plugin.settings.nearDeadlineDays.toString())
        .onChange(async (value) => {
          const parsed = parseInt(value, 10);
          if (!isNaN(parsed)) {
            this.plugin.settings.nearDeadlineDays = parsed;
            await this.plugin.saveSettings();
          }
        }));

    new Setting(containerEl)
      .setName('Urgent deadline threshold (days)')
      .setDesc('Tasks due within this many days will be highlighted as urgent.')
      .addText(text => text
        .setPlaceholder('2')
        .setValue(this.plugin.settings.urgentDeadlineDays.toString())
        .onChange(async (value) => {
          const parsed = parseInt(value, 10);
          if (!isNaN(parsed)) {
            this.plugin.settings.urgentDeadlineDays = parsed;
            await this.plugin.saveSettings();
          }
        }));
  }
}
