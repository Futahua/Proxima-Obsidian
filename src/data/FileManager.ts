import { App, TFile, TFolder, TAbstractFile, Notice } from 'obsidian';
import { Parser } from 'expr-eval';
import type { ProjectData, TaskData } from '../types';
import { projectsStore, tasksStore } from '../stores/data';


export function parseFrontmatter(content: string): Record<string, any> {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const data: Record<string, any> = {};
  m[1].split('\n').forEach(line => {
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let val: any = line.slice(idx + 1).trim();
    if (val.startsWith('[') && val.endsWith(']')) {
      const inner = val.slice(1, -1);
      val = inner.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
    } else if (val === 'true' || val === 'false') val = val === 'true';
    else if (val === 'null' || val === 'undefined') val = null;
    else if (!isNaN(val as any) && val !== '') val = Number(val);
    data[key] = val;
  });
  return data;
}

export function serializeFrontmatter(fields: Record<string, any>): string {
  let s = '---\n';
  for (const [k, v] of Object.entries(fields)) {
    if (Array.isArray(v)) {
      s += `${k}: [${v.join(', ')}]\n`;
    } else if (v !== undefined && v !== null) {
      s += `${k}: ${v}\n`;
    }
  }
  s += '---\n';
  return s;
}

export interface ProjectFileInfo {
  path: string;
  name: string;
  extension: string;
  size: number;
  mtime: number;
}

import type ProximaPlugin from '../main';

export class FileManager {
  projects: ProjectData[] = [];
  tasks: TaskData[] = [];

  constructor(public app: App, public plugin: ProximaPlugin) {}

