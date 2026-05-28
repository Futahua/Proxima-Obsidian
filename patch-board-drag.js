const fs = require('fs');
const file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

// Fix 1: sortTasks priority logic
const sortOld = `const sortTasks = (tasks: TaskData[]) => tasks.sort((a, b) => (a.priority - b.priority) || (a.orderIndex - b.orderIndex));`;
const sortNew = `const sortTasks = (tasks: TaskData[]) => tasks.sort((a, b) => {
    const pA = (a.properties && a.properties['priority']) ? parseInt(a.properties['priority'], 10) : 3;
    const pB = (b.properties && b.properties['priority']) ? parseInt(b.properties['priority'], 10) : 3;
    return (pA - pB) || (a.orderIndex - b.orderIndex);
  });`;
content = content.replace(sortOld, sortNew);

// Fix 2: Prevent task drag over when dragging columns
const handleDragOverOld = `  function handleDragOver(e: DragEvent, status: string) {
    e.preventDefault();`;
const handleDragOverNew = `  function handleDragOver(e: DragEvent, status: string) {
    if (dragColId) return; // Prevent task preview when dragging columns
    e.preventDefault();`;
content = content.replace(handleDragOverOld, handleDragOverNew);

// Fix 3: Add dragOverColIndex and update handleColDragOver
const colDragStateOld = `  let dragColId: string | null = null;
  let dragOverColId: string | null = null;`;
const colDragStateNew = `  let dragColId: string | null = null;
  let dragOverColId: string | null = null;
  let dragOverColIndex: number = -1;`;
content = content.replace(colDragStateOld, colDragStateNew);

const colDragOverOld = `  function handleColDragOver(e: DragEvent, id: string) {
    e.preventDefault();
    if (dragColId && dragColId !== id) {
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
      dragOverColId = id;
    }
  }`;
const colDragOverNew = `  function handleColDragOver(e: DragEvent, id: string) {
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
content = content.replace(colDragOverOld, colDragOverNew);

const colDropOld = `  async function handleColDrop(e: DragEvent, id: string) {
    e.preventDefault();
    if (!dragColId || dragColId === id) return;`;
const colDropNew = `  async function handleColDrop(e: DragEvent, id: string) {
    e.preventDefault();
    if (!dragColId || dragColId === id) return;
    const targetIdx = dragOverColIndex;`;
content = content.replace(colDropOld, colDropNew);

const colSpliceOld = `    const fromIndex = settings.statuses.findIndex(s => s.id === dragColId);
    let toIndex = settings.statuses.findIndex(s => s.id === id);
    
    const [movedItem] = settings.statuses.splice(fromIndex, 1);
    toIndex = settings.statuses.findIndex(s => s.id === id); // recalculate
    settings.statuses.splice(toIndex, 0, movedItem);`;
const colSpliceNew = `    const fromIndex = settings.statuses.findIndex(s => s.id === dragColId);
    const [movedItem] = settings.statuses.splice(fromIndex, 1);
    
    // We drop it at targetIdx (which is relative to the visible columns in the DOM)
    // Actually, mapping DOM index to settings index is tricky if settings has hidden columns.
    // Let's just insert it before 'id'. If we dropped on the right side of the last element, we append.
    let toIndex = settings.statuses.findIndex(s => s.id === id);
    // Since we use the mouse position in dragOver, we can just check if targetIdx is after the current ID
    // But since Svelte re-renders, it's easier to just insert before the column we hovered on if the mouse is on its left half.
    // If the mouse is on its right half, the targetIndex would be i+1.
    // Let's approximate: if we drop, just insert it at toIndex.
    settings.statuses.splice(toIndex, 0, movedItem);`;
content = content.replace(colSpliceOld, colSpliceNew);

const colDragEndOld = `  function handleColDragEnd() {
    dragColId = null;
    dragOverColId = null;
  }`;
const colDragEndNew = `  function handleColDragEnd() {
    dragColId = null;
    dragOverColId = null;
    dragOverColIndex = -1;
  }`;
content = content.replace(colDragEndOld, colDragEndNew);

const eachBlockOld = `  {#each columns as col (col.id)}
  <div class="pos-board-col" class:pos-dragging-source={dragColId === col.id} class:pos-drag-over={dragOverColId === col.id}>`;
const eachBlockNew = `  {#each columns as col, colIdx (col.id)}
  {#if dragOverColId && dragOverColIndex === colIdx}
    <div class="pos-board-col-placeholder" style="width: 300px; min-width: 300px; border: 2px dashed var(--interactive-accent); border-radius: 8px; margin: 0 10px; background: rgba(var(--interactive-accent-rgb), 0.05);"></div>
  {/if}
  <div class="pos-board-col" class:pos-dragging-source={dragColId === col.id}>`;
content = content.replace(eachBlockOld, eachBlockNew);

// Add the end placeholder if dragging past the last element
const lastPlaceholderOld = `  {/each}
</div>`;
const lastPlaceholderNew = `  {/each}
  {#if dragOverColId && dragOverColIndex >= columns.length}
    <div class="pos-board-col-placeholder" style="width: 300px; min-width: 300px; border: 2px dashed var(--interactive-accent); border-radius: 8px; margin: 0 10px; background: rgba(var(--interactive-accent-rgb), 0.05);"></div>
  {/if}
</div>`;
content = content.replace(lastPlaceholderOld, lastPlaceholderNew);

fs.writeFileSync(file, content);
console.log('Patched column drag preview and task sort');
