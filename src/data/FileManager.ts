import { App, TFile } from 'obsidian';
import type { ProjectData, TaskData } from '../types';
import { projectsStore, tasksStore } from '../stores/data';

const PROJECTS_FOLDER = 'projects';
const TASKS_FOLDER = 'tasks';

export function parseFrontmatter(content: string): Record<string, any> {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const data: Record<string, any> = {};
  m[1].split('\n').forEach(line => {
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let val: any = line.slice(idx + 1).trim();
    if (val === 'true' || val === 'false') val = val === 'true';
    else if (val === 'null' || val === 'undefined') val = null;
    else if (!isNaN(val as any) && val !== '') val = Number(val);
    data[key] = val;
  });
  return data;
}

export function serializeFrontmatter(fields: Record<string, any>): string {
  let s = '---\n';
  for (const [k, v] of Object.entries(fields)) {
    if (v !== undefined && v !== null) s += `${k}: ${v}\n`;
  }
  s += '---\n';
  return s;
}

export class FileManager {
  constructor(public app: App) {}

  async initialize() {
    await this.ensureFolder(PROJECTS_FOLDER);
    await this.ensureFolder(TASKS_FOLDER);
    await this.loadAll();
  }

  async ensureFolder(folder: string) {
    try {
      const exists = await this.app.vault.adapter.exists(folder);
      if (!exists) {
        await this.app.vault.createFolder(folder);
      }
    } catch (e) {
      console.log(`Folder ${folder} already exists or could not be created:`, e);
    }
  }

  async loadAll() {
    const projects: ProjectData[] = [];
    const tasks: TaskData[] = [];

    const projectFiles = this.app.vault.getMarkdownFiles().filter(f => f.path.startsWith(PROJECTS_FOLDER + '/'));
    for (const f of projectFiles) {
      const c = await this.app.vault.read(f);
      const fm = parseFrontmatter(c);
      if (fm.type !== 'project') continue;
      projects.push({
        id: f.basename,
        name: fm.name || f.basename,
        description: fm.description || '',
        createdAt: fm.createdAt || new Date(f.stat.ctime).toISOString(),
        status: fm.status || 'active',
      });
    }
    projects.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    projectsStore.set(projects);

    const taskFiles = this.app.vault.getMarkdownFiles().filter(f => f.path.startsWith(TASKS_FOLDER + '/'));
    for (const f of taskFiles) {
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
        createdAt: fm.createdAt || new Date(f.stat.ctime).toISOString(),
        deadline: deadline,
      });
    }
    tasks.sort((a, b) => a.orderIndex - b.orderIndex);
    tasksStore.set(tasks);
  }

  async updateTask(id: string, updates: Partial<TaskData>) {
    // 1. Optimistic UI update
    tasksStore.update(tasks => {
      const i = tasks.findIndex(t => t.id === id);
      if (i > -1) {
        tasks[i] = { ...tasks[i], ...updates };
      }
      return tasks;
    });

    // 2. Persist to disk
    const file = this.app.vault.getAbstractFileByPath(`${TASKS_FOLDER}/${id}.md`);
    if (!(file instanceof TFile)) return;
    
    // Read fresh just to be safe
    const c = await this.app.vault.read(file);
    const fm = parseFrontmatter(c);
    const body = c.replace(/^---\r?\n[\s\S]*?\r?\n---/, '').trim();
    
    // Special handling for description: it belongs in the body, not frontmatter.
    let newBody = body;
    if (updates.description !== undefined) {
      newBody = updates.description;
    }
    
    const fmUpdates = { ...updates };
    delete fmUpdates.id;
    delete fmUpdates.description;
    
    Object.assign(fm, fmUpdates);
    for (const k in fm) if (fm[k] === undefined) delete fm[k];
    
    await this.app.vault.modify(file, serializeFrontmatter(fm) + '\n' + newBody);
  }

  async createTask(data: Partial<TaskData>): Promise<string> {
    const id = `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const fm: Record<string, any> = {
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
    await this.app.vault.create(`${TASKS_FOLDER}/${id}.md`, c);
    
    // Update store
    tasksStore.update(t => [...t, {
      ...data,
      id,
      project: fm.project,
      status: 'backlog',
      weight: fm.weight,
      orderIndex: 0,
      isFixedDuration: fm.isFixedDuration,
      fixedDuration: fm.fixedDuration,
      isCompleted: false,
      createdAt: fm.createdAt,
      deadline: fm.deadline || null,
      description: data.description || '',
      name: fm.name
    } as TaskData]);
    
    return id;
  }
  
  async deleteTask(id: string) {
    tasksStore.update(tasks => tasks.filter(t => t.id !== id));
    const file = this.app.vault.getAbstractFileByPath(`${TASKS_FOLDER}/${id}.md`);
    if (file instanceof TFile) await this.app.vault.delete(file);
  }
}
