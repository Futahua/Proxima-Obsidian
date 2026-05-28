const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

// Fix sortTasks to only use orderIndex, allowing manual Kanban ordering to work!
content = content.replace(
  /const sortTasks = \(tasks: TaskData\[\]\) => tasks\.sort\(\(a, b\) => \{[\s\S]*?return \(pA - pB\) \|\| \(a\.orderIndex - b\.orderIndex\);\s*\}\);/,
  "const sortTasks = (tasks: TaskData[]) => tasks.sort((a, b) => a.orderIndex - b.orderIndex);"
);

fs.writeFileSync(file, content);
console.log('Fixed sortTasks logic');
