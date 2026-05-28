const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/ProjectsView.svelte';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /let projectTab: 'notes' \| 'board' \| 'grid' \| 'deadlines' = 'notes';/,
  "let projectTab: 'notes' | 'board' | 'grid' | 'deadlines' = 'notes';\n  let settingsVersion = 0;"
);

fs.writeFileSync(file, content);
console.log('Fixed missing variable');
