const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

// Completely remove any mutation or mapping of e.detail.items to prevent svelte-dnd-action crashes
content = content.replace(
  /boardColumns\[colIndex\]\.items = boardColumns\[colIndex\]\.items\.map\(\(t, idx\) => \{[\s\S]*?return t;\s*\}\);/,
  `e.detail.items.forEach((t, idx) => {
      if (t.status !== colId || t.orderIndex !== idx) {
        promises.push(fileManager.updateTask(t.id, { status: colId, orderIndex: idx }));
      }
    });`
);

fs.writeFileSync(file, content);
console.log('Removed array mutation in finalize');
