<script lang="ts">
  import { App } from 'obsidian';
  import { onMount } from 'svelte';
  import type { TaskData } from '../../../types';
  import type { FileManager } from '../../../data/FileManager';
  import { NewTaskModal, QuickEditTaskModal } from '../../../modals/Modals';

  export let app: App;
  export let fileManager: FileManager;
  onMount(() => {
    require('fs').writeFileSync('c:/proxima-debug.txt', 'ProjectTaskBoard MOUNTED SUCCESSFULLY\n', { flag: 'a' });
  });
  export let projectId: string;
  export let projectTasks: TaskData[];

  const sortTasks = (tasks: TaskData[]) => tasks.sort((a, b) => {
    const pA = (a.properties && a.properties['priority']) ? parseInt(a.properties['priority'], 10) : 3;
    const pB = (b.properties && b.properties['priority']) ? parseInt(b.properties['priority'], 10) : 3;
    return (pA - pB) || (a.orderIndex - b.orderIndex);
  });

  $: rawProjectStatuses = (fileManager.plugin.settings.projectStatuses || {})[projectId];
  $: statuses = (() => {
    let ps = rawProjectStatuses;
    if (!ps) {
      ps = [
        { id: 'backlog' },
        { id: 'planned', name: 'Planned', color: '#0984e3' },
        { id: 'running' },
        { id: 'review' }
      ];
    }
    
    const cols = [];
    const coreIds = ['backlog', 'running', 'review'];
    const g = fileManager.plugin.settings.globalStatuses || {};
    
    ps.forEach(s => {
      if (coreIds.includes(s.id)) {
         let defName = s.id === 'backlog' ? 'Elastic Backlog' : (s.id === 'running' ? 'Elastic Running' : 'Finished');
         let defColor = s.id === 'backlog' ? '#636e72' : (s.id === 'running' ? '#00b894' : '#fdcb6e');
         const gs = g[s.id] || {};
         cols.push({ id: s.id, name: gs.name || defName, color: gs.color || defColor, isCore: true });
      } else {
         cols.push({ ...s, name: s.name || s.id, color: s.color || '#a29bfe', isCore: false });
      }
    });

    // Fallbacks just in case
    if (!cols.find(c => c.id === 'backlog')) cols.unshift({ id: 'backlog', name: g['backlog']?.name || 'Elastic Backlog', color: g['backlog']?.color || '#636e72', isCore: true });
    if (!cols.find(c => c.id === 'running')) cols.push({ id: 'running', name: g['running']?.name || 'Elastic Running', color: g['running']?.color || '#00b894', isCore: true });
    if (!cols.find(c => c.id === 'review')) cols.push({ id: 'review', name: g['review']?.name || 'Finished', color: g['review']?.color || '#fdcb6e', isCore: true });

    const activeStatuses = new Set(projectTasks.map(t => t.status));
    activeStatuses.forEach(statusId => {
      if (!cols.find(c => c.id === statusId)) {
        cols.push({ id: statusId, name: statusId, color: '#a29bfe', isCore: false });
      }
    });
    return cols;
  })();

  $: columns = statuses.map(s => ({
    ...s,
    tasks: sortTasks(projectTasks.filter(t => t.status === s.id))
  }));

  function getCustomProps(task: TaskData) {
    if (!task.properties || !((fileManager.plugin.settings.projectSchemas || {})[projectId] || [])) return [];
    const res = [];
    const visibleIds = (fileManager.plugin.settings.projectVisibleProps || {})[projectId] || [];
    ((fileManager.plugin.settings.projectSchemas || {})[projectId] || []).forEach(schema => {
      if (!visibleIds.includes(schema.id)) return;
      const val = task.properties[schema.id];
      if (val) {
        if (schema.type === 'select' || schema.type === 'multi-select') {
          const opts = Array.isArray(val) ? val : [val];
          opts.forEach(v => {
            const opt = (schema.options || []).find(o => o.id === v);
            if (opt) res.push({ name: schema.name, value: opt.name, color: opt.color });
            else res.push({ name: schema.name, value: String(v) });
          });
        } else {
          res.push({ name: schema.name, value: String(val) });
        }
      }
    });
    return res;
  }

  // Task Drag state
  let dragId: string | null = null;
  let dragOverStatus: string | null = null;
  let dragOverIndex: number = -1;
  let dragHeight = 0;

  // Column Drag state
  let dragColId: string | null = null;
  let dragOverColId: string | null = null;
  let dragOverColIndex: number = -1;
  
  // UI Edit state
  let editingColId: string | null = null;

  async function ensureProjectStatuses() {
    const settings = fileManager.plugin.settings;
    if (!settings.projectStatuses) settings.projectStatuses = {};
    if (!settings.projectStatuses[projectId]) {
       settings.projectStatuses[projectId] = statuses.map(s => ({ id: s.id, name: s.name, color: s.color }));
    }
    return settings;
  }

  function handleColDragStart(e: DragEvent, id: string) {
    e.stopPropagation();
    if (editingColId === id) { e.preventDefault(); return; } // Don't drag while editing
    dragColId = id;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', 'col:' + id);
      const el = e.currentTarget as HTMLElement;
      el.style.opacity = '0.5';
    }
  }
  function handleColDragEnd(e: DragEvent) {
    e.stopPropagation();
    dragColId = null;
    dragOverColId = null;
    dragOverColIndex = -1;
    if (e.currentTarget) (e.currentTarget as HTMLElement).style.opacity = '1';
  }
  function handleColDragOver(e: DragEvent, id: string) {
    e.stopPropagation();
    if (!dragColId || dragColId === id) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    
    dragOverColId = id;
    const colIndex = columns.findIndex(c => c.id === id);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const middle = rect.left + rect.width / 2;
    if (e.clientX > middle) dragOverColIndex = colIndex + 1;
    else dragOverColIndex = colIndex;
  }
  
  async function handleColDrop(e: DragEvent, id: string) {
    e.stopPropagation();
    if (!dragColId || dragColId === id) return;
    e.preventDefault();
    const settings = await ensureProjectStatuses();
    let ps = settings.projectStatuses[projectId];
    
    const fromIndex = ps.findIndex(s => s.id === dragColId);
    if (fromIndex !== -1) {
      const [movedItem] = ps.splice(fromIndex, 1);
      let insertIndex = dragOverColIndex;
      if (insertIndex < columns.length) {
         const targetColId = columns[insertIndex].id;
         let toIndex = ps.findIndex(s => s.id === targetColId);
         if (toIndex !== -1) ps.splice(toIndex, 0, movedItem);
         else ps.push(movedItem);
      } else {
         ps.push(movedItem);
      }
      await fileManager.plugin.saveSettings();
      fileManager.plugin.settings = settings;
    fileManager = fileManager; // Force Svelte Reactivity
    }
    dragColId = null;
    dragOverColId = null;
    dragOverColIndex = -1;
  }

  async function updateColumnColor(colId: string, newColor: string) {
    const settings = await ensureProjectStatuses();
    if (['backlog', 'running', 'review'].includes(colId)) {
      if (!settings.globalStatuses) settings.globalStatuses = {};
      if (!settings.globalStatuses[colId]) settings.globalStatuses[colId] = { id: colId, name: '', color: '' };
      settings.globalStatuses[colId].color = newColor;
    } else {
      const col = settings.projectStatuses[projectId].find(s => s.id === colId);
      if (col) col.color = newColor;
    }
    await fileManager.plugin.saveSettings();
    fileManager.plugin.settings = settings;
    fileManager = fileManager; // Force Svelte Reactivity
  }

  async function updateColumnName(colId: string, newName: string) {
    const settings = await ensureProjectStatuses();
    if (['backlog', 'running', 'review'].includes(colId)) {
      if (!settings.globalStatuses) settings.globalStatuses = {};
      if (!settings.globalStatuses[colId]) settings.globalStatuses[colId] = { id: colId, name: '', color: '' };
      settings.globalStatuses[colId].name = newName;
    } else {
      const col = settings.projectStatuses[projectId].find(s => s.id === colId);
      if (col) col.name = newName;
    }
    await fileManager.plugin.saveSettings();
    fileManager.plugin.settings = settings;
    fileManager = fileManager; // Force Svelte Reactivity
    editingColId = null;
  }

  async function deleteColumn(colId: string) {
    if (!confirm("Are you sure you want to delete this column? ALL TASKS inside this column will also be permanently deleted!")) return;
    
    // Delete all tasks in this column
    const tasksToDelete = projectTasks.filter(t => t.status === colId);
    for (const t of tasksToDelete) {
      await fileManager.deleteTask(t.id);
    }
    
    // Delete the column
    const settings = await ensureProjectStatuses();
    const ps = settings.projectStatuses[projectId];
    const idx = ps.findIndex(s => s.id === colId);
    if (idx !== -1) {
      ps.splice(idx, 1);
      await fileManager.plugin.saveSettings();
      fileManager.plugin.settings = settings;
    fileManager = fileManager; // Force Svelte Reactivity
    }
  }

  async function addColumn() {
    const settings = await ensureProjectStatuses();
    const newId = 'col-' + Date.now();
    settings.projectStatuses[projectId].push({ id: newId, name: 'New Column', color: '#a29bfe' });
    await fileManager.plugin.saveSettings();
    fileManager.plugin.settings = settings;
    fileManager = fileManager; // Force Svelte Reactivity
    editingColId = newId;
  }

  function handleDragStart(e: DragEvent, id: string) {
    e.stopPropagation();
    console.log('Drag started:', id);
    dragId = id;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', id);
      const el = e.currentTarget as HTMLElement;
      dragHeight = el.offsetHeight;
      setTimeout(() => el.classList.add('pos-dragging'), 0);
    }
  }

  function handleDragEnd(e: DragEvent) {
    e.stopPropagation();
    dragId = null;
    dragOverStatus = null;
    dragOverIndex = -1;
    if (e.currentTarget) (e.currentTarget as HTMLElement).classList.remove('pos-dragging');
  }

  function handleDragOver(e: DragEvent, status: string) {
    e.stopPropagation();
    if (!dragId || dragColId) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    
    const list = e.currentTarget as HTMLElement;
    const cards = Array.from(list.querySelectorAll('.pos-board-card:not(.pos-dragging)'));
    const mouseY = e.clientY;
    
    let targetIndex = cards.length;
    for (let i = 0; i < cards.length; i++) {
      const rect = cards[i].getBoundingClientRect();
      const middle = rect.top + rect.height / 2;
      if (mouseY < middle) { targetIndex = i; break; }
    }
    dragOverStatus = status;
    dragOverIndex = targetIndex;
  }

  async function handleDrop(e: DragEvent, status: string) {
    e.stopPropagation();
    console.log('Dropped on status:', status);
    e.preventDefault();
    if (!dragId) return;
    
    const targetIndex = dragOverIndex === -1 ? columns.find(c => c.id === status)?.tasks.length || 0 : dragOverIndex;
    const task = projectTasks.find(t => t.id === dragId);
    
    dragId = null;
    dragOverStatus = null;
    dragOverIndex = -1;
    
    if (!task) return;
    const oldStatus = task.status;
    const allTasksOfProject = projectTasks;
    const destCol = allTasksOfProject.filter(t => t.status === status && t.id !== task.id);
    destCol.splice(targetIndex, 0, { ...task, status });
    
    const promises = destCol.map((t, idx) => {
      if (t.id === task.id || t.orderIndex !== idx) {
        return fileManager.updateTask(t.id, { orderIndex: idx, status: t.id === task.id ? status : t.status });
      }
      return Promise.resolve();
    });
    
    if (oldStatus !== status) {
      const sourceCol = allTasksOfProject.filter(t => t.status === oldStatus && t.id !== task.id);
      sourceCol.forEach((t, idx) => {
        if (t.orderIndex !== idx) promises.push(fileManager.updateTask(t.id, { orderIndex: idx }));
      });
    }
    await Promise.all(promises);
  }

  function createPlannedTask(statusId: string) {
    console.log('Creating task in status:', statusId);
    new NewTaskModal(app, async (name) => {
      let pid = projectId;
      if (pid === '-- All Projects --') pid = '';
      await fileManager.createTask({ name, project: pid, status: statusId });
    }).open();
  }

  function editTask(task: TaskData) {
    console.log('Editing task:', task.id);
    new QuickEditTaskModal(app, fileManager.plugin, task, async (updates) => {
      await fileManager.updateTask(task.id, updates);
    }).open();
  }

  async function deleteTask(id: string) {
    await fileManager.deleteTask(id);
  }
