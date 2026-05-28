const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /await fileManager\.createTask\(\{ name, project: pid, status: statusId \}\);/,
  "const colTasks = projectTasks.filter(t => t.status === statusId);\n        const maxOrder = colTasks.length > 0 ? Math.max(...colTasks.map(t => t.orderIndex)) + 1 : 0;\n        await fileManager.createTask({ name, project: pid, status: statusId, orderIndex: maxOrder });"
);

fs.writeFileSync(file, content);
console.log('Fixed Add Task orderIndex');
