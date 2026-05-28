const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

// Ensure immutable updates for svelte-dnd-action items to prevent the library from crashing and disappearing tasks
content = content.replace(
  /boardColumns\[colIndex\]\.items\.forEach\(\(t, idx\) => \{[\s\S]*?promises\.push\(fileManager\.updateTask\(t\.id, \{ status: colId, orderIndex: idx \}\)\);\s*\}\s*\}\);/,
  `boardColumns[colIndex].items = boardColumns[colIndex].items.map((t, idx) => {
      if (t.status !== colId || t.orderIndex !== idx) {
        promises.push(fileManager.updateTask(t.id, { status: colId, orderIndex: idx }));
        return { ...t, status: colId, orderIndex: idx };
      }
      return t;
    });`
);

fs.writeFileSync(file, content);
console.log('Patched handleTaskFinalize for immutability');
