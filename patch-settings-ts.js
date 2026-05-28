const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/settings.ts';
let content = fs.readFileSync(file, 'utf8');

const intOld = `export interface ProximaSettings {
  nearDeadlineDays: number;
  urgentDeadlineDays: number;
  projectsFolder: string;
  tasksFolder: string;
  statuses: SelectOption[];
  colorRules: ColorRule[];
  taskSchema: PropertySchema[];
  projectFilters: Record<string, FilterRule[]>;
}`;

const intNew = `export interface ProximaSettings {
  nearDeadlineDays: number;
  urgentDeadlineDays: number;
  projectsFolder: string;
  tasksFolder: string;
  statuses: SelectOption[];
  colorRules: ColorRule[];
  taskSchema?: PropertySchema[]; // DEPRECATED
  projectSchemas: Record<string, PropertySchema[]>;
  projectVisibleProps: Record<string, string[]>;
  projectFilters: Record<string, FilterRule[]>;
}`;
content = content.replace(intOld, intNew);

const defOld = `  projectFilters: {},
  taskSchema: [`;
const defNew = `  projectFilters: {},
  projectSchemas: {},
  projectVisibleProps: {},
  taskSchema: [`;
content = content.replace(defOld, defNew);

fs.writeFileSync(file, content);
console.log('Patched ProximaSettings interfaces');
