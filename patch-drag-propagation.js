const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

const events = [
  'handleColDragStart', 'handleColDragEnd', 'handleColDragOver', 'handleColDrop',
  'handleDragStart', 'handleDragEnd', 'handleDragOver', 'handleDrop'
];

for (const ev of events) {
  content = content.replace(
    new RegExp(`function ${ev}\\(e: DragEvent(.*?) {`, 'g'),
    `function ${ev}(e: DragEvent$1 {\n    e.stopPropagation();`
  );
}

fs.writeFileSync(file, content);
console.log('Added e.stopPropagation() to all drag events');
