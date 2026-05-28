import { App, PluginSettingTab, Setting, TextComponent, DropdownComponent, ButtonComponent } from 'obsidian';
import type ProximaPlugin from './main';
import type { PropertySchema, PropertyType, SelectOption, ColorRule } from './types';

export interface ProximaSettings {
  nearDeadlineDays: number;
  urgentDeadlineDays: number;
  projectsFolder: string;
  tasksFolder: string;
  statuses: SelectOption[];
  colorRules: ColorRule[];
  taskSchema: PropertySchema[];
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

    const statusHeader = containerEl.createEl('h3', { text: 'Kanban Statuses' });
    const statusDesc = containerEl.createEl('p', { text: 'Define the default statuses (columns) for your tasks.' });
    statusDesc.style.color = 'var(--text-muted)';
    statusDesc.style.fontSize = '0.9em';

    const statusesContainer = containerEl.createDiv('pos-statuses-container');
    statusesContainer.style.display = 'flex';
    statusesContainer.style.flexDirection = 'column';
    statusesContainer.style.gap = '10px';
    
    const renderStatuses = () => {
      statusesContainer.empty();
      if (!this.plugin.settings.statuses) this.plugin.settings.statuses = [];
      this.plugin.settings.statuses.forEach((status, idx) => {
        const row = statusesContainer.createDiv('pos-schema-opt-row');
        row.style.display = 'flex';
        row.style.gap = '5px';
        row.style.marginBottom = '5px';
        
        new TextComponent(row)
          .setValue(status.name)
          .setPlaceholder('Status Name')
          .onChange(async (val) => {
            status.name = val;
            status.id = val.toLowerCase().replace(/\s+/g, '-');
            await this.plugin.saveSettings();
          });
          
        const colorInp = row.createEl('input', { type: 'color' });
        colorInp.value = status.color || '#cccccc';
        colorInp.addEventListener('change', async (e: any) => {
          status.color = e.target.value;
          await this.plugin.saveSettings();
        });
        
        new ButtonComponent(row)
          .setIcon('trash')
          .onClick(async () => {
            this.plugin.settings.statuses.splice(idx, 1);
            await this.plugin.saveSettings();
            renderStatuses();
          });
      });
      new ButtonComponent(statusesContainer)
        .setButtonText('+ Add Status')
        .onClick(async () => {
          this.plugin.settings.statuses.push({ id: 'new-status', name: 'New Status', color: '#cccccc' });
          await this.plugin.saveSettings();
          renderStatuses();
        });
    };
    renderStatuses();

    containerEl.createEl('h3', { text: 'Database Properties' });
    const schemaDesc = containerEl.createEl('p', { text: 'Define the dynamic properties for your tasks. These determine the fields available in the edit modal and the frontmatter saved to markdown.' });
    schemaDesc.style.color = 'var(--text-muted)';
    schemaDesc.style.fontSize = '0.9em';

    const schemaContainer = containerEl.createDiv('pos-schema-container');
    schemaContainer.style.display = 'flex';
    schemaContainer.style.flexDirection = 'column';
    schemaContainer.style.gap = '10px';
    schemaContainer.style.marginTop = '10px';

