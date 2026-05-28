const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const sortTasks = \(tasks: TaskData\[\]\) => tasks\.sort\(\(a, b\) => a\.orderIndex - b\.orderIndex\);/,
  "const sortTasks = (tasks: TaskData[]) => tasks.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));"
);

fs.writeFileSync(file, content);
console.log('Patched sortTasks to avoid NaN');
