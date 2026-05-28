import { App, Modal, Notice, TFile } from 'obsidian';
import type { TaskData } from '../types';
import type ProximaPlugin from '../main';

export class EditTaskModal extends Modal {
  constructor(app: App, public task: TaskData, public onSave: (updates: Partial<TaskData>) => void) {
    super(app);
  }
  
  onOpen() {
    const { contentEl, task } = this;
    contentEl.empty();
    contentEl.createEl('h3', { text: 'Edit Task' });
    
    const inp = contentEl.createEl('input', {
      type: 'text', placeholder: 'Task name', cls: 'pos-modal-input',
    });
    inp.value = task.name;
    
    const desc = contentEl.createEl('textarea', {
      placeholder: 'Description', cls: 'pos-modal-textarea',
    });
    desc.value = task.description;
    
    // Weight
    const wr = contentEl.createEl('div', { cls: 'pos-modal-row' });
    wr.createEl('label', { text: 'Weight:' });
    const wInp = wr.createEl('input', {
      type: 'number', attr: { min: '1' }, cls: 'pos-modal-number',
    });
    wInp.value = task.weight.toString();
    
    // Fixed duration
    const fr = contentEl.createEl('div', { cls: 'pos-modal-row' });
    const fChk = fr.createEl('input', { type: 'checkbox' });
    fChk.checked = task.isFixedDuration;
    fr.createEl('label', { text: ' Fixed duration (min):' });
    const fInp = fr.createEl('input', {
      type: 'number', attr: { min: '1' }, cls: 'pos-modal-number',
    });
    fInp.value = (task.fixedDuration || 30).toString();
    fInp.disabled = !task.isFixedDuration;
    fChk.addEventListener('change', () => { fInp.disabled = !fChk.checked; });
    
    // Deadline
    const dr = contentEl.createEl('div', { cls: 'pos-modal-row' });
    const dChk = dr.createEl('input', { type: 'checkbox' });
    dChk.checked = !!task.deadline;
    dr.createEl('label', { text: ' Deadline:' });
    const dInp = dr.createEl('input', { type: 'datetime-local', cls: 'pos-modal-datetime' });
    dInp.disabled = !task.deadline;
    if (task.deadline) {
      const dlDate = new Date(task.deadline);
      if (!isNaN(dlDate.getTime())) dInp.value = dlDate.toISOString().slice(0, 16);
    }
    dChk.addEventListener('change', () => { dInp.disabled = !dChk.checked; });
    
    // Buttons
    const br = contentEl.createEl('div', { cls: 'pos-modal-buttons' });
    br.createEl('button', { text: 'Cancel' }).addEventListener('click', () => this.close());
    br.createEl('button', { text: 'Save', cls: 'pos-modal-primary' }).addEventListener('click', () => {
      const name = inp.value.trim();
      if (!name) { new Notice('Task name is required'); return; }
      
      const updates: Partial<TaskData> = {
        name,
        description: desc.value.trim(), // BUG FIX: Included description in updates
        weight: Math.max(1, Number(wInp.value) || 1),
        isFixedDuration: fChk.checked,
        fixedDuration: fChk.checked ? (Number(fInp.value) || 30) : null,
      };
      
      if (dChk.checked && dInp.value) {
        const dlDate = new Date(dInp.value);
        if (!isNaN(dlDate.getTime())) updates.deadline = dlDate.toISOString();
      } else {
        updates.deadline = null;
      }
      
      this.onSave(updates);
      this.close();
    });
  }
  onClose() { this.contentEl.empty(); }
}

export class ConfirmModal extends Modal {
  constructor(app: App, public title: string, public message: string, public onConfirm: () => void) {
    super(app);
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl('h3', { text: this.title });
    contentEl.createEl('p', { text: this.message });
    const br = contentEl.createEl('div', { cls: 'pos-modal-buttons' });
    br.createEl('button', { text: 'Cancel' }).addEventListener('click', () => this.close());
    br.createEl('button', { text: 'Confirm', cls: 'pos-modal-primary pos-del' }).addEventListener('click', () => {
      this.onConfirm();
      this.close();
    });
  }
  onClose() { this.contentEl.empty(); }
}

