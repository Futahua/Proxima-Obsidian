// ═══════════════════════════════════════════════════════════════════
// PROJECT OS — Obsidian Plugin v1.0.0
// Mini project management dashboard: Aging · Elastic · Deadlines
// ═══════════════════════════════════════════════════════════════════

const { Plugin, ItemView, TFile, Modal, Notice } = require('obsidian');

const VIEW_TYPE = 'project-os-view';
const PROJECTS_FOLDER = 'projects';
const TASKS_FOLDER = 'tasks';

// ═══════════════════════════════════════════════════════════════════
// SECTION 1 — Pure Utility Functions (kept from Elastic Scheduler)
// ═══════════════════════════════════════════════════════════════════

/** Parse YAML frontmatter from markdown content into a plain object. */
function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const data = {};
  m[1].split('\n').forEach(line => {
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (val === 'true' || val === 'false') val = val === 'true';
    else if (val === 'null' || val === 'undefined') val = null;
    else if (!isNaN(val) && val !== '') val = Number(val);
    data[key] = val;
  });
  return data;
}

/** Serialize a plain object into YAML frontmatter string. */
function serializeFrontmatter(fields) {
  let s = '---\n';
  for (const [k, v] of Object.entries(fields))
    if (v !== undefined && v !== null) s += `${k}: ${v}\n`;
  s += '---\n';
  return s;
}

/**
 * Core scheduling algorithm — computes duration for each running task
 * based on weight and fixed duration, given a start time and deadline.
 * Preserved exactly from the original Elastic Scheduler.
 */
function calculateLiquidTimeline(tasks, startTime, deadline) {
  const totalMin = (deadline - startTime) / 60000;
  if (totalMin <= 0) return [];
  let remaining = totalMin;
  const durMap = new Map();
  for (const t of tasks) {
    if (t.isFixedDuration && t.fixedDuration > 0) {
      durMap.set(t.id, t.fixedDuration);
      remaining -= t.fixedDuration;
    }
  }
  const elastic = tasks.filter(t => !(t.isFixedDuration && t.fixedDuration > 0));
  if (elastic.length && remaining > 0) {
    const tw = elastic.reduce((s, t) => s + t.weight, 0) || 1;
    for (const t of elastic) {
      let d = (t.weight / tw) * remaining;
      if (t.maxDuration && d > t.maxDuration) d = t.maxDuration;
      durMap.set(t.id, d);
    }
  }
  let cur = startTime.getTime();
  const tl = [];
  for (const t of tasks) {
    const dur = durMap.get(t.id) || 0;
    const end = new Date(cur + dur * 60000);
    tl.push({
      id: t.id,
      startTime: new Date(cur).toISOString(),
      endTime: end.toISOString(),
      calculatedDuration: dur,
    });
    cur = end.getTime();
  }
  return tl;
}

