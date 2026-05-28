<script lang="ts">
  import { App } from 'obsidian';
  import { dndzone } from 'svelte-dnd-action';
  import type { TaskData } from '../../../types';
  import type { FileManager } from '../../../data/FileManager';
  import { NewTaskModal, QuickEditTaskModal } from '../../../modals/Modals';

  export let app: App;
  export let fileManager: FileManager;
  export let projectId: string;
  export let projectTasks: TaskData[];

  const sortTasks = (tasks: TaskData[]) => tasks.sort((a, b) => { const aVal = Number(a.orderIndex) || 0; const bVal = Number(b.orderIndex) || 0; return aVal - bVal; });

  $: rawProjectStatuses = (fileManager.plugin.settings.projectStatuses || {})[projectId];
  $: statuses = (() => {
    let ps = rawProjectStatuses;
    if (!ps || !Array.isArray(ps)) {
      ps = [
        { id: 'backlog' },
        { id: 'planned', name: 'Planned', color: '#0984e3' },
        { id: 'running' },
        { id: 'review' }
      ];
    }
    
    const g = fileManager.plugin.settings.globalStatuses || {};
    const activeStatuses = new Set(projectTasks.map(t => t.status));
    const finalCols = [];
    const knownIds = new Set();
    
    ps.forEach(s => {
      finalCols.push({ ...s, name: s.name || s.id, color: s.color || '#a29bfe', isCore: s.id === 'backlog' || s.id === 'running' || s.id === 'review' });
      knownIds.add(s.id);
    });
    
    if (!knownIds.has('backlog')) {
      finalCols.unshift({ id: 'backlog', name: g['backlog']?.name || 'Elastic Backlog', color: g['backlog']?.color || '#636e72', isCore: true });
    }
    if (!knownIds.has('running')) {
      finalCols.push({ id: 'running', name: g['running']?.name || 'Elastic Running', color: g['running']?.color || '#00b894', isCore: true });
    }
    if (!knownIds.has('review')) {
      finalCols.push({ id: 'review', name: g['review']?.name || 'Finished', color: g['review']?.color || '#fdcb6e', isCore: true });
    }
    
    activeStatuses.forEach(statusId => {
      if (!finalCols.find(c => c.id === statusId)) {
        finalCols.push({ id: statusId, name: statusId, color: '#a29bfe', isCore: false });
      }
    });
    
    return finalCols;
  })();

  $: computedColumns = statuses.map(s => ({
    ...s,
    items: sortTasks(projectTasks.filter(t => t.status === s.id))
  }));

  let boardColumns = [];
  let isDraggingColumns = false;
  let isDraggingTasks = false;

  // Reactively sync our local state with the computed state, unless we are currently dragging
  $: {
    if (!isDraggingColumns && !isDraggingTasks) {
      boardColumns = computedColumns.map(c => ({ ...c, items: [...c.items] }));
    }
  }

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

  async function ensureProjectStatuses() {
    const settings = fileManager.plugin.settings;
    if (!settings.projectStatuses) settings.projectStatuses = {};
    if (!settings.projectStatuses[projectId]) {
       settings.projectStatuses[projectId] = statuses.map(s => ({ id: s.id, name: s.name, color: s.color }));
    }
    return settings;
  }

  // Column Reordering (Board Level)
  function handleColumnConsider(e) {
    isDraggingColumns = true;
    boardColumns = e.detail.items;
  }
  
  async function handleColumnFinalize(e) {
    boardColumns = e.detail.items;
    isDraggingColumns = false;
    const settings = await ensureProjectStatuses();
    settings.projectStatuses[projectId] = boardColumns.map(c => ({ id: c.id, name: c.name, color: c.color }));
    await fileManager.plugin.saveSettings();
    fileManager.plugin.settings = settings;
    fileManager = fileManager; // Force Svelte Reactivity
  }

  // Task Reordering (Cross-Column)
  function handleTaskConsider(colId, e) {
    isDraggingTasks = true;
    const colIndex = boardColumns.findIndex(c => c.id === colId);
    boardColumns[colIndex].items = e.detail.items;
    boardColumns = [...boardColumns];
  }
  
  async function handleTaskFinalize(colId, e) {
    const colIndex = boardColumns.findIndex(c => c.id === colId);
    boardColumns[colIndex].items = e.detail.items;
    boardColumns = [...boardColumns];
    isDraggingTasks = false;
    
    const promises = [];
    boardColumns[colIndex].items.forEach((t, idx) => {
      if (t.status !== colId || t.orderIndex !== idx) {
        promises.push(fileManager.updateTask(t.id, { status: colId, orderIndex: idx }));
      }
    });
    await Promise.all(promises);
  }

  // Edit State
  let editingColId: string | null = null;

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
    fileManager = fileManager;
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
    fileManager = fileManager;
    editingColId = null;
  }

  async function deleteColumn(colId: string) {
    if (!confirm("Are you sure you want to delete this column? ALL TASKS inside this column will also be permanently deleted!")) return;
    
    const tasksToDelete = projectTasks.filter(t => t.status === colId);
    for (const t of tasksToDelete) {
      await fileManager.deleteTask(t.id);
    }
    
    const settings = await ensureProjectStatuses();
    const ps = settings.projectStatuses[projectId];
    const idx = ps.findIndex(s => s.id === colId);
    if (idx !== -1) {
      ps.splice(idx, 1);
      await fileManager.plugin.saveSettings();
      fileManager.plugin.settings = settings;
      fileManager = fileManager;
    }
  }

  async function addColumn() {
    const settings = await ensureProjectStatuses();
    const newId = 'col-' + Date.now();
    settings.projectStatuses[projectId].push({ id: newId, name: 'New Column', color: '#a29bfe' });
    await fileManager.plugin.saveSettings();
    fileManager.plugin.settings = settings;
    fileManager = fileManager;
    editingColId = newId;
  }

  function createPlannedTask(statusId: string) {
    new NewTaskModal(app, async (name) => {
      let pid = projectId;
      if (pid === '-- All Projects --') pid = '';
      const colTasks = projectTasks.filter(t => t.status === statusId);
      const maxOrder = colTasks.length > 0 ? Math.max(...colTasks.map(t => Number(t.orderIndex) || 0)) + 1 : 0;
      await fileManager.createTask({ name, project: pid, status: statusId, orderIndex: maxOrder });
    }).open();
  }

  function editTask(task: TaskData) {
    new QuickEditTaskModal(app, fileManager.plugin, task, async (updates) => {
      await fileManager.updateTask(task.id, updates);
    }).open();
  }

  async function deleteTask(id: string) {
    if (confirm('Delete this task permanently?')) {
      await fileManager.deleteTask(id);
    }
  }

  const flipDurationMs = 200;
