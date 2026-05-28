const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /on:click=\{\(\) => createPlannedTask\(col\.id\)\}/g,
  "on:click|stopPropagation={() => createPlannedTask(col.id)}"
);

content = content.replace(
  /on:click=\{\(\) => editTask\(task\)\}/g,
  "on:click|stopPropagation={() => editTask(task)}"
);

fs.writeFileSync(file, content);
console.log('Added stopPropagation to clicks');