    const renderSchema = () => {
      schemaContainer.empty();
      this.plugin.settings.taskSchema.forEach((prop, index) => {
        const propDiv = schemaContainer.createDiv('pos-schema-prop');
        propDiv.style.border = '1px solid var(--background-modifier-border)';
        propDiv.style.padding = '10px';
        propDiv.style.borderRadius = '5px';
        propDiv.style.display = 'flex';
        propDiv.style.gap = '10px';
        propDiv.style.alignItems = 'center';

        const nameInput = new TextComponent(propDiv)
          .setValue(prop.name)
          .setPlaceholder('Property Name')
          .onChange(async (val) => {
            prop.name = val;
            prop.id = val.toLowerCase().replace(/\s+/g, '-');
            await this.plugin.saveSettings();
          });
        nameInput.inputEl.style.flex = '1';

        const typeDropdown = new DropdownComponent(propDiv)
          .addOption('text', 'Text')
          .addOption('number', 'Number')
          .addOption('select', 'Select')
          .addOption('multi-select', 'Multi-Select')
          .addOption('date', 'Date')
          .addOption('checkbox', 'Checkbox')
          .addOption('relation', 'Relation')
          .addOption('rollup', 'Rollup')
          .addOption('formula', 'Formula')
          .setValue(prop.type)
          .onChange(async (val: string) => {
            prop.type = val as PropertyType;
            if ((val === 'select' || val === 'multi-select') && !prop.options) {
              prop.options = [];
            }
            if (val === 'relation') prop.targetFolder = '';
            if (val === 'rollup') {
              prop.relationProperty = '';
              prop.targetProperty = '';
              prop.aggregation = 'sum';
            }
            if (val === 'formula') prop.expression = '';
            await this.plugin.saveSettings();
            renderSchema(); // Re-render to show new config inputs
          });

        new ButtonComponent(propDiv)
          .setIcon('trash')
          .setWarning()
          .onClick(async () => {
            this.plugin.settings.taskSchema.splice(index, 1);
            await this.plugin.saveSettings();
            renderSchema();
          });

        if (prop.type === 'select' || prop.type === 'multi-select') {
          const optsDiv = schemaContainer.createDiv('pos-schema-options');
          optsDiv.style.marginLeft = '20px';
          optsDiv.style.padding = '10px';
          optsDiv.style.borderLeft = '2px solid var(--background-modifier-border)';
          optsDiv.style.marginBottom = '10px';
          
          if (!prop.options) prop.options = [];
          
          prop.options.forEach((opt, optIdx) => {
            const optRow = optsDiv.createDiv('pos-schema-opt-row');
            optRow.style.display = 'flex';
            optRow.style.gap = '5px';
            optRow.style.marginBottom = '5px';
            
            new TextComponent(optRow)
              .setValue(opt.name)
              .setPlaceholder('Option Name')
              .onChange(async (val) => {
                opt.name = val;
                opt.id = val.toLowerCase().replace(/\s+/g, '-');
                await this.plugin.saveSettings();
              });
              
            const colorInp = optRow.createEl('input', { type: 'color' });
            colorInp.value = opt.color || '#cccccc';
            colorInp.addEventListener('change', async (e: any) => {
              opt.color = e.target.value;
              await this.plugin.saveSettings();
            });
            
            new ButtonComponent(optRow)
              .setIcon('trash')
              .onClick(async () => {
                prop.options!.splice(optIdx, 1);
                await this.plugin.saveSettings();
                renderSchema();
              });
          });
          
          new ButtonComponent(optsDiv)
            .setButtonText('+ Add Option')
            .onClick(async () => {
              prop.options!.push({ id: 'new', name: 'New Option', color: '#cccccc' });
              await this.plugin.saveSettings();
              renderSchema();
            });
        }
        
        if (prop.type === 'relation') {
          const configDiv = schemaContainer.createDiv('pos-schema-options');
          configDiv.style.marginLeft = '20px';
          configDiv.style.padding = '10px';
          configDiv.style.borderLeft = '2px solid var(--background-modifier-border)';
          
          configDiv.createEl('span', { text: 'Target Folder: ', cls: 'pos-text-muted' });
          new TextComponent(configDiv)
            .setValue(prop.targetFolder || '')
            .setPlaceholder('e.g. databases/clients')
            .onChange(async (val) => {
              prop.targetFolder = val;
              await this.plugin.saveSettings();
            });
        }
        
        if (prop.type === 'rollup') {
          const configDiv = schemaContainer.createDiv('pos-schema-options');
          configDiv.style.marginLeft = '20px';
          configDiv.style.padding = '10px';
          configDiv.style.borderLeft = '2px solid var(--background-modifier-border)';
          configDiv.style.display = 'flex';
          configDiv.style.gap = '10px';
          
          new TextComponent(configDiv).setValue(prop.relationProperty || '').setPlaceholder('Relation Property').onChange(async (val) => { prop.relationProperty = val; await this.plugin.saveSettings(); });
          new TextComponent(configDiv).setValue(prop.targetProperty || '').setPlaceholder('Target Property').onChange(async (val) => { prop.targetProperty = val; await this.plugin.saveSettings(); });
          new DropdownComponent(configDiv)
            .addOption('sum', 'Sum')
            .addOption('average', 'Average')
            .addOption('count', 'Count')
            .addOption('unique', 'Unique Values')
            .addOption('min', 'Min')
            .addOption('max', 'Max')
            .setValue(prop.aggregation || 'sum')
            .onChange(async (val: any) => { prop.aggregation = val; await this.plugin.saveSettings(); });
        }
        
        if (prop.type === 'formula') {
          const configDiv = schemaContainer.createDiv('pos-schema-options');
          configDiv.style.marginLeft = '20px';
          configDiv.style.padding = '10px';
          configDiv.style.borderLeft = '2px solid var(--background-modifier-border)';
          
          configDiv.createEl('span', { text: 'Expression: ', cls: 'pos-text-muted' });
          const exprInput = new TextComponent(configDiv)
            .setValue(prop.expression || '')
            .setPlaceholder("e.g. prop('Cost') * 1.2")
            .onChange(async (val) => {
              prop.expression = val;
              await this.plugin.saveSettings();
            });
          exprInput.inputEl.style.width = '300px';
        }
      });

      new ButtonComponent(schemaContainer)
        .setButtonText('+ Add Property')
        .onClick(async () => {
          this.plugin.settings.taskSchema.push({
            id: 'new-property',
            name: 'New Property',
            type: 'text'
          });
          await this.plugin.saveSettings();
          renderSchema();
        });
    };

    renderSchema();
  }
}
