const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

const statusInitOld = `  $: statuses = (() => {
    const cols = [ { id: 'backlog', name: 'Elastic Backlog', color: '#636e72' } ];
    settingsStatuses.forEach(s => {
      if (!cols.find(c => c.id === s.id)) cols.push(s);
    });
    const activeStatuses = new Set(projectTasks.map(t => t.status));
    activeStatuses.forEach(statusId => {
      if (!cols.find(c => c.id === statusId)) {
        if (statusId === 'running') cols.push({ id: 'running', name: 'Elastic Running', color: '#00b894' });
        else if (statusId === 'review') cols.push({ id: 'review', name: 'Elastic Review', color: '#fdcb6e' });
        else cols.push({ id: statusId, name: statusId, color: '#a29bfe' });
      }
    });
    return cols;
  })();`;

const statusInitNew = `  $: statuses = (() => {
    const cols = [ 
      { id: 'backlog', name: 'Elastic Backlog', color: '#636e72' },
      { id: 'running', name: 'Elastic Running', color: '#00b894' },
      { id: 'review', name: 'Finished', color: '#fdcb6e' }
    ];
    settingsStatuses.forEach(s => {
      if (!cols.find(c => c.id === s.id)) cols.push(s);
    });
    const activeStatuses = new Set(projectTasks.map(t => t.status));
    activeStatuses.forEach(statusId => {
      if (!cols.find(c => c.id === statusId)) {
        cols.push({ id: statusId, name: statusId, color: '#a29bfe' });
      }
    });
    return cols;
  })();`;
content = content.replace(statusInitOld, statusInitNew);

const wsOld = `<div class="pos-board-workspace">
  {#each columns as col, colIdx (col.id)}`;
const wsNew = `<div class="pos-board-workspace"
    on:dragover={(e) => {
      // If we are dragging a column, allow drop on the workspace itself
      if (dragColId) {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
        
        // Find which index we are hovering over
        const cols = Array.from((e.currentTarget).children).filter(c => c.classList.contains('pos-board-col') && !c.classList.contains('pos-dragging-source'));
        const mouseX = e.clientX;
        let targetIndex = cols.length;
        
        for (let i = 0; i < cols.length; i++) {
          const rect = cols[i].getBoundingClientRect();
          const middle = rect.left + rect.width / 2;
          if (mouseX < middle) {
            targetIndex = i;
            break;
          }
        }
        
        dragOverColId = 'workspace';
        dragOverColIndex = targetIndex;
      }
    }}
    on:drop={async (e) => {
      if (dragColId) {
        e.preventDefault();
        const settings = fileManager.plugin.settings;
        if (!settings.statuses) settings.statuses = [];
        
        const fromIndex = settings.statuses.findIndex(s => s.id === dragColId);
        if (fromIndex !== -1) {
          const [movedItem] = settings.statuses.splice(fromIndex, 1);
          let insertIndex = dragOverColIndex;
          
          if (insertIndex < columns.length) {
             const targetColId = columns[insertIndex].id;
             let toIndex = settings.statuses.findIndex(s => s.id === targetColId);
             if (toIndex !== -1) {
               settings.statuses.splice(toIndex, 0, movedItem);
             } else {
               settings.statuses.push(movedItem);
             }
          } else {
             settings.statuses.push(movedItem);
          }
          
          await fileManager.plugin.saveSettings();
          fileManager.plugin.settings = settings; // trigger reactivity
        }
        dragColId = null;
        dragOverColId = null;
        dragOverColIndex = -1;
      }
    }}
>
  {#each columns as col, colIdx (col.id)}`;
content = content.replace(wsOld, wsNew);

fs.writeFileSync(file, content);
console.log('Patched ProjectTaskBoard statuses and workspace drag');
