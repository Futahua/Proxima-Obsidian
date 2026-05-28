export type TaskStatus = string;
export type ProjectStatus = 'active' | 'archived';

export type PropertyType = 'text' | 'number' | 'select' | 'multi-select' | 'date' | 'checkbox' | 'relation' | 'rollup' | 'formula';

export interface SelectOption {
  id: string;
  name: string;
  color: string;
}

export interface PropertySchema {
  id: string;
  name: string;
  type: PropertyType;
  options?: SelectOption[]; // Used for select and multi-select
  targetFolder?: string; // Used for relation
  relationProperty?: string; // Used for rollup
  targetProperty?: string; // Used for rollup
  aggregation?: 'sum' | 'average' | 'count' | 'unique' | 'min' | 'max'; // Used for rollup
  expression?: string; // Used for formula
}

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
  startDate: string | null;
  deadline: string | null;
  ganttRow?: number;
  properties: Record<string, any>; // Dynamic Notion-style properties
}

export interface TimelineItem {
  id: string;
  startTime: string;
  endTime: string;
  calculatedDuration: number;
}

export interface ColorRule {
  id: string;
  targetDate: 'deadline' | 'createdAt';
  condition: 'is relative to today';
  value: 'overdue' | 'today' | 'next 2 days' | 'next 3 days' | 'next week' | 'next month';
  color: string;
}

export interface FilterRule {
  id: string;
  property: string;
  operator: 'is' | 'is-not' | 'contains' | 'not-contains' | 'gt' | 'lt' | 'is-empty' | 'not-empty';
  value: any;
}