</script>

<div class="pos-board-header-actions" style="position: absolute; top: 10px; right: 20px; z-index: 10;">
     <button class="pos-btn" style="padding: 4px 10px; font-weight: bold; background: var(--interactive-accent); color: var(--text-on-accent);" on:click={addColumn}>+ Add Kanban Column</button>
   </div>
   <div class="pos-board-workspace"
    on:dragover={(e) => {
      if (dragColId) {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
        
        const cols = Array.from((e.currentTarget).children).filter(c => c.classList.contains('pos-board-col') && !c.classList.contains('pos-dragging-source'));
        const mouseX = e.clientX;
        let targetId = null;
        for (let i = 0; i < cols.length; i++) {
          const rect = cols[i].getBoundingClientRect();
          const middle = rect.left + rect.width / 2;
          if (mouseX < middle) { targetId = cols[i].dataset.colId; break; }
        }
        
        let actualIndex = columns.length;
        if (targetId) actualIndex = columns.findIndex(c => c.id === targetId);
        
        dragOverColId = 'workspace';
        dragOverColIndex = actualIndex;
      }
    }}
    on:drop={async (e) => {
      if (dragColId) {
        e.preventDefault();
        const settings = await ensureProjectStatuses();
        let ps = settings.projectStatuses[projectId];
        
        const fromIndex = ps.findIndex(s => s.id === dragColId);
        if (fromIndex !== -1) {
          const [movedItem] = ps.splice(fromIndex, 1);
          let insertIndex = dragOverColIndex;
          
          if (insertIndex < columns.length) {
             const targetColId = columns[insertIndex].id;
             let toIndex = ps.findIndex(s => s.id === targetColId);
             if (toIndex !== -1) ps.splice(toIndex, 0, movedItem);
             else ps.push(movedItem);
          } else {
             ps.push(movedItem);
          }
          await fileManager.plugin.saveSettings();
          fileManager.plugin.settings = settings;
    fileManager = fileManager; // Force Svelte Reactivity
        }
        dragColId = null;
        dragOverColId = null;
        dragOverColIndex = -1;
      }
    }}