export class NewProjectModal extends Modal {
  constructor(app: App, public onCreate: (name: string, description: string) => void) {
    super(app);
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl('h3', { text: 'Create New Project' });
    
    const inp = contentEl.createEl('input', {
      type: 'text', placeholder: 'Project name', cls: 'pos-modal-input',
    });
    
    const desc = contentEl.createEl('textarea', {
      placeholder: 'Description (optional)', cls: 'pos-modal-textarea',
    });
    
    const br = contentEl.createEl('div', { cls: 'pos-modal-buttons' });
    br.createEl('button', { text: 'Cancel' }).addEventListener('click', () => this.close());
    br.createEl('button', { text: 'Create', cls: 'pos-modal-primary' }).addEventListener('click', () => {
      const name = inp.value.trim();
      if (!name) { new Notice('Project name is required'); return; }
      this.onCreate(name, desc.value.trim());
      this.close();
    });
  }
  onClose() { this.contentEl.empty(); }
}

export class NewTaskModal extends Modal {
  constructor(app: App, public onCreate: (name: string) => void) {
    super(app);
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl('h3', { text: 'Create New Task' });
    
    const inp = contentEl.createEl('input', {
      type: 'text', placeholder: 'Task name', cls: 'pos-modal-input',
    });
    
    const br = contentEl.createEl('div', { cls: 'pos-modal-buttons' });
    br.createEl('button', { text: 'Cancel' }).addEventListener('click', () => this.close());
    br.createEl('button', { text: 'Create', cls: 'pos-modal-primary' }).addEventListener('click', () => {
      const name = inp.value.trim();
      if (!name) { new Notice('Task name is required'); return; }
      this.onCreate(name);
      this.close();
    });
  }
  onClose() { this.contentEl.empty(); }
}

export class QuickEditTaskModal extends Modal {
  constructor(
    app: App, 
    public plugin: ProximaPlugin,
    public task: TaskData, 
    public onSave: (updates: Partial<TaskData>) => void
  ) {
    super(app);
  }

