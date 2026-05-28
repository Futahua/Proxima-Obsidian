const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const maxOrder = colTasks\.length > 0 \? Math\.max\(\.\.\.colTasks\.map\(t => t\.orderIndex\)\) \+ 1 : 0;/,
  "const maxOrder = colTasks.length > 0 ? Math.max(...colTasks.map(t => Number(t.orderIndex) || 0)) + 1 : 0;"
);

fs.writeFileSync(file, content);
console.log('Fixed Math.max NaN poison generation');
