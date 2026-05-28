const fs = require('fs');
const file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

// Insert the new drag and color functions inside the script tag
const insertLogic = `
  // --- COLUMN DRAG AND DROP & COLOR ---
  let dragColId: string | null = null;
  let dragOverColId: string | null = null;

  function handleColDragStart(e: DragEvent, id: string) {
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('col-id', id);
    }
    setTimeout(() => { dragColId = id; }, 0);
  }

  function handleColDragEnd() {
    dragColId = null;
    dragOverColId = null;
  }

  function handleColDragOver(e: DragEvent, id: string) {
    e.preventDefault();
    if (dragColId && dragColId !== id) {
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
      dragOverColId = id;
    }
  }

  async function handleColDrop(e: DragEvent, id: string) {
    e.preventDefault();
    if (!dragColId || dragColId === id) return;
    
    const settings = fileManager.plugin.settings;
    if (!settings.statuses) settings.statuses = [];
    
    // Inject if missing (for generic fallback columns)
    const sourceColObj = columns.find(c => c.id === dragColId);
    const destColObj = columns.find(c => c.id === id);
    if (!settings.statuses.find(s => s.id === dragColId)) {
       settings.statuses.push({ id: dragColId, name: sourceColObj?.name || dragColId, color: sourceColObj?.color || '#a29bfe' });
    }
    if (!settings.statuses.find(s => s.id === id)) {
       settings.statuses.push({ id: id, name: destColObj?.name || id, color: destColObj?.color || '#a29bfe' });
    }

    const fromIndex = settings.statuses.findIndex(s => s.id === dragColId);
    let toIndex = settings.statuses.findIndex(s => s.id === id);
    
    const [movedItem] = settings.statuses.splice(fromIndex, 1);
    toIndex = settings.statuses.findIndex(s => s.id === id); // recalculate
    settings.statuses.splice(toIndex, 0, movedItem);
    
    await fileManager.plugin.saveSettings();
    fileManager.plugin.settings = settings; // trigger reactivity
    
    dragColId = null;
    dragOverColId = null;
  }
  
  async function updateColumnColor(colId: string, newColor: string) {
    const settings = fileManager.plugin.settings;
    let col = settings.statuses.find(s => s.id === colId);
    if (!col) {
       const colObj = columns.find(c => c.id === colId);
       col = { id: colId, name: colObj?.name || colId, color: newColor };
       settings.statuses.push(col);
    } else {
       col.color = newColor;
    }
    await fileManager.plugin.saveSettings();
    fileManager.plugin.settings = settings; // trigger reactivity
  }
`;

content = content.replace('// Drag and drop states', insertLogic + '\n  // Drag and drop states');

// Modify the column header HTML
const targetHTML = `<h4 class="pos-board-col-title" style="color: {col.color}; border-bottom: 2px solid {col.color}40;">
      {col.name} ({col.tasks.length})
    </h4>`;

const replaceHTML = `<h4 class="pos-board-col-title" 
        style="color: {col.color}; border-bottom: 2px solid {col.color}40; display: flex; align-items: center; justify-content: space-between;"
        draggable="true"
        on:dragstart={(e) => handleColDragStart(e, col.id)}
        on:dragend={handleColDragEnd}
        on:dragover={(e) => handleColDragOver(e, col.id)}
        on:drop={(e) => handleColDrop(e, col.id)}
    >
      <span style="cursor: grab;">{col.name} ({col.tasks.length})</span>
      <input type="color" value={col.color} style="width: 20px; height: 20px; padding: 0; border: none; cursor: pointer; background: none;" on:change={(e) => updateColumnColor(col.id, e.currentTarget.value)} title="Change column color" />
    </h4>`;

content = content.replace(targetHTML, replaceHTML);

// Modify the column wrapper to add the drag-over class
const colTarget = `<div class="pos-board-col">`;
const colReplace = `<div class="pos-board-col" class:pos-dragging-source={dragColId === col.id} class:pos-drag-over={dragOverColId === col.id}>`;
content = content.replace(colTarget, colReplace);

// We need to fix the statuses logic because we no longer want it to ALWAYS lock Elastic Backlog to the very first position.
// We want to just use settingsStatuses, but inject them if they don't exist in settings.
const oldStatusesTarget = `$: settingsStatuses = fileManager.plugin.settings.statuses || [];
  $: statuses = (() => {
    const cols = [ { id: 'backlog', name: 'Elastic Backlog', color: '#636e72' } ];
    settingsStatuses.forEach(s => {
      if (!cols.find(c => c.id === s.id)) cols.push(s);
    });
    const activeStatuses = new Set(projectTasks.map(t => t.status));
    activeStatuses.forEach(statusId => {
      if (!cols.find(c => c.id === statusId)) {
        if (statusId === 'running') cols.push({ id: 'running', name: 'Elastic Running', color: '#00b894' });
        else if (statusId === 'review') cols.push({ id: 'review', name: 'Finished', color: '#fdcb6e' });
        else cols.push({ id: statusId, name: statusId, color: '#a29bfe' });
      }
    });
    return cols;
  })();`;

const newStatusesReplace = `$: settingsStatuses = fileManager.plugin.settings.statuses || [];
  $: statuses = (() => {
    // Just use settings directly to respect order
    const cols = [...settingsStatuses];
    
    // Inject any orphaned active tasks at the end
    const activeStatuses = new Set(projectTasks.map(t => t.status));
    activeStatuses.forEach(statusId => {
      if (!cols.find(c => c.id === statusId)) {
        if (statusId === 'running') cols.push({ id: 'running', name: 'Elastic Running', color: '#00b894' });
        else if (statusId === 'review') cols.push({ id: 'review', name: 'Finished', color: '#fdcb6e' });
        else if (statusId === 'backlog') cols.push({ id: 'backlog', name: 'Elastic Backlog', color: '#636e72' });
        else cols.push({ id: statusId, name: statusId, color: '#a29bfe' });
      }
    });
    return cols;
  })();`;

content = content.replace(oldStatusesTarget, newStatusesReplace);

fs.writeFileSync(file, content);
console.log('ProjectTaskBoard patched');
