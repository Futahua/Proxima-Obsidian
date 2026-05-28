const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/ProjectsView.svelte';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /\.sort\(\(a, b\) => a\.orderIndex - b\.orderIndex\)/g,
  ".sort((a, b) => (Number(a.orderIndex) || 0) - (Number(b.orderIndex) || 0))"
);

fs.writeFileSync(file, content);
console.log('Fixed NaN sort in ProjectsView');
