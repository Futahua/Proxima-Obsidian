const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

// Replace the task finalize logic to delay resetting the drag flag and mutate locally
content = content.replace(
  /async function handleTaskFinalize\(colId, e\) \{[\s\S]*?await Promise\.all\(promises\);\s*\}/,
  `let dragTaskTimeout;
  async function handleTaskFinalize(colId, e) {
    const colIndex = boardColumns.findIndex(c => c.id === colId);
    boardColumns[colIndex].items = e.detail.items;
    boardColumns = [...boardColumns];
    
    const promises = [];
    boardColumns[colIndex].items.forEach((t, idx) => {
      if (t.status !== colId || t.orderIndex !== idx) {
        t.status = colId;
        t.orderIndex = idx;
        promises.push(fileManager.updateTask(t.id, { status: colId, orderIndex: idx }));
      }
    });
    
    clearTimeout(dragTaskTimeout);
    dragTaskTimeout = setTimeout(() => {
      isDraggingTasks = false;
    }, 500);
    
    await Promise.all(promises);
  }`
);

fs.writeFileSync(file, content);
console.log('Patched handleTaskFinalize to prevent race condition snap-back');
