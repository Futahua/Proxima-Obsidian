const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/modals/Modals.ts';
let content = fs.readFileSync(file, 'utf8');

const modalCode = `
import { DropdownComponent } from 'obsidian';
export class ProjectSchemaModal extends Modal {
  projectId: string;
  plugin: any;

  constructor(app: App, plugin: any, projectId: string) {
    super(app);
    this.plugin = plugin;
    this.projectId = projectId;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    
    // Ensure data structures exist
    if (!this.plugin.settings.projectSchemas) this.plugin.settings.projectSchemas = {};
    if (!this.plugin.settings.projectVisibleProps) this.plugin.settings.projectVisibleProps = {};
    if (!this.plugin.settings.projectSchemas[this.projectId]) this.plugin.settings.projectSchemas[this.projectId] = [];
    if (!this.plugin.settings.projectVisibleProps[this.projectId]) this.plugin.settings.projectVisibleProps[this.projectId] = [];

    contentEl.createEl('h2', { text: 'Project Properties' });
    contentEl.createEl('p', { text: 'Define the properties exclusively for this project.', cls: 'pos-modal-desc' });

    const schemaContainer = contentEl.createDiv('pos-schema-container');
    schemaContainer.style.display = 'flex';
    schemaContainer.style.flexDirection = 'column';
    schemaContainer.style.gap = '10px';
    schemaContainer.style.marginTop = '10px';
    schemaContainer.style.maxHeight = '400px';
    schemaContainer.style.overflowY = 'auto';
    schemaContainer.style.paddingRight = '10px';

    const renderSchema = () => {
      schemaContainer.empty();
      const schemaList = this.plugin.settings.projectSchemas[this.projectId];
      const visibleList = this.plugin.settings.projectVisibleProps[this.projectId];

      schemaList.forEach((prop: any, index: number) => {
        const propDiv = schemaContainer.createDiv('pos-schema-prop');
        propDiv.style.border = '1px solid var(--background-modifier-border)';
        propDiv.style.padding = '10px';
        propDiv.style.borderRadius = '5px';
        propDiv.style.display = 'flex';
        propDiv.style.flexDirection = 'column';
        propDiv.style.gap = '10px';

        const row1 = propDiv.createDiv();
        row1.style.display = 'flex';
        row1.style.gap = '10px';
        row1.style.alignItems = 'center';

        const visBtn = new ButtonComponent(row1)
          .setIcon(visibleList.includes(prop.id) ? 'eye' : 'eye-off')
          .setTooltip('Toggle Visibility')
          .onClick(async () => {
            if (visibleList.includes(prop.id)) {
              this.plugin.settings.projectVisibleProps[this.projectId] = visibleList.filter((id: string) => id !== prop.id);
            } else {
              this.plugin.settings.projectVisibleProps[this.projectId].push(prop.id);
            }
            await this.plugin.saveSettings();
            renderSchema();
          });

        const nameInput = new TextComponent(row1)
          .setValue(prop.name)
          .setPlaceholder('Property Name')
          .onChange(async (val) => {
            prop.name = val;
            const oldId = prop.id;
            prop.id = val.toLowerCase().replace(/\\s+/g, '-');
            
            // Update visibility list ID if changed
            if (oldId !== prop.id) {
               const vIdx = visibleList.indexOf(oldId);
               if (vIdx > -1) visibleList[vIdx] = prop.id;
            }
            await this.plugin.saveSettings();
          });
        nameInput.inputEl.style.flex = '1';

        const typeDropdown = new DropdownComponent(row1)
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
            prop.type = val as any;
            if ((val === 'select' || val === 'multi-select') && !prop.options) prop.options = [];
            if (val === 'relation') prop.targetFolder = '';
            if (val === 'rollup') {
              prop.relationProperty = '';
              prop.targetProperty = '';
              prop.aggregation = 'sum';
            }
            if (val === 'formula') prop.expression = '';
            await this.plugin.saveSettings();
            renderSchema();
          });

        new ButtonComponent(row1)
          .setIcon('trash')
          .setWarning()
          .onClick(async () => {
            schemaList.splice(index, 1);
            this.plugin.settings.projectVisibleProps[this.projectId] = visibleList.filter((id: string) => id !== prop.id);
            await this.plugin.saveSettings();
            renderSchema();
          });

        // Sub-options
        if (prop.type === 'select' || prop.type === 'multi-select') {
          const optsDiv = propDiv.createDiv('pos-schema-options');
          optsDiv.style.marginLeft = '30px';
          if (!prop.options) prop.options = [];
          prop.options.forEach((opt: any, optIdx: number) => {
            const optRow = optsDiv.createDiv();
            optRow.style.display = 'flex';
            optRow.style.gap = '5px';
            optRow.style.marginBottom = '5px';
            
            new TextComponent(optRow)
              .setValue(opt.name)
              .setPlaceholder('Option Name')
              .onChange(async (val) => {
                opt.name = val;
                opt.id = val.toLowerCase().replace(/\\s+/g, '-');
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
                prop.options.splice(optIdx, 1);
                await this.plugin.saveSettings();
                renderSchema();
              });
          });
          new ButtonComponent(optsDiv)
            .setButtonText('+ Option')
            .onClick(async () => {
              prop.options.push({ id: 'new', name: 'New Option', color: '#cccccc' });
              await this.plugin.saveSettings();
              renderSchema();
            });
        }

        if (prop.type === 'rollup') {
           const rDiv = propDiv.createDiv();
           rDiv.style.marginLeft = '30px';
           rDiv.style.display = 'flex';
           rDiv.style.gap = '5px';
           new TextComponent(rDiv).setPlaceholder('Relation Property').setValue(prop.relationProperty || '').onChange(async (v) => { prop.relationProperty = v; await this.plugin.saveSettings(); });
           new TextComponent(rDiv).setPlaceholder('Target Property').setValue(prop.targetProperty || '').onChange(async (v) => { prop.targetProperty = v; await this.plugin.saveSettings(); });
           new DropdownComponent(rDiv)
              .addOption('sum', 'Sum')
              .addOption('average', 'Average')
              .addOption('count', 'Count')
              .addOption('unique', 'Unique')
              .addOption('min', 'Min')
              .addOption('max', 'Max')
              .setValue(prop.aggregation || 'sum')
              .onChange(async (v: any) => { prop.aggregation = v; await this.plugin.saveSettings(); });
        }

        if (prop.type === 'formula') {
           const fDiv = propDiv.createDiv();
           fDiv.style.marginLeft = '30px';
           const expInput = new TextComponent(fDiv).setPlaceholder('Formula Expression').setValue(prop.expression || '').onChange(async (v) => { prop.expression = v; await this.plugin.saveSettings(); });
           expInput.inputEl.style.width = '100%';
        }
      });

      const btnRow = schemaContainer.createDiv();
      btnRow.style.marginTop = '10px';
      new ButtonComponent(btnRow)
        .setButtonText('+ Add Property')
        .setCta()
        .onClick(async () => {
          const newId = 'prop-' + Date.now();
          schemaList.push({
            id: newId,
            name: 'New Property',
            type: 'text'
          });
          this.plugin.settings.projectVisibleProps[this.projectId].push(newId);
          await this.plugin.saveSettings();
          renderSchema();
        });
    };
    renderSchema();
  }
}
`;

// Inject into Modals.ts
// I'll append it to the end of the file
content += '\n' + modalCode;

fs.writeFileSync(file, content);
console.log('Added ProjectSchemaModal to Modals.ts');
