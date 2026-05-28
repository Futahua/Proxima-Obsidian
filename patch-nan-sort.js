const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

// Absolutely bulletproof sort against NaN!
content = content.replace(
  /const sortTasks = \(tasks: TaskData\[\]\) => tasks\.sort\(\(a, b\) => \(a\.orderIndex \|\| 0\) - \(b\.orderIndex \|\| 0\)\);/,
  "const sortTasks = (tasks: TaskData[]) => tasks.sort((a, b) => { const aVal = Number(a.orderIndex) || 0; const bVal = Number(b.orderIndex) || 0; return aVal - bVal; });"
);

fs.writeFileSync(file, content);
console.log('Bulletproofed sortTasks against NaN infinite loops');
