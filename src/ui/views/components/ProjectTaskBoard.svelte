<script lang="ts">
  import { App as ObsidianApp, TFile } from 'obsidian';
  import type { FileManager } from '../../../data/FileManager';
  import { QuickEditTaskModal, NewTaskModal } from '../../../modals/Modals';
  import type { TaskData, TaskStatus } from '../../../types';

  export let app;
  export let fileManager: FileManager;
  export let projectId: string;
  export let projectTasks: TaskData[];

  const sortTasks = (tasks: TaskData[]) => tasks.sort((a, b) => {
    const pA = (a.properties && a.properties['priority']) ? parseInt(a.properties['priority'], 10) : 3;
    const pB = (b.properties && b.properties['priority']) ? parseInt(b.properties['priority'], 10) : 3;
    return (pA - pB) || (a.orderIndex - b.orderIndex);
  });
  $: settingsStatuses = fileManager.plugin.settings.statuses || [];
  $: statuses = (() => {
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
  })();
  $: columns = statuses.map(s => ({
    ...s,
    tasks: sortTasks(projectTasks.filter(t => t.status === s.id))
  }));

  function getCustomProps(task: TaskData) {
    if (!task.properties || !fileManager.plugin.settings.taskSchema) return [];
    const res: { name: string, value: string, color?: string }[] = [];
    fileManager.plugin.settings.taskSchema.forEach(schema => {
      const val = task.properties[schema.id];
      if (val) {
        if (schema.type === 'select' || schema.type === 'multi-select') {
          const vals = Array.isArray(val) ? val : [val];
          vals.forEach(v => {
            const opt = (schema.options || []).find(o => o.id === v);
            if (opt) res.push({ name: schema.name, value: opt.name, color: opt.color });
          });
        } else if (schema.type === 'checkbox') {
           res.push({ name: schema.name, value: val ? 'Yes' : 'No' });
        } else if (schema.type === 'relation') {
           const vals = Array.isArray(val) ? val : [val];
           vals.forEach(v => res.push({ name: schema.name, value: v }));
        } else if (schema.type === 'formula' || schema.type === 'rollup') {
           res.push({ name: schema.name, value: String(val) });
        } else {
          res.push({ name: schema.name, value: String(val) });
        }
      }
    });
    return res;
  }

  
  // --- COLUMN DRAG AND DROP & COLOR ---
  let dragColId: string | null = null;
  let dragOverColId: string | null = null;
  let dragOverColIndex: number = -1;

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
    dragOverColIndex = -1;
  }

  function handleColDragOver(e: DragEvent, id: string) {
    // handled by workspace dragover event now
  }

  async function handleColDrop(e: DragEvent, id: string) {
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

  // Drag and drop states
  let dragId: string | null = null;
  let dragOverStatus: string | null = null;
  let dragOverIndex: number = -1;
  let dragHeight = 60;

  function handleDragStart(e: DragEvent, id: string) {
    const target = (e.target as HTMLElement).closest('.pos-board-card');
    if (target) {
      const rect = target.getBoundingClientRect();
      dragHeight = rect.height;
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', id);
        
        const clone = target.cloneNode(true) as HTMLElement;
        clone.style.position = 'absolute';
        clone.style.top = '-9999px';
        clone.style.left = '-9999px';
        clone.style.width = rect.width + 'px';
        clone.style.height = rect.height + 'px';
        clone.style.opacity = '1';
        clone.classList.remove('pos-dragging-source');
        document.body.appendChild(clone);
        e.dataTransfer.setDragImage(clone, e.clientX - rect.left, e.clientY - rect.top);
        
        setTimeout(() => {
          if (clone.parentNode) clone.parentNode.removeChild(clone);
        }, 50);
      }
    } else {
      if (e.dataTransfer) e.dataTransfer.setData('text/plain', id);
    }
    setTimeout(() => {
      dragId = id;
    }, 0);
  }

  function handleDragEnd() {
    dragId = null;
    dragOverStatus = null;
    dragOverIndex = -1;
  }

  function handleDragOver(e: DragEvent, status: string) {
    if (dragColId) return; // Prevent task preview when dragging columns
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    
    const listWrapper = (e.currentTarget as HTMLElement).querySelector('.pos-board-list');
    if (!listWrapper) return;
    
    const cards = Array.from(listWrapper.querySelectorAll('.pos-board-card:not(.pos-dragging-source)'));
    const mouseY = e.clientY;
    
    let targetIndex = cards.length;
    for (let i = 0; i < cards.length; i++) {
      const rect = cards[i].getBoundingClientRect();
      const middle = rect.top + rect.height / 2;
      if (mouseY < middle) {
        targetIndex = i;
        break;
      }
    }
    
    dragOverStatus = status;
    dragOverIndex = targetIndex;
  }

  async function handleDrop(e: DragEvent, status: string) {
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
        return fileManager.updateTask(t.id, { 
          orderIndex: idx, 
          status: t.id === task.id ? status : t.status
        });
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
    new NewTaskModal(app, async (name) => {
      let pid = projectId;
      if (pid === '-- All Projects --') pid = '';
      await fileManager.createTask({ name, project: pid, status: statusId });
    }).open();
  }

  function editTask(task: TaskData) {
    new QuickEditTaskModal(app, fileManager.plugin, task, async (updates) => {
      await fileManager.updateTask(task.id, updates);
    }).open();
  }

  async function updateStatus(task: TaskData, status: string) {
    await fileManager.updateTask(task.id, { status });
  }

  async function deleteTask(id: string) {
    await fileManager.deleteTask(id);
  }