>
  {#each columns as col, colIdx (col.id)}
  {#if dragOverColId && dragOverColIndex === colIdx}
    <div class="pos-board-col-placeholder" style="width: 300px; min-width: 300px; border: 2px dashed var(--interactive-accent); border-radius: 8px; margin: 0 10px; background: rgba(var(--interactive-accent-rgb), 0.05);"></div>
  {/if}
  <div class="pos-board-col" data-col-id={col.id} class:pos-dragging-source={dragColId === col.id} class:pos-col-elastic={col.isCore}>
    <h4 class="pos-board-col-title" 
        style="color: {col.color}; border-bottom: 2px solid {col.color}40; display: flex; align-items: center; justify-content: space-between;"
        draggable="true"
        on:dragstart={(e) => handleColDragStart(e, col.id)}
        on:dragend={handleColDragEnd}
        on:dragover={(e) => handleColDragOver(e, col.id)}
        on:drop={(e) => handleColDrop(e, col.id)}
        on:dblclick={() => editingColId = col.id}
    >
      {#if editingColId === col.id}
         <input type="text" value={col.name} 
           style="background: transparent; color: inherit; font-size: inherit; font-weight: inherit; border: 1px solid {col.color}; border-radius: 4px; padding: 2px 5px; flex: 1; outline: none; margin-right: 5px;"
           on:blur={(e) => updateColumnName(col.id, e.currentTarget.value)}
           on:keydown={(e) => { if (e.key === 'Enter') updateColumnName(col.id, e.currentTarget.value); if (e.key === 'Escape') editingColId = null; }}
           autofocus
         />
      {:else}
         <span style="cursor: grab; flex: 1;">{col.name} <span style="opacity:0.5; font-size:0.8em">({col.tasks.length})</span></span>
      {/if}
      
      <div style="display: flex; gap: 5px; align-items: center;">
         <input type="color" value={col.color} style="width: 20px; height: 20px; padding: 0; border: none; cursor: pointer; background: none;" on:change={(e) => updateColumnColor(col.id, e.currentTarget.value)} title="Change column color" />
         {#if !col.isCore}
           <button class="pos-del" style="padding: 2px 6px; font-size: 0.8em;" on:click|stopPropagation={() => deleteColumn(col.id)} title="Delete Column">x</button>
         {/if}
      </div>
    </h4>
    <div class="pos-board-list-wrapper" on:dragover={(e) => handleDragOver(e, col.id)} on:drop={(e) => handleDrop(e, col.id)}>
      <div class="pos-board-list">
        {#each col.tasks as task, i (task.id)}
          {#if dragOverStatus === col.id && dragOverIndex === i}
            <div class="pos-drag-placeholder" style="height: {dragHeight}px"></div>
          {/if}
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div class="pos-card pos-board-card" class:pos-dragging-source={dragId === task.id} draggable="true" on:dragstart={(e) => handleDragStart(e, task.id)} on:dragend={handleDragEnd}>
            <div class="pos-ptc-header">
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <div class="pos-ptc-body" style="cursor: pointer;" on:click|stopPropagation={() => editTask(task)}>
                <div class="pos-card-name">{task.name}</div>
                {#if task.description}<div class="pos-card-desc">{task.description}</div>{/if}
                <div class="pos-ptc-meta" style="display: flex; flex-direction: column; gap: 4px; margin-top: 8px; align-items: flex-start;">
                  <span style="font-size: 0.85em; opacity: 0.7;">W:{task.weight || 1}</span>
                  {#each getCustomProps(task) as prop}
                    {#if prop.color}
                      <span class="pos-tag-pill" style="background-color: {prop.color}20; color: {prop.color}; border: 1px solid {prop.color}40; display: inline-block; white-space: normal; text-align: left; line-height: 1.2;">
                        <span style="opacity: 0.7; font-size: 0.9em; margin-right: 4px;">{prop.name}:</span>{prop.value}
                      </span>
                    {:else}
                      <span class="pos-tag-pill" style="background-color: var(--background-modifier-border); color: var(--text-normal); display: inline-block; white-space: normal; text-align: left; line-height: 1.2; border: 1px solid var(--background-modifier-border-hover);">
                        <span style="opacity: 0.7; font-size: 0.9em; margin-right: 4px;">{prop.name}:</span>{prop.value}
                      </span>
                    {/if}
                  {/each}
                </div>
              </div>
            </div>
            <div class="pos-ptc-acts">
              <button class="pos-del" on:click={() => deleteTask(task.id)}>Delete</button>
            </div>
          </div>
        {/each}
        {#if dragOverStatus === col.id && dragOverIndex >= col.tasks.length}
          <div class="pos-drag-placeholder" style="height: {dragHeight}px"></div>
        {/if}
        <button class="pos-board-add-btn" on:click|stopPropagation={() => createPlannedTask(col.id)}>+ Add Task</button>
      </div>
    </div>
  </div>
  {/each}
  {#if dragOverColId && dragOverColIndex >= columns.length}
    <div class="pos-board-col-placeholder" style="width: 300px; min-width: 300px; border: 2px dashed var(--interactive-accent); border-radius: 8px; margin: 0 10px; background: rgba(var(--interactive-accent-rgb), 0.05);"></div>
  {/if}
  
  <!-- Add Column Button -->
  
</div>
