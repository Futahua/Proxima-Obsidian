<script lang="ts">
  import { App as ObsidianApp, TFile } from 'obsidian';
  import type { FileManager } from '../../../data/FileManager';
  import { QuickEditTaskModal, NewTaskModal } from '../../../modals/Modals';
  import type { TaskData, TaskStatus } from '../../../types';

  export let app;
  export let fileManager: FileManager;
  export let projectId: string;
  export let projectTasks: TaskData[];

  const sortTasks = (tasks: TaskData[]) => tasks.sort((a, b) => (a.priority - b.priority) || (a.orderIndex - b.orderIndex));
  $: settingsStatuses = fileManager.plugin.settings.statuses || [];
  $: statuses = [
    { id: 'backlog', name: 'Elastic Backlog', color: '#636e72' },
    ...settingsStatuses.filter(s => s.id !== 'backlog')
  ];
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
    new NewTaskModal(app, fileManager, projectId, statusId).open();
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
  {#each columns as col (col.id)}
  <div class="pos-board-col">
    <h4 class="pos-board-col-title" style="color: {col.color}; border-bottom: 2px solid {col.color}40;">
      {col.name} ({col.tasks.length})
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
</div>
