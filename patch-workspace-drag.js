const fs = require('fs');
const file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

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
          // If we are dropping at targetIndex, it means we insert at that visual position.
          let insertIndex = dragOverColIndex;
          
          // However, dragOverColIndex is relative to visible DOM columns. 
          // If settings.statuses is exactly 1:1 with columns, we can just insert there.
          // Let's find the ID of the column at targetIndex
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

const oldDrop = `  async function handleColDrop(e: DragEvent, id: string) {
    e.preventDefault();
    if (!dragColId || dragColId === id) return;
    const targetIdx = dragOverColIndex;
    
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
    const oldToIndex = settings.statuses.findIndex(s => s.id === id);
    const [movedItem] = settings.statuses.splice(fromIndex, 1);
    const newToIndex = settings.statuses.findIndex(s => s.id === id);
    const finalIndex = fromIndex < oldToIndex ? newToIndex + 1 : newToIndex;
    settings.statuses.splice(finalIndex, 0, movedItem);
    
    await fileManager.plugin.saveSettings();
    fileManager.plugin.settings = settings; // trigger reactivity
  }`;
content = content.replace(oldDrop, `  async function handleColDrop(e: DragEvent, id: string) {
    // handled by workspace drop event now
  }`);

const oldDragOver = `  function handleColDragOver(e: DragEvent, id: string) {
    e.preventDefault();
    if (dragColId && dragColId !== id) {
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
      
      const cols = Array.from((e.currentTarget as HTMLElement).parentNode?.children || []).filter(c => c.classList.contains('pos-board-col') && !c.classList.contains('pos-dragging-source'));
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
      
      dragOverColId = id;
      dragOverColIndex = targetIndex;
    }
  }`;
content = content.replace(oldDragOver, `  function handleColDragOver(e: DragEvent, id: string) {
    // handled by workspace dragover event now
  }`);

fs.writeFileSync(file, content);
console.log('Fixed workspace drag events');
