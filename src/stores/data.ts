import { writable } from 'svelte/store';
import type { ProjectData, TaskData } from '../types';

export const projectsStore = writable<ProjectData[]>([]);
export const tasksStore = writable<TaskData[]>([]);

// Derived store pattern for specific project tasks
export function getProjectTasks(tasks: TaskData[], projectId: string | null): TaskData[] {
  if (projectId) return tasks.filter(t => t.project === projectId);
  return tasks.filter(t => !t.project); // Uncategorized
}
