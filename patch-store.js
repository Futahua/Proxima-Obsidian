const fs = require('fs');

let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/data/FileManager.ts';
let content = fs.readFileSync(file, 'utf8');

// Fix Svelte store reference equality bug
content = content.replace(
  /tasksStore\.update\(tasks => \{[\s\S]*?return tasks;\s*\}\);/,
  "tasksStore.update(tasks => { const newTasks = [...tasks]; const i = newTasks.findIndex(t => t.id === id); if (i > -1) { newTasks[i] = { ...newTasks[i], ...updates }; } return newTasks; });"
);

fs.writeFileSync(file, content);
console.log('Fixed tasksStore reference equality bug');
