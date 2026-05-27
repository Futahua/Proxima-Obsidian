export type TaskStatus = 'planned' | 'backlog' | 'running' | 'review';
export type ProjectStatus = 'active' | 'archived';

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  status: ProjectStatus;
}

export interface TaskData {
  id: string;
  name: string;
  description: string;
  project: string | null;
  status: TaskStatus;
  weight: number;
  orderIndex: number;
  isFixedDuration: boolean;
  fixedDuration: number | null;
  maxDuration: number | null;
  isCompleted: boolean;
  createdAt: string;
  deadline: string | null;
}

export interface TimelineItem {
  id: string;
  startTime: string;
  endTime: string;
  calculatedDuration: number;
}
