const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

// Fix column generator to force core columns into ps so they aren't ghosts
content = content.replace(
  /const hasBacklog = ps\.find[\s\S]*?return cols;\s*\n\s*\}\)\(\);/,
  `// Force all columns into a single unified array mapped from ps and defaults
    const activeStatuses = new Set(projectTasks.map(t => t.status));
    
    const finalCols = [];
    
    // 1. Gather all known columns
    const knownIds = new Set();
    
    // Add ps items exactly in order
    ps.forEach(s => {
      finalCols.push({ ...s, name: s.name || s.id, color: s.color || '#a29bfe', isCore: s.id === 'backlog' || s.id === 'running' || s.id === 'review' });
      knownIds.add(s.id);
    });
    
    // 2. If core items are missing, place them where they belong
    if (!knownIds.has('backlog')) {
      finalCols.unshift({ id: 'backlog', name: g['backlog']?.name || 'Elastic Backlog', color: g['backlog']?.color || '#636e72', isCore: true });
    }
    if (!knownIds.has('running')) {
      finalCols.push({ id: 'running', name: g['running']?.name || 'Elastic Running', color: g['running']?.color || '#00b894', isCore: true });
    }
    if (!knownIds.has('review')) {
      finalCols.push({ id: 'review', name: g['review']?.name || 'Finished', color: g['review']?.color || '#fdcb6e', isCore: true });
    }
    
    // 3. Any active statuses not tracked anywhere get appended
    activeStatuses.forEach(statusId => {
      if (!finalCols.find(c => c.id === statusId)) {
        finalCols.push({ id: statusId, name: statusId, color: '#a29bfe', isCore: false });
      }
    });
    
    return finalCols;
  })();`
);

fs.writeFileSync(file, content);
console.log('Patched board ghost columns');
