const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /let ps = rawProjectStatuses;\n\s*if \(\!ps\) \{/,
  "let ps = rawProjectStatuses;\n    if (!ps || !Array.isArray(ps)) {\n"
);

fs.writeFileSync(file, content);
console.log('Fixed ps Array check');
