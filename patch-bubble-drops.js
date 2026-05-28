const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

// Fix task drag over stopping propagation of board dragging
content = content.replace(
  /function handleDragOver\(e: DragEvent, status: string\) \{\s*e\.stopPropagation\(\);\s*if \(\!dragId \|\| dragColId\) return;/,
  `function handleDragOver(e: DragEvent, status: string) {
      if (dragColId) return; // Let it bubble to column handler
      e.stopPropagation();
      if (!dragId) return;`
);

content = content.replace(
  /async function handleDrop\(e: DragEvent, status: string\) \{\s*e\.stopPropagation\(\);\s*console\.log\('Dropped on status:', status\);\s*e\.preventDefault\(\);\s*if \(\!dragId\) return;/,
  `async function handleDrop(e: DragEvent, status: string) {
      if (dragColId) return; // Let it bubble to column handler
      e.stopPropagation();
      console.log('Dropped on status:', status);
      e.preventDefault();
      if (!dragId) return;`
);

fs.writeFileSync(file, content);
console.log('Patched bubbling block for board drags');
