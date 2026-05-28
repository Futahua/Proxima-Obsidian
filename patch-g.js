const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const cols = \[\];/,
  "const g = fileManager.plugin.settings.globalStatuses || {};\n    const cols = [];"
);

fs.writeFileSync(file, content);
console.log('Fixed ReferenceError g is not defined');
