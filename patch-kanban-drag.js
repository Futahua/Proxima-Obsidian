const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix Statuses Initialization to respect saved order, and only inject if missing
const statusInitOld = `  $: statuses = (() => {
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

const statusInitNew = `  $: statuses = (() => {
    const cols = [];
    settingsStatuses.forEach(s => cols.push(s));
    
    if (!cols.find(c => c.id === 'backlog')) cols.unshift({ id: 'backlog', name: 'Elastic Backlog', color: '#636e72' });
    if (!cols.find(c => c.id === 'running')) cols.push({ id: 'running', name: 'Elastic Running', color: '#00b894' });
    if (!cols.find(c => c.id === 'review')) cols.push({ id: 'review', name: 'Finished', color: '#fdcb6e' });
    
    const activeStatuses = new Set(projectTasks.map(t => t.status));
    activeStatuses.forEach(statusId => {
      if (!cols.find(c => c.id === statusId)) {
        cols.push({ id: statusId, name: statusId, color: '#a29bfe' });
      }
    });
    return cols;
  })();`;
content = content.replace(statusInitOld, statusInitNew);

// 2. Fix Drag Preview Math by matching against dataset col id
const dragMathOld = `        for (let i = 0; i < cols.length; i++) {
          const rect = cols[i].getBoundingClientRect();
          const middle = rect.left + rect.width / 2;
          if (mouseX < middle) {
            targetIndex = i;
            break;
          }
        }
        
        dragOverColId = 'workspace';
        dragOverColIndex = targetIndex;`;

const dragMathNew = `        let targetId = null;
        for (let i = 0; i < cols.length; i++) {
          const rect = cols[i].getBoundingClientRect();
          const middle = rect.left + rect.width / 2;
          if (mouseX < middle) {
            targetId = cols[i].dataset.colId;
            break;
          }
        }
        
        let actualIndex = columns.length;
        if (targetId) {
          actualIndex = columns.findIndex(c => c.id === targetId);
        }
        
        dragOverColId = 'workspace';
        dragOverColIndex = actualIndex;`;
content = content.replace(dragMathOld, dragMathNew);

// 3. Add dataset attribute to columns
const colDivOld = `<div class="pos-board-col" class:pos-dragging-source={dragColId === col.id} class:pos-col-elastic={['backlog', 'running', 'review'].includes(col.id)}>`;
const colDivNew = `<div class="pos-board-col" data-col-id={col.id} class:pos-dragging-source={dragColId === col.id} class:pos-col-elastic={['backlog', 'running', 'review'].includes(col.id)}>`;
content = content.replace(colDivOld, colDivNew);

fs.writeFileSync(file, content);
console.log('Patched ProjectTaskBoard statuses lock and drag index math');