  async initialize() {
    await this.ensureFolder(this.plugin.settings.projectsFolder);
    await this.ensureFolder(this.plugin.settings.tasksFolder);
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

  /**
   * Resolve the project note file path.
   * Supports both subfolder convention (projects/{id}/index.md) and flat convention (projects/{id}.md).
   */
  resolveProjectNotePath(id: string): string | null {
    // Prefer subfolder convention
    const subfolderPath = `${this.plugin.settings.projectsFolder}/${id}/index.md`;
    const flatPath = `${this.plugin.settings.projectsFolder}/${id}.md`;
    
    if (this.app.vault.getAbstractFileByPath(subfolderPath) instanceof TFile) {
      return subfolderPath;
    }
    if (this.app.vault.getAbstractFileByPath(flatPath) instanceof TFile) {
      return flatPath;
    }
    return null;
  }

  /**
   * Check if a project uses the subfolder convention.
   */
  isSubfolderProject(id: string): boolean {
    const subfolderPath = `${this.plugin.settings.projectsFolder}/${id}/index.md`;
    return this.app.vault.getAbstractFileByPath(subfolderPath) instanceof TFile;
  }

  /**
   * Get the directory path for a project's files.
   * For subfolder projects: projects/{id}/
   * For flat projects: projects/ (but files are the single .md)
   */
  getProjectFolderPath(id: string): string {
    return `${this.plugin.settings.projectsFolder}/${id}`;
  }

  async loadAll() {
    const projects: ProjectData[] = [];
    const tasks: TaskData[] = [];
    const seenProjectIds = new Set<string>();

    // Scan for subfolder-based projects: projects/{id}/index.md
    const allFiles = this.app.vault.getMarkdownFiles().filter(f => f.path.startsWith(this.plugin.settings.projectsFolder + '/'));
    
    for (const f of allFiles) {
      const c = await this.app.vault.read(f);
      const fm = parseFrontmatter(c);
      if (fm.type !== 'project') continue;
      
      // Determine project ID based on path convention
      let projectId: string;
      const pathParts = f.path.replace(this.plugin.settings.projectsFolder + '/', '').split('/');
      
      if (pathParts.length >= 2 && f.name === 'index.md') {
        // Subfolder convention: projects/{id}/index.md
        projectId = pathParts[0];
      } else if (pathParts.length === 1) {
        // Flat convention: projects/{id}.md
        projectId = f.basename;
      } else {
        continue; // Skip other nested files that aren't index.md
      }
      
      if (seenProjectIds.has(projectId)) continue;
      seenProjectIds.add(projectId);
      
      projects.push({
        id: projectId,
        name: fm.name || projectId,
        description: fm.description || '',
        createdAt: fm.createdAt || new Date(f.stat.ctime).toISOString(),
        status: fm.status || 'active',
      });
    }
    projects.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    projectsStore.set(projects);

    const taskFiles = this.app.vault.getMarkdownFiles().filter(f => f.path.startsWith(this.plugin.settings.tasksFolder + '/'));
    for (const f of taskFiles) {
      const c = await this.app.vault.read(f);
      const fm = parseFrontmatter(c);
      const body = c.replace(/^---\r?\n[\s\S]*?\r?\n---/, '').trim();
      let deadline = null;
      if (fm.deadline) {
        const d = new Date(fm.deadline);
        if (!isNaN(d.getTime())) deadline = d.toISOString();
      }
      let startDate = null;
      if (fm.startDate) {
        const d = new Date(fm.startDate);
        if (!isNaN(d.getTime())) startDate = d.toISOString();
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
        startDate: startDate,
        deadline: deadline,
        ganttRow: fm.ganttRow || 0,
        properties: await (async () => {
          const props: Record<string, any> = {};
          if (this.plugin && this.plugin.settings && this.plugin.settings.taskSchema) {
            // First pass: basic properties and rollups
            for (const schema of this.plugin.settings.taskSchema) {
              if (schema.type === 'rollup' && schema.relationProperty && schema.targetProperty && schema.aggregation) {
                let relationVal = fm[schema.relationProperty];
                if (!relationVal) {
                  props[schema.id] = 0;
                  continue;
                }
                const links = Array.isArray(relationVal) ? relationVal : [relationVal];
                const vals: any[] = [];
                for (const link of links) {
                  const match = String(link).match(/\[\[(.*?)\]\]/);
                  if (match) {
                    const targetName = match[1];
                    const targetFile = this.app.metadataCache.getFirstLinkpathDest(targetName, f.path);
                    if (targetFile) {
                      const tc = await this.app.vault.read(targetFile);
                      const tfm = parseFrontmatter(tc);
                      // Convert property name to ID since target files might be storing it by ID if they are also tasks
                      // But wait, the user specifies the ID in `targetProperty`? Let's check both ID and Name to be safe.
                      let tVal = tfm[schema.targetProperty];
                      if (tVal === undefined) {
                        const ts = this.plugin.settings.taskSchema.find(x => x.name === schema.targetProperty);
                        if (ts && tfm[ts.id] !== undefined) tVal = tfm[ts.id];
                      }
                      if (tVal !== undefined) vals.push(tVal);
                    }
                  }
                }
                
                const nums = vals.map(v => Number(v)).filter(n => !isNaN(n));
                if (schema.aggregation === 'sum') props[schema.id] = nums.reduce((a, b) => a + b, 0);
                else if (schema.aggregation === 'average') props[schema.id] = nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
                else if (schema.aggregation === 'count') props[schema.id] = vals.length;
                else if (schema.aggregation === 'unique') props[schema.id] = [...new Set(vals)].length;
                else if (schema.aggregation === 'min') props[schema.id] = nums.length ? Math.min(...nums) : 0;
                else if (schema.aggregation === 'max') props[schema.id] = nums.length ? Math.max(...nums) : 0;
              } else if (schema.type === 'formula') {
                // Skip formulas for now
              } else if (fm[schema.id] !== undefined) {
                props[schema.id] = fm[schema.id];
              } else if (schema.type === 'multi-select' || schema.type === 'relation') {
                props[schema.id] = [];
              }
            }
            
            // Second pass: formulas (can reference rollups and basic props)
            for (const schema of this.plugin.settings.taskSchema) {
               if (schema.type === 'formula' && schema.expression) {
                  try {
                    const scope: Record<string, any> = {
                      prop: (name: string) => {
                        const s = this.plugin.settings.taskSchema.find(x => x.name === name || x.id === name);
                        return s ? props[s.id] : undefined;
                      }
                    };
                    // Also spread properties directly for backwards compatibility
                    for (const s of this.plugin.settings.taskSchema) {
                      if (s.name && props[s.id] !== undefined) {
                        scope[s.name] = props[s.id];
                      }
                    }
                    props[schema.id] = Parser.evaluate(schema.expression || '', scope);
                  } catch (e) {
                     props[schema.id] = 'Error';
                  }
               }
            }
          }
          return props;
        })()
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
    const file = this.app.vault.getAbstractFileByPath(`${this.plugin.settings.tasksFolder}/${id}.md`);
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
    
    // Spread dynamic properties to top level of frontmatter
    if (fmUpdates.properties) {
      Object.assign(fm, fmUpdates.properties);
      delete fmUpdates.properties;
    }
    
    Object.assign(fm, fmUpdates);
    for (const k in fm) if (fm[k] === undefined) delete fm[k];
    
    await this.app.vault.modify(file, serializeFrontmatter(fm) + '\n' + newBody);
  }

  async createTask(data: Partial<TaskData>): Promise<string> {
    const id = `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const initialStatus = data.status || 'backlog';
    const fm: Record<string, any> = {
      name: data.name,
      project: data.project || null,
      status: initialStatus,
      weight: data.weight || 1,
      orderIndex: data.orderIndex || 0,
      isFixedDuration: data.isFixedDuration || false,
      fixedDuration: data.isFixedDuration ? data.fixedDuration : null,
      isCompleted: false,
      createdAt: new Date().toISOString()
    };
    if (data.properties) {
      Object.assign(fm, data.properties);
    }
    if (data.deadline) fm.deadline = data.deadline;
    if (data.startDate) fm.startDate = data.startDate;
    
    const c = serializeFrontmatter(fm) + '\n' + (data.description || '');
    await this.app.vault.create(`${this.plugin.settings.tasksFolder}/${id}.md`, c);
    
    // Update store
    tasksStore.update(t => [...t, {
      ...data,
      id,
      project: fm.project,
      status: initialStatus,
      weight: fm.weight,
      orderIndex: fm.orderIndex,
      isFixedDuration: fm.isFixedDuration,
      fixedDuration: fm.fixedDuration,
      maxDuration: fm.maxDuration || null,
      isCompleted: false,
      createdAt: fm.createdAt,
      properties: data.properties || {},
      startDate: fm.startDate || null,
      deadline: fm.deadline || null,
      description: data.description || '',
      name: fm.name,
      ganttRow: data.ganttRow || 0
    } as TaskData]);
    
    return id;
  }
  
  async deleteTask(id: string) {
    tasksStore.update(tasks => tasks.filter(t => t.id !== id));
    const file = this.app.vault.getAbstractFileByPath(`${this.plugin.settings.tasksFolder}/${id}.md`);
    if (file instanceof TFile) await this.app.vault.delete(file);
  }

  async getProjectContent(id: string): Promise<string> {
    const notePath = this.resolveProjectNotePath(id);
    if (!notePath) return '';
    const file = this.app.vault.getAbstractFileByPath(notePath);
    if (!(file instanceof TFile)) return '';
    const c = await this.app.vault.read(file);
    return c.replace(/^---\r?\n[\s\S]*?\r?\n---/, '').trim();
  }

  async saveProjectContent(id: string, newBody: string): Promise<void> {
    const notePath = this.resolveProjectNotePath(id);
    if (!notePath) return;
    const file = this.app.vault.getAbstractFileByPath(notePath);
    if (!(file instanceof TFile)) return;
    const c = await this.app.vault.read(file);
    const fm = parseFrontmatter(c);
    const serialized = serializeFrontmatter(fm) + '\n' + newBody;
    await this.app.vault.modify(file, serialized);
  }

  async unarchiveProject(id: string): Promise<void> {
    const notePath = this.resolveProjectNotePath(id);
    if (!notePath) return;
    const file = this.app.vault.getAbstractFileByPath(notePath);
    if (!(file instanceof TFile)) return;
    const c = await this.app.vault.read(file);
    const fm = parseFrontmatter(c);
    fm.status = 'active';
    
    // Extract body
    let newBody = '';
    const bodyMatch = c.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (bodyMatch) {
      newBody = bodyMatch[2];
    } else {
      newBody = c;
    }
    
    const newFileContent = serializeFrontmatter(fm) + '\n' + newBody;
      await this.app.vault.modify(file, newFileContent);
      await this.loadAll();
  }

  async archiveProject(id: string): Promise<void> {
    const notePath = this.resolveProjectNotePath(id);
    if (!notePath) return;
    const file = this.app.vault.getAbstractFileByPath(notePath);
    if (!(file instanceof TFile)) return;
    const c = await this.app.vault.read(file);
    const fm = parseFrontmatter(c);
    fm.status = 'archived';
    
    // Extract body
    let newBody = '';
    const bodyMatch = c.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (bodyMatch) {
      newBody = bodyMatch[2];
    } else {
      newBody = c;
    }
    
    const serialized = serializeFrontmatter(fm) + '\n' + newBody;
    await this.app.vault.modify(file, serialized);
    await this.loadAll();
  }

  /**
   * Get all files associated with a project in its subfolder.
   * Returns files from projects/{id}/ directory (excluding index.md frontmatter).
   */
  getProjectFiles(id: string): ProjectFileInfo[] {
    const folderPath = this.getProjectFolderPath(id);
    const folder = this.app.vault.getAbstractFileByPath(folderPath);
    
    if (!(folder instanceof TFolder)) {
      // Flat project — only has the single .md file
      const flatPath = `${this.plugin.settings.projectsFolder}/${id}.md`;
      const flatFile = this.app.vault.getAbstractFileByPath(flatPath);
      if (flatFile instanceof TFile) {
        return [{
          path: flatFile.path,
          name: flatFile.name,
          extension: flatFile.extension,
          size: flatFile.stat.size,
          mtime: flatFile.stat.mtime,
        }];
      }
      return [];
    }
    
    const files: ProjectFileInfo[] = [];
    const collectFiles = (parent: TFolder) => {
      for (const child of parent.children) {
        if (child instanceof TFile) {
          files.push({
            path: child.path,
            name: child.name,
            extension: child.extension,
            size: child.stat.size,
            mtime: child.stat.mtime,
          });
        } else if (child instanceof TFolder) {
          collectFiles(child);
        }
      }
    };
    collectFiles(folder);
    
    // Sort: index.md first, then alphabetically
    files.sort((a, b) => {
      if (a.name === 'index.md') return -1;
      if (b.name === 'index.md') return 1;
      return a.name.localeCompare(b.name);
    });
    
    return files;
  }

  /**
   * Create a new file inside the project's subfolder.
   * Ensures the subfolder exists first.
   */
  async createProjectFile(projectId: string, filename: string, content: string): Promise<TFile> {
    const folderPath = this.getProjectFolderPath(projectId);
    await this.ensureFolder(folderPath);
    
    const filePath = `${folderPath}/${filename}`;
    const existing = this.app.vault.getAbstractFileByPath(filePath);
    if (existing instanceof TFile) return existing;
    
    const file = await this.app.vault.create(filePath, content);
    return file;
  }

  /**
   * Get the TFile for the project's main note (index.md or flat .md).
   */
  getProjectNoteFile(id: string): TFile | null {
    const notePath = this.resolveProjectNotePath(id);
    if (!notePath) return null;
    const file = this.app.vault.getAbstractFileByPath(notePath);
    return file instanceof TFile ? file : null;
  }
}

