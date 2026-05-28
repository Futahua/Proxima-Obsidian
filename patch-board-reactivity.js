const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /fileManager\.plugin\.settings = settings;/g,
  "fileManager.plugin.settings = settings;\n    fileManager = fileManager; // Force Svelte Reactivity"
);

fs.writeFileSync(file, content);
console.log('Patched reactivity trigger in Board');
