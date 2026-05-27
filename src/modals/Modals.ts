import { App, Modal, Notice } from 'obsidian';
import type { TaskData } from '../types';

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