</script>

<div class="pos-board-workspace">
  {#each columns as col, colIdx (col.id)}
  {#if dragOverColId && dragOverColIndex === colIdx}
    <div class="pos-board-col-placeholder" style="width: 300px; min-width: 300px; border: 2px dashed var(--interactive-accent); border-radius: 8px; margin: 0 10px; background: rgba(var(--interactive-accent-rgb), 0.05);"></div>
  {/if}
  <div class="pos-board-col" class:pos-dragging-source={dragColId === col.id} class:pos-col-elastic={['backlog', 'running', 'review'].includes(col.id)}>
    <h4 class="pos-board-col-title" 
        style="color: {col.color}; border-bottom: 2px solid {col.color}40; display: flex; align-items: center; justify-content: space-between;"
        draggable="true"
        on:dragstart={(e) => handleColDragStart(e, col.id)}
        on:dragend={handleColDragEnd}
        on:dragover={(e) => handleColDragOver(e, col.id)}
        on:drop={(e) => handleColDrop(e, col.id)}
    >
      <span style="cursor: grab;">{col.name} ({col.tasks.length})</span>
      <input type="color" value={col.color} style="width: 20px; height: 20px; padding: 0; border: none; cursor: pointer; background: none;" on:change={(e) => updateColumnColor(col.id, e.currentTarget.value)} title="Change column color" />
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
              <div class="pos-ptc-body" style="cursor: pointer;" on:click={() => editTask(task)}>
                <div class="pos-card-name">{task.name}</div>
                {#if task.description}<div class="pos-card-desc">{task.description}</div>{/if}
                <div class="pos-ptc-meta">
                  <span>W:{task.weight || 1}</span>
                  {#each getCustomProps(task) as prop}
                    {#if prop.color}
                      <span class="pos-tag-pill" style="background-color: {prop.color}20; color: {prop.color}; border: 1px solid {prop.color}40;">
                        {prop.value}
                      </span>
                    {:else}
                      <span class="pos-tag-pill" style="background-color: var(--background-modifier-border); color: var(--text-muted);">
                        {prop.name}: {prop.value}
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
        <button class="pos-board-add-btn" on:click={() => createPlannedTask(col.id)}>+ Add Task</button>
      </div>
    </div>
  </div>
  {/each}
  {#if dragOverColId && dragOverColIndex >= columns.length}
    <div class="pos-board-col-placeholder" style="width: 300px; min-width: 300px; border: 2px dashed var(--interactive-accent); border-radius: 8px; margin: 0 10px; background: rgba(var(--interactive-accent-rgb), 0.05);"></div>
  {/if}
</div>
