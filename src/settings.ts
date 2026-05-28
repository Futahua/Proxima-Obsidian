import { App, PluginSettingTab, Setting, TextComponent, DropdownComponent, ButtonComponent } from 'obsidian';
import type ProximaPlugin from './main';
import type { PropertySchema, PropertyType, SelectOption, ColorRule, FilterRule } from './types';

export interface ProximaSettings {
  nearDeadlineDays: number;
  urgentDeadlineDays: number;
  projectsFolder: string;
  tasksFolder: string;
  statuses: SelectOption[];
  colorRules: ColorRule[];
  taskSchema?: PropertySchema[]; // DEPRECATED
  projectSchemas: Record<string, PropertySchema[]>;
  projectVisibleProps: Record<string, string[]>;
  projectFilters: Record<string, FilterRule[]>;
}

export const DEFAULT_SETTINGS: ProximaSettings = {
  nearDeadlineDays: 7,
  urgentDeadlineDays: 2,
  projectsFolder: 'projects',
  tasksFolder: 'tasks',
  statuses: [
    { id: 'backlog', name: 'Elastic Backlog', color: '#636e72' },
    { id: 'planned', name: 'Planned', color: '#0984e3' },
    { id: 'running', name: 'Elastic Running', color: '#00b894' },
    { id: 'review', name: 'Finished', color: '#fdcb6e' },
    { id: 'done', name: 'Done', color: '#00cec9' }
  ], 
  colorRules: [
    { id: '1', targetDate: 'deadline', condition: 'is relative to today', value: 'overdue', color: '#E5484D' },
    { id: '2', targetDate: 'deadline', condition: 'is relative to today', value: 'today', color: '#FFB224' },
    { id: '3', targetDate: 'deadline', condition: 'is relative to today', value: 'next 3 days', color: '#FFD60A' },
    { id: '4', targetDate: 'deadline', condition: 'is relative to today', value: 'next week', color: '#A7C957' }
  ],
  projectFilters: {},
  projectSchemas: {},
  projectVisibleProps: {},
  taskSchema: [
    {
      id: 'priority',
      name: 'Priority',
      type: 'select',
      options: [
        { id: '1', name: 'P1', color: '#ff6b6b' },
        { id: '2', name: 'P2', color: '#feca57' },
        { id: '3', name: 'P3', color: '#48dbfb' }
      ]
    },
    {
      id: 'tags',
      name: 'Tags',
      type: 'multi-select',
      options: [
        { id: 'bug', name: 'Bug', color: '#e84393' },
        { id: 'feature', name: 'Feature', color: '#00cec9' },
        { id: 'ui', name: 'UI/UX', color: '#a29bfe' }
      ]
    },
    {
      id: 'energy',
      name: 'Energy Required',
      type: 'select',
      options: [
        { id: 'high', name: 'High ??', color: '#d63031' },
        { id: 'medium', name: 'Medium ??', color: '#fdcb6e' },
        { id: 'low', name: 'Low ??', color: '#00b894' }
      ]
    },
    {
      id: 'effort',
      name: 'Effort (Hours)',
      type: 'number'
    },
    {
      id: 'client_ready',
      name: 'Client Ready',
      type: 'checkbox'
    }
  ]
};

export class ProximaSettingTab extends PluginSettingTab {
  plugin: ProximaPlugin;

  constructor(app: App, plugin: ProximaPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'General Configuration' });

    new Setting(containerEl)
      .setName('Projects folder')
      .setDesc('Vault folder where project overview files will be saved.')
      .addText(text => text
        .setPlaceholder('projects')
        .setValue(this.plugin.settings.projectsFolder)
        .onChange(async (value) => {
          this.plugin.settings.projectsFolder = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Tasks folder')
      .setDesc('Vault folder where individual task markdown files will be saved.')
      .addText(text => text
        .setPlaceholder('tasks')
        .setValue(this.plugin.settings.tasksFolder)
        .onChange(async (value) => {
          this.plugin.settings.tasksFolder = value;
          await this.plugin.saveSettings();
        }));

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
