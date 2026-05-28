const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

// Fix column ordering issue where custom columns were trapped
content = content.replace(
  /const cols = \[\];[\s\S]*?return cols;\s*\n\s*\}\)\(\);/,
  `const cols = [];
    
    // Core columns first, if they don't exist in ps, add them in default order
    const hasBacklog = ps.find(s => s.id === 'backlog');
    if (!hasBacklog) cols.push({ id: 'backlog', name: g['backlog']?.name || 'Elastic Backlog', color: g['backlog']?.color || '#636e72', isCore: true });

    ps.forEach(s => {
      cols.push({ ...s, name: s.name || s.id, color: s.color || '#a29bfe', isCore: s.id === 'backlog' || s.id === 'running' || s.id === 'review' });
    });

    if (!cols.find(c => c.id === 'running')) cols.push({ id: 'running', name: g['running']?.name || 'Elastic Running', color: g['running']?.color || '#00b894', isCore: true });
    if (!cols.find(c => c.id === 'review')) cols.push({ id: 'review', name: g['review']?.name || 'Finished', color: g['review']?.color || '#fdcb6e', isCore: true });

    const activeStatuses = new Set(projectTasks.map(t => t.status));
    activeStatuses.forEach(statusId => {
      if (!cols.find(c => c.id === statusId)) {
        cols.push({ id: statusId, name: statusId, color: '#a29bfe', isCore: false });
      }
    });
    return cols;
  })();`
);

// Fix drag target issue where padding rejects drops
content = content.replace(
  /<div class="pos-board-column-content">/,
  `<div class="pos-board-column-content" on:dragover|preventDefault={(e) => handleDragOver(e, col.id)} on:drop|preventDefault={(e) => handleDrop(e, col.id)} on:dragleave={(e) => handleDragLeave(e, col.id)}>`
);

fs.writeFileSync(file, content);
console.log('Patched board drag drops');