/** Human-readable age string: "just now", "5m ago", "3d ago", etc. */
function formatAge(createdAtIso) {
  const diff = Date.now() - new Date(createdAtIso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

/** Countdown string with overdue handling: "2d 3h 15m 42s" or "overdue by ...". */
function formatCountdown(diffMs) {
  const isPast = diffMs < 0;
  const abs = Math.abs(diffMs);
  const totalSecs = Math.floor(abs / 1000);
  const days = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  let str = '';
  if (days > 0) str += `${days}d `;
  if (hours > 0) str += `${hours}h `;
  str += `${mins}m ${secs}s`;
  return isPast ? `overdue by ${str}` : str;
}

/** HSL background color based on remaining time until deadline. */
function deadlineHue(remainingMs) {
  if (remainingMs < 0) return 'hsl(300, 60%, 85%)';   // purple — overdue
  const days = remainingMs / 86400000;
  if (days > 30) return 'hsl(210, 60%, 85%)';          // blue
  if (days >= 7) return 'hsl(180, 60%, 85%)';           // cyan/green
  if (days >= 3) return 'hsl(60, 70%, 85%)';            // yellow
  if (days >= 1) return 'hsl(30, 90%, 80%)';            // orange
  return 'hsl(0, 90%, 80%)';                            // red (<1 day)
}

function fmtDate(iso) {
  return iso ? new Date(iso).toISOString().slice(0, 10) : '';
}
function fmtTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
function fmtDur(m) {
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 2 — Data Managers (replace old TaskManager)
// ═══════════════════════════════════════════════════════════════════

/** Manages project files in the projects/ folder. */
class ProjectManager {
  constructor(app) {
    this.app = app;
    this.folder = PROJECTS_FOLDER;
  }

  async ensureFolder() {
    if (!this.app.vault.getAbstractFileByPath(this.folder))
      await this.app.vault.createFolder(this.folder);
  }

  async loadProjects(includeArchived = false) {
    await this.ensureFolder();
    const files = this.app.vault.getMarkdownFiles()
      .filter(f => f.path.startsWith(this.folder + '/'));
    const projects = [];
    for (const f of files) {
      const c = await this.app.vault.read(f);
      const fm = parseFrontmatter(c);
      if (fm.type !== 'project') continue;
      if (!includeArchived && fm.status === 'archived') continue;
      projects.push({
        id: f.basename,
        name: fm.name || f.basename,
        description: fm.description || '',
        createdAt: fm.createdAt || new Date().toISOString(),
        status: fm.status || 'active',
      });
    }
    projects.sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    return projects;
  }

  async createProject(data) {
    await this.ensureFolder();
    const id = `proj-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
    const fm = {
      type: 'project',
      name: data.name,
      description: data.description || '',
      createdAt: new Date().toISOString(),
      status: 'active',
    };
    await this.app.vault.create(
      `${this.folder}/${id}.md`,
      serializeFrontmatter(fm) + '\n'
    );
    return id;
  }

  async updateProject(id, updates) {
    const file = this.app.vault.getAbstractFileByPath(`${this.folder}/${id}.md`);
    if (!(file instanceof TFile)) return;
    const c = await this.app.vault.read(file);
    const fm = parseFrontmatter(c);
    const body = c.replace(/^---\r?\n[\s\S]*?\r?\n---/, '').trim();
    Object.assign(fm, updates);
    for (const k in fm) if (fm[k] === undefined) delete fm[k];
    await this.app.vault.modify(file, serializeFrontmatter(fm) + '\n' + body);
  }

  async archiveProject(id) {
    await this.updateProject(id, { status: 'archived' });
  }

  async deleteProject(id) {
    const file = this.app.vault.getAbstractFileByPath(`${this.folder}/${id}.md`);
    if (file instanceof TFile) await this.app.vault.delete(file);
  }
}

/** Manages task files in the tasks/ folder. */
class TaskDataManager {
  constructor(app) {
    this.app = app;
    this.folder = TASKS_FOLDER;
  }

  async ensureFolder() {
    if (!this.app.vault.getAbstractFileByPath(this.folder))
      await this.app.vault.createFolder(this.folder);
  }

  /** Load every task file into an array of task objects, sorted by orderIndex. */
  async loadAllTasks() {
    await this.ensureFolder();
    const files = this.app.vault.getMarkdownFiles()
      .filter(f => f.path.startsWith(this.folder + '/'));
    const tasks = [];
    for (const f of files) {
      const c = await this.app.vault.read(f);
      const fm = parseFrontmatter(c);
      const body = c.replace(/^---\r?\n[\s\S]*?\r?\n---/, '').trim();
      let deadline = null;
      if (fm.deadline) {
        const d = new Date(fm.deadline);
        if (!isNaN(d.getTime())) deadline = d.toISOString();
      }
      tasks.push({
        id: f.basename,
        name: fm.name || f.basename,
        description: body || '',
        project: fm.project || null,
        status: fm.status || 'backlog',
        weight: fm.weight || 1,
        orderIndex: fm.orderIndex || 0,
        isFixedDuration: fm.isFixedDuration || false,
        fixedDuration: fm.fixedDuration || null,
        maxDuration: fm.maxDuration || null,
        isCompleted: fm.isCompleted || false,
        createdAt: fm.createdAt || new Date().toISOString(),
        deadline: deadline,
      });
    }
    tasks.sort((a, b) => a.orderIndex - b.orderIndex);
    return tasks;
  }

  /** Load tasks belonging to a specific project (null = uncategorized). */
  async loadTasksForProject(projectId) {
    const all = await this.loadAllTasks();
    if (projectId) return all.filter(t => t.project === projectId);
    return all.filter(t => !t.project);
  }

  async createTask(data) {
    await this.ensureFolder();
    const id = `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const fm = {
      name: data.name,
      project: data.project || null,
      status: 'backlog',
      weight: data.weight || 1,
      orderIndex: 0,
      isFixedDuration: data.isFixedDuration || false,
      fixedDuration: data.isFixedDuration ? data.fixedDuration : null,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    if (data.deadline) fm.deadline = data.deadline;
    const c = serializeFrontmatter(fm) + '\n' + (data.description || '');
    await this.app.vault.create(`${this.folder}/${id}.md`, c);
    return id;
  }

  async updateTask(id, updates) {
    const file = this.app.vault.getAbstractFileByPath(`${this.folder}/${id}.md`);
    if (!(file instanceof TFile)) return;
    const c = await this.app.vault.read(file);
    const fm = parseFrontmatter(c);
    const body = c.replace(/^---\r?\n[\s\S]*?\r?\n---/, '').trim();
    Object.assign(fm, updates);
    for (const k in fm) if (fm[k] === undefined) delete fm[k];
    await this.app.vault.modify(file, serializeFrontmatter(fm) + '\n' + body);
  }

  async deleteTask(id) {
    const file = this.app.vault.getAbstractFileByPath(`${this.folder}/${id}.md`);
    if (file instanceof TFile) await this.app.vault.delete(file);
  }
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 3 — Modals
// ═══════════════════════════════════════════════════════════════════

class NewProjectModal extends Modal {
  constructor(app, onSubmit) { super(app); this.onSubmit = onSubmit; }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl('h3', { text: 'New Project' });
    const inp = contentEl.createEl('input', {
      type: 'text', placeholder: 'Project name', cls: 'pos-modal-input',
    });
    const desc = contentEl.createEl('textarea', {
      placeholder: 'Description (optional)', cls: 'pos-modal-textarea',
    });
    const br = contentEl.createEl('div', { cls: 'pos-modal-buttons' });
    br.createEl('button', { text: 'Cancel' })
      .addEventListener('click', () => this.close());
    br.createEl('button', { text: 'Create', cls: 'pos-modal-primary' })
      .addEventListener('click', () => {
        const name = inp.value.trim();
        if (!name) { new Notice('Project name is required'); return; }
        this.onSubmit({ name, description: desc.value.trim() });
        this.close();
      });
  }
  onClose() { this.contentEl.empty(); }
}

class EditProjectModal extends Modal {
  constructor(app, project, onSave) {
    super(app); this.project = project; this.onSave = onSave;
  }
  onOpen() {
    const { contentEl, project } = this;
    contentEl.empty();
    contentEl.createEl('h3', { text: 'Edit Project' });
    const inp = contentEl.createEl('input', {
      type: 'text', placeholder: 'Project name', cls: 'pos-modal-input',
    });
    inp.value = project.name;
    const desc = contentEl.createEl('textarea', {
      placeholder: 'Description', cls: 'pos-modal-textarea',
    });
    desc.value = project.description;
    const br = contentEl.createEl('div', { cls: 'pos-modal-buttons' });
    br.createEl('button', { text: 'Cancel' })
      .addEventListener('click', () => this.close());
    br.createEl('button', { text: 'Save', cls: 'pos-modal-primary' })
      .addEventListener('click', () => {
        const name = inp.value.trim();
        if (!name) { new Notice('Project name is required'); return; }
        this.onSave({ name, description: desc.value.trim() });
        this.close();
      });
  }
  onClose() { this.contentEl.empty(); }
}

class NewTaskModal extends Modal {
  constructor(app, onSubmit) { super(app); this.onSubmit = onSubmit; }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl('h3', { text: 'New Task' });
    const inp = contentEl.createEl('input', {
      type: 'text', placeholder: 'Task name', cls: 'pos-modal-input',
    });
    const desc = contentEl.createEl('textarea', {
      placeholder: 'Description (optional)', cls: 'pos-modal-textarea',
    });
    // Weight
    const wr = contentEl.createEl('div', { cls: 'pos-modal-row' });
    wr.createEl('label', { text: 'Weight:' });
    const wInp = wr.createEl('input', {
      type: 'number', attr: { min: '1', value: '1' }, cls: 'pos-modal-number',
    });
    // Fixed duration
    const fr = contentEl.createEl('div', { cls: 'pos-modal-row' });
    const fChk = fr.createEl('input', { type: 'checkbox' });
    fr.createEl('label', { text: ' Fixed duration (min):' });
    const fInp = fr.createEl('input', {
      type: 'number', attr: { min: '1', value: '30', disabled: true }, cls: 'pos-modal-number',
    });
    fChk.addEventListener('change', () => { fInp.disabled = !fChk.checked; });
    // Deadline
    const dr = contentEl.createEl('div', { cls: 'pos-modal-row' });
    const dChk = dr.createEl('input', { type: 'checkbox' });
    dr.createEl('label', { text: ' Deadline:' });
    const dInp = dr.createEl('input', { type: 'datetime-local', cls: 'pos-modal-datetime' });
    dInp.disabled = true;
    dChk.addEventListener('change', () => { dInp.disabled = !dChk.checked; });
    // Buttons
    const br = contentEl.createEl('div', { cls: 'pos-modal-buttons' });
    br.createEl('button', { text: 'Cancel' })
      .addEventListener('click', () => this.close());
    br.createEl('button', { text: 'Create', cls: 'pos-modal-primary' })
      .addEventListener('click', () => {
        const name = inp.value.trim();
        if (!name) { new Notice('Task name is required'); return; }
        let deadline = null;
        if (dChk.checked && dInp.value) {
          const dlDate = new Date(dInp.value);
          if (!isNaN(dlDate.getTime())) deadline = dlDate.toISOString();
        }
        this.onSubmit({
          name,
          description: desc.value.trim(),
          weight: Math.max(1, Number(wInp.value) || 1),
          isFixedDuration: fChk.checked,
          fixedDuration: fChk.checked ? (Number(fInp.value) || 30) : null,
          deadline,
        });
        this.close();
      });
  }
  onClose() { this.contentEl.empty(); }
}

class EditTaskModal extends Modal {
  constructor(app, task, onSave) {
    super(app); this.task = task; this.onSave = onSave;
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
    wInp.value = task.weight;
    // Fixed duration
    const fr = contentEl.createEl('div', { cls: 'pos-modal-row' });
    const fChk = fr.createEl('input', { type: 'checkbox' });
    fChk.checked = task.isFixedDuration;
    fr.createEl('label', { text: ' Fixed duration (min):' });
    const fInp = fr.createEl('input', {
      type: 'number', attr: { min: '1' }, cls: 'pos-modal-number',
    });
    fInp.value = task.fixedDuration || 30;
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
    br.createEl('button', { text: 'Cancel' })
      .addEventListener('click', () => this.close());
    br.createEl('button', { text: 'Save', cls: 'pos-modal-primary' })
      .addEventListener('click', () => {
        const name = inp.value.trim();
        if (!name) { new Notice('Task name is required'); return; }
        const updates = {
          name,
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

// ═══════════════════════════════════════════════════════════════════
// SECTION 4 — View Renderers
// ═══════════════════════════════════════════════════════════════════

// ── 4a. Aging Renderer (Projects view) ──────────────────────────

class AgingRenderer {
  constructor(view) {
    this.view = view;
    this._ageSpans = [];
  }

  async render(container) {
    container.empty();
    const projects = await this.view.plugin.projectManager.loadProjects();
    const allTasks = await this.view.plugin.taskManager.loadAllTasks();

    // New project button
    const btnRow = container.createEl('div', { cls: 'pos-newtask-row' });
    btnRow.createEl('button', { text: '+ New Project', cls: 'pos-newtask-btn' })
      .addEventListener('click', () => {
        new NewProjectModal(this.view.app, async (data) => {
          await this.view.plugin.projectManager.createProject(data);
          this.view.refresh();
        }).open();
      });

    if (projects.length === 0) {
      container.createEl('p', { text: 'No projects yet. Create one!', cls: 'pos-empty' });
      return;
    }

    // Age range for coloring
    const allTimes = projects.map(p => new Date(p.createdAt).getTime());
    const minTime = Math.min(...allTimes);
    const maxTime = Math.max(...allTimes);
    const range = maxTime - minTime || 1;

    const list = container.createEl('div', { cls: 'pos-project-list' });
    this._ageSpans = [];

    for (const project of projects) {
      const card = list.createEl('div', {
        cls: 'pos-card pos-project-card',
        attr: { 'data-project-id': project.id },
      });

      // Green (newest) → Red (oldest)
      const tMs = new Date(project.createdAt).getTime();
      const ratio = range > 1 ? (tMs - minTime) / range : 0;
      const hue = 120 * (1 - ratio);
      card.style.backgroundColor = `hsl(${hue}, 70%, 90%)`;

      // Name (clickable → edit)
      const nameEl = card.createEl('div', { cls: 'pos-card-name', text: project.name });
      nameEl.addEventListener('click', (e) => {
        e.stopPropagation();
        new EditProjectModal(this.view.app, project, async (updates) => {
          await this.view.plugin.projectManager.updateProject(project.id, updates);
          this.view.refresh();
        }).open();
      });

      if (project.description) {
        card.createEl('div', { cls: 'pos-card-desc', text: project.description });
      }

      // Age
      const ageEl = card.createEl('div', {
        cls: 'pos-age', attr: { 'data-created': project.createdAt },
      });
      ageEl.textContent = formatAge(project.createdAt);
      this._ageSpans.push(ageEl);

      // Task counts (computed from pre-loaded data)
      const projectTasks = allTasks.filter(t => t.project === project.id);
      const counts = {
        backlog: projectTasks.filter(t => t.status === 'backlog').length,
        running: projectTasks.filter(t => t.status === 'running').length,
        review: projectTasks.filter(t => t.status === 'review').length,
        total: projectTasks.length,
      };
      const meta = card.createEl('div', { cls: 'pos-card-meta' });
      meta.createEl('span', { text: `${counts.total} tasks` });
      if (counts.running > 0) meta.createEl('span', { text: `${counts.running} running` });
      if (counts.review > 0) meta.createEl('span', { text: `${counts.review} done` });

      // Actions
      const acts = card.createEl('div', { cls: 'pos-card-acts' });
      acts.createEl('button', { text: 'Open' }).addEventListener('click', (e) => {
        e.stopPropagation();
        this.view.selectProject(project.id, 'elastic');
      });
      acts.createEl('button', { text: 'Deadlines' }).addEventListener('click', (e) => {
        e.stopPropagation();
        this.view.selectProject(project.id, 'deadlines');
      });
      acts.createEl('button', { text: 'Archive', cls: 'pos-del' }).addEventListener('click', async (e) => {
        e.stopPropagation();
        await this.view.plugin.projectManager.archiveProject(project.id);
        this.view.refresh();
      });
    }
  }

  tick() {
    for (const span of this._ageSpans) {
      if (!span.isConnected) continue;
      const created = span.dataset.created;
      if (created) span.textContent = formatAge(created);
    }
  }
}

// ── 4b. Elastic Renderer (Kanban + Timeline) ────────────────────

class ElasticRenderer {
  constructor(view) {
    this.view = view;
    this.tasks = [];
    this.dragPlaceholder = null;
    this.dragTaskId = null;
    this.ro = null;
  }

  async render(container) {
    container.empty();
    const projectId = this.view.session.selectedProjectId;
    this.tasks = await this.view.plugin.taskManager.loadTasksForProject(projectId);
    const session = this.view.session;

    // Deadline controls + Lock
    const hdr = container.createEl('div', { cls: 'pos-header' });
    const dr = hdr.createEl('div', { cls: 'pos-deadline-controls' });
    const dInp = dr.createEl('input', { type: 'date' });
    dInp.value = fmtDate(session.deadline);
    const tInp = dr.createEl('input', { type: 'time', attr: { step: '60' } });
    tInp.value = fmtTime(session.deadline);
    dr.createEl('button', { text: 'Apply' })
      .addEventListener('click', () => this.setDeadline(dInp.value, tInp.value));
    const lBtn = dr.createEl('button', {
      cls: `pos-lock-btn ${session.isLocked ? 'locked' : ''}`,
      text: session.isLocked ? 'Unlock' : 'Lock',
    });
    lBtn.addEventListener('click', () => this.toggleLock());

    // Three columns
    const cols = container.createEl('div', { cls: 'pos-columns' });
    this.buildColumn(cols, 'Backlog', 'backlog');
    this.buildColumn(cols, 'Running', 'running');
    this.buildColumn(cols, 'Review', 'review');

    requestAnimationFrame(() => {
      this.applyHeights();
      this.observeRunning();
      if (session.isLocked) this.updateLockLine();
    });
  }

  buildColumn(parent, title, status) {
    const col = parent.createEl('div', { cls: 'pos-col' });
    const tasks = this.tasks.filter(t => t.status === status);
    col.createEl('h4', { text: `${title} (${tasks.length})`, cls: 'pos-col-title' });
    const wrapper = col.createEl('div', { cls: 'pos-list-wrapper', attr: { 'data-status': status } });
    const list = wrapper.createEl('div', { cls: 'pos-list' });
    tasks.forEach(t => this.buildCard(list, t));

    if (status === 'backlog') {
      const btnRow = list.createEl('div', { cls: 'pos-newtask-row' });
      btnRow.createEl('button', { text: '+ New Task', cls: 'pos-newtask-btn' })
        .addEventListener('click', () => {
          new NewTaskModal(this.view.app, async (d) => {
            d.project = this.view.session.selectedProjectId;
            await this.view.plugin.taskManager.createTask(d);
            this.view.refresh();
          }).open();
        });
    }
    if (status === 'review' && tasks.length > 0) {
      const bulk = list.createEl('div', { cls: 'pos-bulk-row' });
      bulk.createEl('button', { text: 'Restore All' })
        .addEventListener('click', () => this.restoreAllReview());
      bulk.createEl('button', { text: 'Delete All' })
        .addEventListener('click', () => this.deleteAllReview());
    }
    if (status === 'running') {
      wrapper.createEl('div', { cls: 'pos-wipe' });
      wrapper.createEl('div', { cls: 'pos-redline' });
    }

    wrapper.addEventListener('dragover', (e) => this.onDragOver(e, wrapper));
    wrapper.addEventListener('drop', (e) => this.onDrop(e, wrapper));
  }

  buildCard(list, task) {
    const card = list.createEl('div', {
      cls: 'pos-card',
      attr: { draggable: 'true', 'data-task-id': task.id, 'data-weight': task.weight },
    });
    card.addEventListener('dragstart', (e) => this.onDragStart(e, task));
    card.addEventListener('dragend', () => this.onDragEnd());
    if (task.isCompleted) card.classList.add('pos-completed');

    const nameEl = card.createEl('div', { cls: 'pos-card-name', text: task.name });
    nameEl.addEventListener('click', (e) => {
      e.stopPropagation();
      const file = this.view.app.vault.getAbstractFileByPath(`${TASKS_FOLDER}/${task.id}.md`);
      if (file) this.view.app.workspace.getLeaf().openFile(file);
    });

    if (task.description) card.createEl('div', { cls: 'pos-card-desc', text: task.description });

    const meta = card.createEl('div', { cls: 'pos-card-meta' });
    if (task.isFixedDuration && task.fixedDuration)
      meta.createEl('span', { text: `Fixed ${task.fixedDuration}m` });
    if (task.status === 'running') {
      const tl = this.getTimeline();
      const ti = tl.find(t => t.id === task.id);
      if (ti) meta.createEl('span', {
        text: `${fmtTime(ti.endTime)} (${fmtDur(Math.round(ti.calculatedDuration))})`,
      });
    }

    const acts = card.createEl('div', { cls: 'pos-card-acts' });
    if (task.status === 'backlog') {
      acts.createEl('button', { text: 'Start' }).addEventListener('click', (e) => {
        e.stopPropagation(); this.changeStatus(task.id, 'running');
      });
      acts.createEl('button', { text: 'Delete', cls: 'pos-del' }).addEventListener('click', (e) => {
        e.stopPropagation(); this.deleteTask(task.id);
      });
    } else if (task.status === 'running') {
      acts.createEl('button', { text: 'Done' }).addEventListener('click', (e) => {
        e.stopPropagation(); this.handleCompleteTask(task);
      });
      acts.createEl('button', { text: 'Backlog' }).addEventListener('click', (e) => {
        e.stopPropagation(); this.changeStatus(task.id, 'backlog');
      });
      // Weight controls
      const wg = acts.createEl('span', { cls: 'pos-wg' });
      wg.createEl('button', { text: '−' }).addEventListener('click', (e) => {
        e.stopPropagation(); this.adjustWeight(task.id, -1);
      });
      wg.createEl('span', { text: String(task.weight) });
      wg.createEl('button', { text: '+' }).addEventListener('click', (e) => {
        e.stopPropagation(); this.adjustWeight(task.id, 1);
      });
      // Fixed toggle
      const ft = acts.createEl('label', { cls: 'pos-fixed' });
      const cb = ft.createEl('input', { type: 'checkbox' });
      cb.checked = task.isFixedDuration;
      cb.addEventListener('change', (e) => {
        e.stopPropagation(); this.toggleFixed(task.id, cb.checked);
      });
      ft.createEl('span', { text: 'Fixed' });
      if (task.isFixedDuration) {
        const fi = ft.createEl('input', {
          type: 'number', attr: { min: '1' }, cls: 'pos-fixed-input',
        });
        fi.value = task.fixedDuration || 30;
        fi.addEventListener('change', (e) => {
          e.stopPropagation(); this.setFixed(task.id, Number(fi.value));
        });
      }
      acts.createEl('button', { text: 'Delete', cls: 'pos-del' }).addEventListener('click', (e) => {
        e.stopPropagation(); this.deleteTask(task.id);
      });
    } else if (task.status === 'review') {
      acts.createEl('button', { text: 'Restore' }).addEventListener('click', (e) => {
        e.stopPropagation(); this.changeStatus(task.id, 'running');
      });
      acts.createEl('button', { text: 'Backlog' }).addEventListener('click', (e) => {
        e.stopPropagation(); this.changeStatus(task.id, 'backlog');
      });
      acts.createEl('button', { text: 'Delete', cls: 'pos-del' }).addEventListener('click', (e) => {
        e.stopPropagation(); this.deleteTask(task.id);
      });
    }
  }

  // ── Drag & Drop ──
  onDragStart(e, task) {
    e.dataTransfer.setData('text/plain', task.id);
    this.dragTaskId = task.id;
    const card = this.view.contentEl.querySelector(`.pos-card[data-task-id="${task.id}"]`);
    if (card) card.classList.add('pos-dragging-source');
  }
  onDragEnd() {
    this.clearDragPlaceholder();
    if (this.dragTaskId) {
      const card = this.view.contentEl.querySelector(`.pos-card[data-task-id="${this.dragTaskId}"]`);
      if (card) card.classList.remove('pos-dragging-source');
    }
    this.dragTaskId = null;
  }
  onDragOver(e, wrapper) {
    e.preventDefault();
    if (!this.dragTaskId) return;
    const task = this.tasks.find(t => t.id === this.dragTaskId);
    if (!task) return;
    const targetStatus = wrapper.dataset.status;
    if (this.view.session.isLocked &&
        (task.status === 'running' || targetStatus === 'running') &&
        task.status !== targetStatus) {
      e.dataTransfer.dropEffect = 'none';
      return;
    }
    const cards = Array.from(wrapper.querySelectorAll('.pos-card:not(.pos-dragging-source)'));
    const targetIndex = this.calculateTargetIndex(e.clientY, cards);
    this.showPlaceholder(wrapper, targetIndex);
  }
  async onDrop(e, wrapper) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;
    let targetIndex = 0;
    if (this.dragPlaceholder && this.dragPlaceholder.parentNode) {
      const list = wrapper.querySelector('.pos-list');
      const children = Array.from(list.children);
      const placeholderIdx = children.indexOf(this.dragPlaceholder);
      targetIndex = children.slice(0, placeholderIdx)
        .filter(el => el.classList.contains('pos-card') && !el.classList.contains('pos-dragging-source'))
        .length;
    } else {
      const cards = Array.from(wrapper.querySelectorAll('.pos-card'));
      targetIndex = this.calculateTargetIndex(e.clientY, cards);
    }
    this.clearDragPlaceholder();
    const targetStatus = wrapper.dataset.status;
    if (task.status === targetStatus) {
      await this.reorderTask(taskId, task.status, targetIndex);
    } else {
      await this.moveTaskToColumn(taskId, targetStatus, targetIndex);
    }
  }
  calculateTargetIndex(clientY, cards) {
    if (!cards.length) return 0;
    for (let i = 0; i < cards.length; i++) {
      const rect = cards[i].getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) return i;
    }
    return cards.length;
  }
  showPlaceholder(wrapper, index) {
    this.clearDragPlaceholder();
    const list = wrapper.querySelector('.pos-list');
    if (!list) return;
    const line = document.createElement('div');
    line.className = 'pos-drag-placeholder';
    const cards = Array.from(list.querySelectorAll('.pos-card:not(.pos-dragging-source)'));
    if (index >= cards.length) list.appendChild(line);
    else list.insertBefore(line, cards[index]);
    this.dragPlaceholder = line;
  }
  clearDragPlaceholder() {
    if (this.dragPlaceholder && this.dragPlaceholder.parentNode) {
      this.dragPlaceholder.parentNode.removeChild(this.dragPlaceholder);
      this.dragPlaceholder = null;
    }
  }

  // ── Reorder / Move ──
  async reorderTask(taskId, status, newIndex) {
    const colTasks = this.tasks.filter(t => t.status === status);
    const oldIndex = colTasks.findIndex(t => t.id === taskId);
    if (oldIndex === -1 || oldIndex === newIndex) return;
    const ids = colTasks.map(t => t.id);
    ids.splice(oldIndex, 1);
    ids.splice(newIndex, 0, taskId);
    for (let i = 0; i < ids.length; i++) {
      await this.view.plugin.taskManager.updateTask(ids[i], { orderIndex: i });
    }
    this.view.refresh();
  }
  async moveTaskToColumn(taskId, newStatus, targetIndex) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;
    const oldStatus = task.status;
    await this.view.plugin.taskManager.updateTask(taskId, {
      status: newStatus, orderIndex: targetIndex, isCompleted: newStatus === 'review',
    });
    // Re-index destination
    const destTasks = this.tasks.filter(t => t.status === newStatus && t.id !== taskId);
    destTasks.splice(targetIndex, 0, { id: taskId });
    for (let i = 0; i < destTasks.length; i++) {
      await this.view.plugin.taskManager.updateTask(destTasks[i].id, { orderIndex: i });
    }
    // Re-index source
    const srcTasks = this.tasks.filter(t => t.status === oldStatus && t.id !== taskId);
    for (let i = 0; i < srcTasks.length; i++) {
      await this.view.plugin.taskManager.updateTask(srcTasks[i].id, { orderIndex: i });
    }
    this.view.refresh();
  }

  // ── Actions ──
  async changeStatus(id, status) {
    await this.view.plugin.taskManager.updateTask(id, { status, isCompleted: status === 'review' });
    this.view.refresh();
  }
  async handleCompleteTask(task) {
    if (this.view.session.isLocked) {
      await this.view.plugin.taskManager.updateTask(task.id, { isCompleted: !task.isCompleted });
    } else {
      await this.view.plugin.taskManager.updateTask(task.id, { status: 'review', isCompleted: true });
    }
    this.view.refresh();
  }
  async adjustWeight(id, d) {
    const t = this.tasks.find(x => x.id === id);
    if (!t) return;
    await this.view.plugin.taskManager.updateTask(id, { weight: Math.max(1, t.weight + d) });
    this.view.refresh();
  }
  async toggleFixed(id, v) {
    const t = this.tasks.find(x => x.id === id);
    await this.view.plugin.taskManager.updateTask(id, {
      isFixedDuration: v, fixedDuration: v ? (t.fixedDuration || 30) : null,
    });
    this.view.refresh();
  }
  async setFixed(id, m) {
    await this.view.plugin.taskManager.updateTask(id, { isFixedDuration: true, fixedDuration: m });
    this.view.refresh();
  }
  async deleteTask(id) {
    await this.view.plugin.taskManager.deleteTask(id);
    this.view.refresh();
  }
  async restoreAllReview() {
    const ts = this.tasks.filter(t => t.status === 'review');
    for (const t of ts) await this.view.plugin.taskManager.updateTask(t.id, { status: 'running', isCompleted: false });
    this.view.refresh();
  }
  async deleteAllReview() {
    const ts = this.tasks.filter(t => t.status === 'review');
    for (const t of ts) await this.view.plugin.taskManager.deleteTask(t.id);
    this.view.refresh();
  }

  // ── Deadline / Lock ──
  setDeadline(d, t) {
    const dt = new Date(`${d}T${t}`);
    if (isNaN(dt.getTime())) return;
    const session = this.view.session;
    session.deadline = dt.toISOString();
    if (session.isLocked) {
      session.isLocked = false;
      session.lockedAt = null;
      session.lockedDeadline = null;
      session.lockedTimeline = [];
    }
    this.view.refresh();
  }
  toggleLock() {
    const session = this.view.session;
    if (session.isLocked) {
      session.isLocked = false;
      session.lockedAt = null;
      session.lockedDeadline = null;
      session.lockedTimeline = [];
      this.view.refresh();
      return;
    }
    const running = this.tasks.filter(t => t.status === 'running');
    session.lockedAt = new Date().toISOString();
    session.lockedDeadline = session.deadline;
    session.lockedTimeline = calculateLiquidTimeline(running, new Date(), new Date(session.deadline));
    session.isLocked = true;
    this.view.refresh();
  }
  getTimeline() {
    const s = this.view.session;
    return s.isLocked
      ? s.lockedTimeline
      : calculateLiquidTimeline(
          this.tasks.filter(t => t.status === 'running'),
          new Date(), new Date(s.deadline)
        );
  }

  // ── Proportional Heights ──
  applyHeights() {
    const wrapper = this.view.contentEl.querySelector('.pos-list-wrapper[data-status="running"]');
    if (!wrapper || !wrapper.isConnected) return;
    const cards = Array.from(wrapper.querySelectorAll('.pos-card'));
    const tl = this.getTimeline();
    const total = tl.reduce((s, t) => s + t.calculatedDuration, 0);
    const H = wrapper.clientHeight;
    if (total <= 0 || H <= 0) {
      const tw = cards.reduce((s, el) => s + (parseFloat(el.dataset.weight) || 1), 0) || 1;
      cards.forEach(el => {
        el.style.height = Math.max(65, (parseFloat(el.dataset.weight) || 1) / tw * Math.max(H, 300)) + 'px';
      });
      return;
    }
    cards.forEach(el => {
      const ti = tl.find(t => t.id === el.dataset.taskId);
      const dur = ti ? ti.calculatedDuration : 0;
      el.style.height = Math.max(65, (dur / total) * H) + 'px';
    });
  }
  observeRunning() {
    const wrapper = this.view.contentEl.querySelector('.pos-list-wrapper[data-status="running"]');
    if (!wrapper) return;
    this.ro?.disconnect();
    this.ro = new ResizeObserver(() => {
      this.applyHeights();
      if (this.view.session.isLocked) this.updateLockLine();
    });
    this.ro.observe(wrapper);
  }
  updateLockLine() {
    const s = this.view.session;
    if (!s.isLocked) return;
    const wrapper = this.view.contentEl.querySelector('.pos-list-wrapper[data-status="running"]');
    if (!wrapper || !wrapper.isConnected) return;
    const line = wrapper.querySelector('.pos-redline');
    const wipe = wrapper.querySelector('.pos-wipe');
    if (!line || !wipe) return;
    const start = new Date(s.lockedAt).getTime();
    const end = new Date(s.lockedDeadline).getTime();
    const p = Math.min(1, Math.max(0, (Date.now() - start) / (end - start)));
    const top = p * wrapper.scrollHeight;
    line.style.top = top + 'px';
    wipe.style.top = '0';
    wipe.style.height = top + 'px';
  }

  tick() {
    if (this.view.session.isLocked) this.updateLockLine();
  }

  destroy() {
    this.ro?.disconnect();
    this.clearDragPlaceholder();
  }
}

// ── 4c. Deadlines Renderer ──────────────────────────────────────

class DeadlinesRenderer {
  constructor(view) {
    this.view = view;
    this._countdownItems = [];
  }

  async render(container) {
    container.empty();
    const projectId = this.view.session.selectedProjectId;
    let tasks = await this.view.plugin.taskManager.loadTasksForProject(projectId);
    let deadlineTasks = tasks
      .filter(t => t.deadline && t.status !== 'review')
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

    // Mini calendar
    this.renderCalendar(container, deadlineTasks);

    // Filter row
    const session = this.view.session;
    const filterRow = container.createEl('div', { cls: 'pos-filter-row' });
    if (session.deadlineFilterDate) {
      filterRow.createEl('span', { text: `Showing: ${session.deadlineFilterDate}` });
      filterRow.createEl('button', { text: 'Clear', cls: 'pos-clear-btn' })
        .addEventListener('click', () => { session.deadlineFilterDate = null; this.view.refresh(); });
    } else {
      filterRow.createEl('span', { text: 'All deadlines' });
    }

    // Apply date filter
    if (session.deadlineFilterDate) {
      deadlineTasks = deadlineTasks.filter(t =>
        new Date(t.deadline).toISOString().slice(0, 10) === session.deadlineFilterDate
      );
    }

    // New task button
    const btnRow = container.createEl('div', { cls: 'pos-newtask-row' });
    btnRow.createEl('button', { text: '+ New Task with Deadline', cls: 'pos-newtask-btn' })
      .addEventListener('click', () => {
        new NewTaskModal(this.view.app, async (d) => {
          d.project = this.view.session.selectedProjectId;
          if (!d.deadline) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            d.deadline = tomorrow.toISOString();
          }
          await this.view.plugin.taskManager.createTask(d);
          this.view.refresh();
        }).open();
      });

    if (deadlineTasks.length === 0) {
      container.createEl('p', { text: 'No tasks with deadlines.', cls: 'pos-empty' });
      this._countdownItems = [];
      return;
    }

    const list = container.createEl('div', { cls: 'pos-deadline-list' });
    this._countdownItems = [];
    const now = Date.now();

    for (const task of deadlineTasks) {
      const card = list.createEl('div', {
        cls: 'pos-card pos-deadline-card',
        attr: { 'data-task-id': task.id },
      });
      if (task.isCompleted) card.classList.add('pos-completed');

      const dl = new Date(task.deadline).getTime();
      const diff = dl - now;
      card.style.backgroundColor = deadlineHue(diff);

      const nameEl = card.createEl('div', { cls: 'pos-card-name', text: task.name });
      nameEl.addEventListener('click', (e) => {
        e.stopPropagation();
        new EditTaskModal(this.view.app, task, async (updates) => {
          await this.view.plugin.taskManager.updateTask(task.id, updates);
          this.view.refresh();
        }).open();
      });

      if (task.description) card.createEl('div', { cls: 'pos-card-desc', text: task.description });

      const timer = card.createEl('div', { cls: 'pos-countdown' });
      timer.textContent = formatCountdown(diff);

      this._countdownItems.push({ el: timer, card, deadline: task.deadline });

      const acts = card.createEl('div', { cls: 'pos-card-acts' });
      acts.createEl('button', { text: '✓ Done' }).addEventListener('click', async (e) => {
        e.stopPropagation();
        await this.view.plugin.taskManager.updateTask(task.id, { status: 'review', isCompleted: true });
        this.view.refresh();
      });
      acts.createEl('button', { text: 'Delete', cls: 'pos-del' }).addEventListener('click', async (e) => {
        e.stopPropagation();
        await this.view.plugin.taskManager.deleteTask(task.id);
        this.view.refresh();
      });
    }
  }

  renderCalendar(parent, rawTasks) {
    const session = this.view.session;
    const year = session.calendarYear;
    const month = session.calendarMonth;
    const deadlineDays = new Set();
    rawTasks.forEach(t => {
      const d = new Date(t.deadline);
      if (!isNaN(d.getTime())) deadlineDays.add(d.toISOString().slice(0, 10));
    });

    const calWrap = parent.createEl('div', { cls: 'pos-calendar' });
    const navRow = calWrap.createEl('div', { cls: 'pos-cal-nav' });
    navRow.createEl('button', { text: '‹' }).addEventListener('click', () => {
      session.calendarMonth--;
      if (session.calendarMonth < 0) { session.calendarYear--; session.calendarMonth = 11; }
      this.view.refresh();
    });
    navRow.createEl('span', {
      text: new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' }),
    });
    navRow.createEl('button', { text: '›' }).addEventListener('click', () => {
      session.calendarMonth++;
      if (session.calendarMonth > 11) { session.calendarYear++; session.calendarMonth = 0; }
      this.view.refresh();
    });

    const tbl = calWrap.createEl('table');
    const thead = tbl.createEl('thead');
    const tr = thead.createEl('tr');
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(d => tr.createEl('th', { text: d }));

    const tbody = tbl.createEl('tbody');
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let date = 1;
    for (let row = 0; date <= daysInMonth; row++) {
      const r = tbody.createEl('tr');
      for (let col = 0; col < 7; col++) {
        const cell = r.createEl('td');
        if (row === 0 && col < firstDay) continue;
        if (date > daysInMonth) continue;
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
        cell.textContent = date;
        cell.dataset.date = dateStr;
        if (deadlineDays.has(dateStr)) cell.classList.add('has-deadline');
        if (session.deadlineFilterDate === dateStr) cell.classList.add('selected');
        cell.addEventListener('click', () => {
          session.deadlineFilterDate = session.deadlineFilterDate === dateStr ? null : dateStr;
          this.view.refresh();
        });
        date++;
      }
    }
  }

  tick() {
    const now = Date.now();
    for (const item of this._countdownItems) {
      if (!item.el.isConnected) continue;
      const diff = new Date(item.deadline).getTime() - now;
      item.el.textContent = formatCountdown(diff);
      if (item.card.isConnected) item.card.style.backgroundColor = deadlineHue(diff);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 5 — Main View
// ═══════════════════════════════════════════════════════════════════

class ProjectOSView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.session = {
      mode: 'projects',
      selectedProjectId: null,
      deadline: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      isLocked: false,
      lockedAt: null,
      lockedDeadline: null,
      lockedTimeline: [],
      calendarYear: new Date().getFullYear(),
      calendarMonth: new Date().getMonth(),
      deadlineFilterDate: null,
    };
    this._eventRefs = [];
    this._debounce = null;
    this.agingRenderer = new AgingRenderer(this);
    this.elasticRenderer = new ElasticRenderer(this);
    this.deadlinesRenderer = new DeadlinesRenderer(this);
  }

  getViewType() { return VIEW_TYPE; }
  getDisplayText() { return 'Project OS'; }
  getIcon() { return 'layout-dashboard'; }

  async onOpen() {
    this.contentEl.empty();
    this.contentEl.addClass('pos-view');
    await this.refresh();
    this._eventRefs = [
      this.app.metadataCache.on('changed', (file) => {
        if (file?.path?.startsWith(TASKS_FOLDER + '/') || file?.path?.startsWith(PROJECTS_FOLDER + '/'))
          this.debouncedRefresh();
      }),
      this.app.vault.on('delete', (file) => {
        if (file?.path?.startsWith(TASKS_FOLDER + '/') || file?.path?.startsWith(PROJECTS_FOLDER + '/'))
          this.debouncedRefresh();
      }),
      this.app.vault.on('rename', (file, old) => {
        if (file?.path?.startsWith(TASKS_FOLDER + '/') || file?.path?.startsWith(PROJECTS_FOLDER + '/') ||
            old?.startsWith(TASKS_FOLDER + '/') || old?.startsWith(PROJECTS_FOLDER + '/'))
          this.debouncedRefresh();
      }),
    ];
  }

  debouncedRefresh() {
    clearTimeout(this._debounce);
    this._debounce = setTimeout(() => this.refresh(), 250);
  }

  async onClose() {
    this.elasticRenderer.destroy();
    for (const ref of this._eventRefs) this.app.metadataCache.offref(ref);
  }

  selectProject(projectId, mode) {
    this.session.selectedProjectId = projectId;
    this.session.mode = mode || 'elastic';
    this.refresh();
  }

  async refresh() {
    const c = this.contentEl;
    c.empty();
    c.addClass('pos-view');

    // ── Mode bar ──
    const modeBar = c.createEl('div', { cls: 'pos-mode-bar' });
    [
      { key: 'projects', label: 'Projects' },
      { key: 'elastic', label: 'Elastic' },
      { key: 'deadlines', label: 'Deadlines' },
    ].forEach(m => {
      const btn = modeBar.createEl('button', {
        text: m.label,
        cls: `pos-mode-btn ${this.session.mode === m.key ? 'pos-mode-active' : ''}`,
      });
      btn.addEventListener('click', () => {
        if (this.session.mode === m.key) return;
        this.session.mode = m.key;
        this.refresh();
      });
    });

    // ── Project selector (elastic/deadlines only) ──
    if (this.session.mode === 'elastic' || this.session.mode === 'deadlines') {
      const projects = await this.plugin.projectManager.loadProjects();
      const selRow = c.createEl('div', { cls: 'pos-project-selector-row' });
      selRow.createEl('label', { text: 'Project: ' });
      const sel = selRow.createEl('select', { cls: 'pos-project-selector' });
      const uncatOpt = sel.createEl('option', { text: '— Uncategorized —' });
      uncatOpt.value = '';
      if (!this.session.selectedProjectId) uncatOpt.selected = true;
      projects.forEach(p => {
        const opt = sel.createEl('option', { text: p.name });
        opt.value = p.id;
        if (this.session.selectedProjectId === p.id) opt.selected = true;
      });
      sel.addEventListener('change', () => {
        this.session.selectedProjectId = sel.value || null;
        this.refresh();
      });
    }

    // ── Content area ──
    const content = c.createEl('div', { cls: 'pos-content' });
    if (this.session.mode === 'projects') {
      await this.agingRenderer.render(content);
    } else if (this.session.mode === 'elastic') {
      await this.elasticRenderer.render(content);
    } else if (this.session.mode === 'deadlines') {
      await this.deadlinesRenderer.render(content);
    }
  }

  /** Called by the global 1-second timer. */
  tickActiveRenderer() {
    if (!this.contentEl.isConnected) return;
    if (this.session.mode === 'projects') this.agingRenderer.tick();
    else if (this.session.mode === 'elastic') this.elasticRenderer.tick();
    else if (this.session.mode === 'deadlines') this.deadlinesRenderer.tick();
  }
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 6 — Plugin
// ═══════════════════════════════════════════════════════════════════

class ProjectOSPlugin extends Plugin {
  async onload() {
    this.projectManager = new ProjectManager(this.app);
    this.taskManager = new TaskDataManager(this.app);

    this.registerView(VIEW_TYPE, (leaf) => new ProjectOSView(leaf, this));
    this.addRibbonIcon('layout-dashboard', 'Project OS', () => this.activateView());
    this.addCommand({
      id: 'open-project-os',
      name: 'Open Project OS',
      callback: () => this.activateView(),
    });

    // One-time migration
    await this.runMigration();

    // Global 1-second timer — dispatches to the active view's tick()
    this.registerInterval(
      window.setInterval(() => {
        const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE);
        for (const leaf of leaves) {
          if (leaf.view && leaf.view.tickActiveRenderer) {
            leaf.view.tickActiveRenderer();
          }
        }
      }, 1000)
    );
  }

  /**
   * One-time migration: ensures every task file has a createdAt field.
   * Reads file stat birthtime if missing. Records completion in plugin data.
   */
  async runMigration() {
    const settings = (await this.loadData()) || {};
    if (settings.migrationDone) return;

    try {
      const tasksFolder = this.app.vault.getAbstractFileByPath(TASKS_FOLDER);
      if (tasksFolder) {
        const files = this.app.vault.getMarkdownFiles()
          .filter(f => f.path.startsWith(TASKS_FOLDER + '/'));
        for (const f of files) {
          const content = await this.app.vault.read(f);
          const fm = parseFrontmatter(content);
          if (!fm.createdAt) {
            try {
              const stat = await this.app.vault.adapter.stat(f.path);
              fm.createdAt = new Date(stat?.ctime || Date.now()).toISOString();
            } catch {
              fm.createdAt = new Date().toISOString();
            }
            const body = content.replace(/^---\r?\n[\s\S]*?\r?\n---/, '').trim();
            await this.app.vault.modify(f, serializeFrontmatter(fm) + '\n' + body);
          }
        }
      }
    } catch (e) {
      console.error('Project OS migration error:', e);
    }

    settings.migrationDone = true;
    await this.saveData(settings);
  }

  async activateView() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE)[0];
    if (!leaf) {
      leaf = workspace.getRightLeaf(false);
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
    }
    workspace.revealLeaf(leaf);
  }
}

module.exports = ProjectOSPlugin;
