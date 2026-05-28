const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

// Ensure board drops are caught anywhere in the column body
content = content.replace(
  /<div class="pos-board-col" data-col-id=\{col\.id\} class:pos-dragging-source=\{dragColId === col\.id\} class:pos-col-elastic=\{col\.isCore\}>/,
  `<div class="pos-board-col" data-col-id={col.id} class:pos-dragging-source={dragColId === col.id} class:pos-col-elastic={col.isCore} on:dragover={(e) => { if(dragColId) handleColDragOver(e, col.id); }} on:drop={(e) => { if(dragColId) handleColDrop(e, col.id); }}>`
);

fs.writeFileSync(file, content);
console.log('Patched board dropzones to cover the whole column');
