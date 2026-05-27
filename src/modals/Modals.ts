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

export class QuickEditTaskModal extends Modal {
  constructor(
    app: App, 
    public task: TaskData, 
    public onSave: (updates: Partial<TaskData>) => void,
    public onOpenNative: () => void
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
      this.onOpenNative();
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
    desc.value = task.description;

    // Priority
    const pr = contentEl.createEl('div', { cls: 'pos-modal-row', attr: { style: 'margin-top: 10px;' } });
    pr.createEl('label', { text: 'Priority:' });
    const pSel = pr.createEl('select', { cls: 'pos-modal-input', attr: { style: 'width: 150px;' }});
    const priorities = [{label: 'High', val: 1}, {label: 'Medium', val: 2}, {label: 'Low', val: 3}];
    priorities.forEach(p => {
      pSel.createEl('option', { value: String(p.val), text: p.label }).selected = (task.priority === p.val);
    });

    // Tags
    let localTags = [...(task.tags || [])];
    const tr = contentEl.createEl('div', { cls: 'pos-modal-row', attr: { style: 'margin-top: 10px; align-items: flex-start;' } });
    tr.createEl('label', { text: 'Tags:' });
    const tWrap = tr.createEl('div', { cls: 'pos-tag-input-row', attr: { style: 'flex: 1; min-height: 32px;' } });
    
    const renderTags = () => {
      tWrap.empty();
      localTags.forEach(tag => {
        const pill = tWrap.createEl('span', { cls: 'pos-tag-pill', text: tag });
        const xBtn = pill.createEl('span', { cls: 'pos-tag-pill-remove', text: '×', attr: { style: 'margin-left: 4px;' } });
        xBtn.addEventListener('click', () => {
          localTags = localTags.filter(t => t !== tag);
          renderTags();
        });
      });
      const tInp = tWrap.createEl('input', { type: 'text', placeholder: 'Add tag, press Enter', cls: 'pos-tag-input' });
      tInp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault();
          const val = tInp.value.trim().replace(/^,+|,+$/g, '');
          if (val && !localTags.includes(val)) {
            localTags.push(val);
            renderTags();
            // Focus the input again after re-render if it was the user typing
            const newInp = tWrap.querySelector('.pos-tag-input') as HTMLInputElement;
            if (newInp) newInp.focus();
          }
          tInp.value = '';
        }
      });
    };
    renderTags();

    // Buttons
    const br = contentEl.createEl('div', { cls: 'pos-modal-buttons', attr: { style: 'margin-top: 16px;' } });
    br.createEl('button', { text: 'Edit Natively' }).addEventListener('click', () => {
      const file = this.app.vault.getAbstractFileByPath(`tasks/${task.id}.md`);
      if (file instanceof TFile) {
        this.app.workspace.getLeaf().openFile(file);
      }
      this.close();
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
        priority: parseInt(pSel.value, 10) as 1 | 2 | 3,
        tags: localTags
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
