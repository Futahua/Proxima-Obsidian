const fs = require('fs');
const file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/stores/data.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /export function getProjectTasks\(tasks: TaskData\[\], projectId: string \| null\): TaskData\[\] \{\r?\n[\s\S]*?return tasks\.filter\(t => !t\.project\);\r?\n\}/,
  `export function getProjectTasks(tasks: TaskData[], projectId: string | null, projects: any[] = []): TaskData[] {
  const archivedIds = new Set(projects.filter(p => p.status === 'archived').map(p => p.id));
  if (projectId === 'all') return tasks.filter(t => !t.project || !archivedIds.has(t.project));
  if (projectId) return tasks.filter(t => t.project === projectId && !archivedIds.has(t.project));
  return tasks.filter(t => !t.project);
}`
);

fs.writeFileSync(file, content);
console.log('data.ts updated');