</script>

<div class="pos-board-workspace" use:dndzone={{items: boardColumns, flipDurationMs, type: 'columns'}} on:consider={handleColumnConsider} on:finalize={handleColumnFinalize}>
    {#each boardColumns as col (col.id)}
    <div class="pos-board-col" class:pos-col-elastic={col.isCore}>
      <h4 class="pos-board-col-title" 
          style="color: {col.color}; border-bottom: 2px solid {col.color}40; display: flex; align-items: center; justify-content: space-between;"
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
           <span style="cursor: grab; flex: 1;">{col.name} <span style="opacity:0.5; font-size:0.8em">({col.items.length})</span></span>
        {/if}
        
        <div style="display: flex; gap: 5px; align-items: center;">
           <input type="color" value={col.color} style="width: 20px; height: 20px; padding: 0; border: none; cursor: pointer; background: none;" on:change={(e) => updateColumnColor(col.id, e.currentTarget.value)} title="Change column color" />
           {#if !col.isCore}
             <button class="pos-del" style="padding: 2px 6px; font-size: 0.8em;" on:click|stopPropagation={() => deleteColumn(col.id)} title="Delete Column">x</button>
           {/if}
        </div>
      </h4>
      <div class="pos-board-list-wrapper">
        <div class="pos-board-list" style="min-height: 50px;" use:dndzone={{items: col.items, flipDurationMs, dropTargetStyle: {}}} on:consider={(e) => handleTaskConsider(col.id, e)} on:finalize={(e) => handleTaskFinalize(col.id, e)}>
          {#each col.items as task (task.id)}
            <div class="pos-card pos-board-card">
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
        </div>
        <button class="pos-board-add-btn" on:click|stopPropagation={() => createPlannedTask(col.id)}>+ Add Task</button>
      </div>
    </div>
    {/each}
    
    <div style="padding: 10px; display: flex; align-items: flex-start;">
      <button class="pos-btn" style="white-space: nowrap;" on:click={addColumn}>+ Add Kanban Column</button>
    </div>
  </div>