  onOpen() {
    const { contentEl, task } = this;
    contentEl.empty();
    
    // Header
    const hdr = contentEl.createEl('div', { cls: 'pos-modal-row', attr: { style: 'justify-content: space-between; margin-bottom: 16px;' }});
    hdr.createEl('h3', { text: 'Edit Task', attr: { style: 'margin: 0;' }});
    const nativeBtn = hdr.createEl('button', { text: '📄 Open Native Note', cls: 'pos-modal-primary' });
    nativeBtn.addEventListener('click', () => {
      this.close();
      const file = this.app.vault.getAbstractFileByPath(`tasks/${task.id}.md`);
      if (file instanceof TFile) {
        this.app.workspace.getLeaf('tab').openFile(file);
      }
    });

    const inp = contentEl.createEl('input', {
      type: 'text', placeholder: 'Task name', cls: 'pos-modal-input',
    });
    inp.value = task.name;
    
    // Status
    const sr = contentEl.createEl('div', { cls: 'pos-modal-row' });
    sr.createEl('label', { text: 'Status:' });
    const sSel = sr.createEl('select', { cls: 'pos-modal-input', attr: { style: 'width: 150px;' }});
    ['planned', 'backlog', 'running', 'review'].forEach(st => {
      sSel.createEl('option', { value: st, text: st }).selected = (task.status === st);
    });

    // Start Date
    const sdr = contentEl.createEl('div', { cls: 'pos-modal-row' });
    const sdChk = sdr.createEl('input', { type: 'checkbox' });
    sdChk.checked = !!task.startDate;
    sdr.createEl('label', { text: ' Start Date:' });
    const sdInp = sdr.createEl('input', { type: 'datetime-local', cls: 'pos-modal-datetime' });
    sdInp.disabled = !task.startDate;
    if (task.startDate) {
      const sdDate = new Date(task.startDate);
      if (!isNaN(sdDate.getTime())) sdInp.value = sdDate.toISOString().slice(0, 16);
    }
    sdChk.addEventListener('change', () => { sdInp.disabled = !sdChk.checked; });

    // Deadline
    const dr = contentEl.createEl('div', { cls: 'pos-modal-row' });
    const dChk = dr.createEl('input', { type: 'checkbox' });
    dChk.checked = !!task.deadline;
    dr.createEl('label', { text: ' Deadline:' });
    const dInp = dr.createEl('input', { type: 'datetime-local', cls: 'pos-modal-datetime' });
    dInp.disabled = !task.deadline;
    if (task.deadline) {
      const dlDate = new Date(task.deadline);
      if (!isNaN(dlDate.getTime())) dInp.value = dlDate.toISOString().slice(0, 16);
    }
    dChk.addEventListener('change', () => { dInp.disabled = !dChk.checked; });
    
    // Description
    const desc = contentEl.createEl('textarea', {
      placeholder: 'Description', cls: 'pos-modal-textarea',
      attr: { style: 'margin-top: 10px; min-height: 80px;' }
    });
    desc.value = task.description || '';

    // Dynamic Properties
    const customPropValues: Record<string, any> = {};
    const activeSchema = (task.project && this.plugin.settings.projectSchemas) ? (this.plugin.settings.projectSchemas[task.project] || []) : [];
    if (activeSchema.length > 0) {
      activeSchema.forEach(schema => {
        const row = contentEl.createEl('div', { cls: 'pos-modal-row', attr: { style: 'margin-top: 10px;' } });
        row.createEl('label', { text: schema.name + ':' });

        let initialValue = task.properties ? task.properties[schema.id] : undefined;

        if (schema.type === 'text') {
          const inp = row.createEl('input', { type: 'text', cls: 'pos-modal-input' });
          inp.value = initialValue || '';
          inp.addEventListener('input', () => customPropValues[schema.id] = inp.value);
          customPropValues[schema.id] = initialValue || '';
        } else if (schema.type === 'number') {
          const inp = row.createEl('input', { type: 'number', cls: 'pos-modal-input' });
          inp.value = initialValue !== undefined ? initialValue : '';
          inp.addEventListener('input', () => customPropValues[schema.id] = parseFloat(inp.value));
          customPropValues[schema.id] = initialValue !== undefined ? initialValue : null;
        } else if (schema.type === 'select') {
          const sel = row.createEl('select', { cls: 'pos-modal-input' });
          sel.createEl('option', { value: '', text: '-- None --' });
          if (schema.options) {
            schema.options.forEach(opt => {
              sel.createEl('option', { value: opt.id, text: opt.name }).selected = (initialValue === opt.id);
            });
          }
          sel.addEventListener('change', () => customPropValues[schema.id] = sel.value);
          customPropValues[schema.id] = initialValue || '';
        } else if (schema.type === 'checkbox') {
          const chk = row.createEl('input', { type: 'checkbox' });
          chk.checked = !!initialValue;
          chk.addEventListener('change', () => customPropValues[schema.id] = chk.checked);
          customPropValues[schema.id] = !!initialValue;
        } else if (schema.type === 'date') {
          const dinp = row.createEl('input', { type: 'datetime-local', cls: 'pos-modal-datetime' });
          if (initialValue) {
            const dt = new Date(initialValue);
            if (!isNaN(dt.getTime())) dinp.value = dt.toISOString().slice(0, 16);
          }
          dinp.addEventListener('change', () => {
            const dt = new Date(dinp.value);
            customPropValues[schema.id] = !isNaN(dt.getTime()) ? dt.toISOString() : null;
          });
          customPropValues[schema.id] = initialValue || null;
        } else if (schema.type === 'multi-select') {
          let localVals: string[] = Array.isArray(initialValue) ? [...initialValue] : [];
          customPropValues[schema.id] = localVals;
          
          row.style.alignItems = 'flex-start';
          const tWrap = row.createEl('div', { cls: 'pos-tag-input-row', attr: { style: 'flex: 1; min-height: 32px;' } });
          
          const renderMulti = () => {
            tWrap.empty();
            localVals.forEach(val => {
              const optName = schema.options?.find(o => o.id === val)?.name || val;
              const pill = tWrap.createEl('span', { cls: 'pos-tag-pill', text: optName });
              const xBtn = pill.createEl('span', { cls: 'pos-tag-pill-remove', text: 'x', attr: { style: 'margin-left: 4px;' } });
              xBtn.addEventListener('click', () => {
                localVals = localVals.filter(t => t !== val);
                customPropValues[schema.id] = localVals;
                renderMulti();
              });
            });
            const sel = tWrap.createEl('select', { cls: 'pos-modal-input', attr: { style: 'margin-top: 4px;' }});
            sel.createEl('option', { value: '', text: 'Add...' });
            if (schema.options) {
              schema.options.filter(o => !localVals.includes(o.id)).forEach(o => {
                sel.createEl('option', { value: o.id, text: o.name });
              });
            }
            sel.addEventListener('change', () => {
              if (sel.value && !localVals.includes(sel.value)) {
                localVals.push(sel.value);
                customPropValues[schema.id] = localVals;
                renderMulti();
              }
            });
          };
          renderMulti();
        } else if (schema.type === 'relation') {
            let localVals: string[] = Array.isArray(initialValue) ? [...initialValue] : (initialValue ? [initialValue] : []);
            customPropValues[schema.id] = localVals;
            
            row.style.alignItems = 'flex-start';
            const tWrap = row.createEl('div', { cls: 'pos-tag-input-row', attr: { style: 'flex: 1; min-height: 32px;' } });
            
            const renderRelation = () => {
              tWrap.empty();
              localVals.forEach(val => {
                const pill = tWrap.createEl('span', { cls: 'pos-tag-pill', text: String(val).replace(/\[\[|\]\]/g, '') });
                const xBtn = pill.createEl('span', { cls: 'pos-tag-pill-remove', text: 'x', attr: { style: 'margin-left: 4px;' } });
                xBtn.addEventListener('click', () => {
                  localVals = localVals.filter(t => t !== val);
                  customPropValues[schema.id] = localVals;
                  renderRelation();
                });
              });
              const sel = tWrap.createEl('select', { cls: 'pos-modal-input', attr: { style: 'margin-top: 4px;' }});
              sel.createEl('option', { value: '', text: 'Add link...' });
              if (schema.targetFolder) {
                const files = this.app.vault.getMarkdownFiles().filter(f => f.path.startsWith(schema.targetFolder!));
                files.forEach(f => {
                  const link = `[[${f.basename}]]`;
                  if (!localVals.includes(link)) {
                    sel.createEl('option', { value: link, text: f.basename });
                  }
                });
              }
              sel.addEventListener('change', () => {
                if (sel.value && !localVals.includes(sel.value)) {
                  localVals.push(sel.value);
                  customPropValues[schema.id] = localVals;
                  renderRelation();
                }
              });
            };
            renderRelation();
          } else if (schema.type === 'formula' || schema.type === 'rollup') {
            const div = row.createEl('div', { cls: 'pos-modal-input', attr: { style: 'background: transparent; border: none; padding-left: 0;' } });
            div.setText(String(initialValue !== undefined && initialValue !== null ? initialValue : '—'));
            customPropValues[schema.id] = initialValue;
          }
      });
    }

    // Buttons
    const br = contentEl.createEl('div', { cls: 'pos-modal-buttons', attr: { style: 'margin-top: 16px;' } });
    br.createEl('button', { text: 'Edit Natively' }).addEventListener('click', () => {
      this.close();
      const file = this.app.vault.getAbstractFileByPath(`tasks/${task.id}.md`);
      if (file instanceof TFile) {
        this.app.workspace.getLeaf('tab').openFile(file);
      }
    });
    br.createEl('button', { text: 'Cancel' }).addEventListener('click', () => this.close());
    br.createEl('button', { text: 'Save', cls: 'pos-modal-primary' }).addEventListener('click', () => {
      const name = inp.value.trim();
      if (!name) { new Notice('Task name is required'); return; }
      
      const updates: Partial<TaskData> = {
        name,
        description: desc.value.trim(),
        status: sSel.value as any,
        isCompleted: sSel.value === 'review',
        properties: customPropValues
      };
      
      if (sdChk.checked && sdInp.value) {
        const sdDate = new Date(sdInp.value);
        if (!isNaN(sdDate.getTime())) updates.startDate = sdDate.toISOString();
      } else {
        updates.startDate = null;
      }

      if (dChk.checked && dInp.value) {
        const dlDate = new Date(dInp.value);
        if (!isNaN(dlDate.getTime())) updates.deadline = dlDate.toISOString();
      } else {
        updates.deadline = null;
      }
      
      this.onSave(updates);
      this.close();
    });
  }

  onClose() { this.contentEl.empty(); }
}


import { DropdownComponent, ButtonComponent, TextComponent } from 'obsidian';
export class ProjectSchemaModal extends Modal {
  projectId: string;
  plugin: any;

  constructor(app: App, plugin: any, projectId: string, public onCloseCallback?: () => void) {
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
      try {
      schemaContainer.empty();
      const schemaList = this.plugin.settings.projectSchemas[this.projectId] || [];
      const visibleList = this.plugin.settings.projectVisibleProps[this.projectId] || [];

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
            prop.id = val.toLowerCase().replace(/\s+/g, '-');
            
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
      } catch (err) {
        console.error("Proxima schema render error:", err);
        schemaContainer.createEl('div', { text: "Error rendering schema: " + err.message, cls: 'pos-error-text' });
      }
    };
    renderSchema();
  }
}
