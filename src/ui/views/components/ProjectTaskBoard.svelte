<script lang="ts">
  import { App as ObsidianApp, TFile } from 'obsidian';
  import type { FileManager } from '../../../data/FileManager';
  import { EditTaskModal, NewTaskModal } from '../../../modals/Modals';
  import type { TaskData, TaskStatus } from '../../../types';

  export let app;
  export let fileManager: FileManager;
  export let projectId: string;
  export let projectTasks: TaskData[];

  $: planned = projectTasks.filter(t => t.status === 'planned');
  $: backlog = projectTasks.filter(t => t.status === 'backlog');
  $: running = projectTasks.filter(t => t.status === 'running');
  $: review = projectTasks.filter(t => t.status === 'review');

  // Drag and drop states
  let dragId: string | null = null;
  let dragOverStatus: TaskStatus | null = null;
  let dragOverIndex: number = -1;

  function handleDragStart(e: DragEvent, id: string) {
    dragId = id;
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', id);
    }
  }

  function handleDragOver(e: DragEvent, status: TaskStatus) {
    e.preventDefault();
    if (!dragId) return;
    dragOverStatus = status;

    const listEl = (e.currentTarget as HTMLElement).querySelector('.pos-board-list');
    if (!listEl) return;

    const cards = Array.from(listEl.querySelectorAll('.pos-board-card:not(.pos-dragging-source)'));
    let index = 0;
    for (let i = 0; i < cards.length; i++) {
      const rect = cards[i].getBoundingClientRect();
      if (e.clientY < rect.top + rect.height / 2) {
        index = i;
        break;
      }
      index = i + 1;
    }
    dragOverIndex = index;
  }

  async function handleDrop(e: DragEvent, status: TaskStatus) {
    e.preventDefault();
    if (!dragId) return;

    const task = projectTasks.find(t => t.id === dragId);
    if (!task) return;

    const oldStatus = task.status;
    const targetIndex = dragOverIndex;

    dragId = null;
    dragOverStatus = null;
    dragOverIndex = -1;

    if (oldStatus === status) {
      const colTasks = projectTasks.filter(t => t.status === status);
      const cardToMove = colTasks.find(t => t.id === task.id);
      if (!cardToMove) return;
      const oldIndex = colTasks.indexOf(cardToMove);
      if (oldIndex === targetIndex || oldIndex === targetIndex - 1) return;

      const newColTasks = [...colTasks];
      newColTasks.splice(oldIndex, 1);
      
      let adjustedTarget = targetIndex;
      if (oldIndex < targetIndex) adjustedTarget--;
      newColTasks.splice(adjustedTarget, 0, cardToMove);

      await Promise.all(newColTasks.map((t, idx) => 
        fileManager.updateTask(t.id, { orderIndex: idx })
      ));
    } else {
      const sourceCol = projectTasks.filter(t => t.status === oldStatus && t.id !== task.id);
      const destCol = projectTasks.filter(t => t.status === status);
      
      destCol.splice(targetIndex, 0, { ...task, status, isCompleted: status === 'review' });

      await Promise.all([
        ...sourceCol.map((t, idx) => fileManager.updateTask(t.id, { orderIndex: idx })),
        ...destCol.map((t, idx) => fileManager.updateTask(t.id, { 
          orderIndex: idx, 
          status: t.id === task.id ? status : t.status,
          isCompleted: t.id === task.id ? (status === 'review') : t.isCompleted 
        }))
      ]);
    }
  }

  // Task Actions
  function createPlannedTask(status: TaskStatus) {
    new NewTaskModal(app, async (name) => {
      await fileManager.createTask({
        name,
        project: projectId,
        status: status,
        orderIndex: projectTasks.filter(t => t.status === status).length
      });
    }).open();
  }

  function editTask(task: TaskData) {
    new EditTaskModal(app, task, async (updates) => {
      await fileManager.updateTask(task.id, updates);
    }).open();
  }

  function openTaskFile(taskId: string) {
    const file = app.vault.getAbstractFileByPath(`tasks/${taskId}.md`);
    if (file instanceof TFile) {
      app.workspace.getLeaf().openFile(file);
    }
  }

  async function updateStatus(task: TaskData, status: TaskStatus) {
    await fileManager.updateTask(task.id, { status, isCompleted: status === 'review' });
  }

  async function toggleFixed(task: TaskData, isFixed: boolean) {
    await fileManager.updateTask(task.id, {
      isFixedDuration: isFixed,
      fixedDuration: isFixed ? (task.fixedDuration || 30) : null
    });
  }

  async function setFixed(task: TaskData, duration: number) {
    await fileManager.updateTask(task.id, {
      isFixedDuration: true,
      fixedDuration: duration
    });
  }

  async function deleteTask(id: string) {
    await fileManager.deleteTask(id);
  }
</script>

<div class="pos-board-workspace">
  <!-- PLANNED COLUMN -->
  <div class="pos-board-col">
    <h4 class="pos-board-col-title planned">Planned ({planned.length})</h4>
    <div class="pos-board-list-wrapper" on:dragover={(e) => handleDragOver(e, 'planned')} on:drop={(e) => handleDrop(e, 'planned')}>
      <div class="pos-board-list">
        {#each planned as task, i (task.id)}
          {#if dragOverStatus === 'planned' && dragOverIndex === i}
            <div class="pos-drag-placeholder"></div>
          {/if}
          <div class="pos-card pos-board-card" class:pos-dragging-source={dragId === task.id} draggable="true" on:dragstart={(e) => handleDragStart(e, task.id)}>
            <div class="pos-ptc-header">
              <input type="checkbox" checked={false} on:change={() => updateStatus(task, 'backlog')} class="pos-task-checkbox" />
              <div class="pos-ptc-body">
                <div class="pos-card-name" on:click={() => openTaskFile(task.id)}>{task.name}</div>
                {#if task.description}<div class="pos-card-desc">{task.description}</div>{/if}
                <div class="pos-ptc-meta">
                  <span>W:{task.weight}</span>
                </div>
              </div>
            </div>
            <div class="pos-ptc-acts">
              <button class="pos-ptc-add-btn" on:click={() => updateStatus(task, 'backlog')}>Activate</button>
              <button on:click={() => editTask(task)}>Edit</button>
              <button class="pos-del" on:click={() => deleteTask(task.id)}>Delete</button>
            </div>
          </div>
        {/each}
        {#if dragOverStatus === 'planned' && dragOverIndex >= planned.length}
          <div class="pos-drag-placeholder"></div>
        {/if}
        <button class="pos-board-add-btn" on:click={() => createPlannedTask('planned')}>+ Plan Task</button>
      </div>
    </div>
  </div>

  <!-- BACKLOG COLUMN -->
  <div class="pos-board-col">
    <h4 class="pos-board-col-title backlog">Backlog ({backlog.length})</h4>
    <div class="pos-board-list-wrapper" on:dragover={(e) => handleDragOver(e, 'backlog')} on:drop={(e) => handleDrop(e, 'backlog')}>
      <div class="pos-board-list">
        {#each backlog as task, i (task.id)}
          {#if dragOverStatus === 'backlog' && dragOverIndex === i}
            <div class="pos-drag-placeholder"></div>
          {/if}
          <div class="pos-card pos-board-card" class:pos-dragging-source={dragId === task.id} draggable="true" on:dragstart={(e) => handleDragStart(e, task.id)}>
            <div class="pos-ptc-header">
              <input type="checkbox" checked={true} on:change={() => updateStatus(task, 'planned')} class="pos-task-checkbox" />
              <div class="pos-ptc-body">
                <div class="pos-card-name" on:click={() => openTaskFile(task.id)}>{task.name}</div>
                {#if task.description}<div class="pos-card-desc">{task.description}</div>{/if}
                <div class="pos-ptc-meta">
                  <span>W:{task.weight}</span>
                </div>
              </div>
            </div>
            <div class="pos-ptc-acts">
              <button class="pos-ptc-start-btn" on:click={() => updateStatus(task, 'running')}>Start</button>
              <button on:click={() => editTask(task)}>Edit</button>
              <button class="pos-del" on:click={() => deleteTask(task.id)}>Delete</button>
            </div>
          </div>
        {/each}
        {#if dragOverStatus === 'backlog' && dragOverIndex >= backlog.length}
          <div class="pos-drag-placeholder"></div>
        {/if}
        <button class="pos-board-add-btn" on:click={() => createPlannedTask('backlog')}>+ Add Backlog</button>
      </div>
    </div>
  </div>

  <!-- RUNNING COLUMN -->
  <div class="pos-board-col">
    <h4 class="pos-board-col-title running">Running ({running.length})</h4>
    <div class="pos-board-list-wrapper" on:dragover={(e) => handleDragOver(e, 'running')} on:drop={(e) => handleDrop(e, 'running')}>
      <div class="pos-board-list">
        {#each running as task, i (task.id)}
          {#if dragOverStatus === 'running' && dragOverIndex === i}
            <div class="pos-drag-placeholder"></div>
          {/if}
          <div class="pos-card pos-board-card" class:pos-dragging-source={dragId === task.id} draggable="true" on:dragstart={(e) => handleDragStart(e, task.id)}>
            <div class="pos-ptc-header">
              <div class="pos-ptc-body">
                <div class="pos-card-name" on:click={() => openTaskFile(task.id)}>{task.name}</div>
                {#if task.description}<div class="pos-card-desc">{task.description}</div>{/if}
                <div class="pos-ptc-meta">
                  <span>W:{task.weight}</span>
                  {#if task.isFixedDuration && task.fixedDuration}<span>Fixed {task.fixedDuration}m</span>{/if}
                </div>
              </div>
            </div>
            <div class="pos-ptc-acts">
              <button on:click={() => updateStatus(task, 'review')}>Done</button>
              <button on:click={() => updateStatus(task, 'backlog')}>Backlog</button>
              
              <span class="pos-wg">
                <button on:click={() => fileManager.updateTask(task.id, { weight: Math.max(1, task.weight - 1) })}>−</button>
                <span>{task.weight}</span>
                <button on:click={() => fileManager.updateTask(task.id, { weight: task.weight + 1 })}>+</button>
              </span>
              
              <label class="pos-fixed" on:click|stopPropagation>
                <input type="checkbox" checked={task.isFixedDuration} on:change={(e) => toggleFixed(task, e.currentTarget.checked)} />
                <span>Fixed</span>
              </label>
              {#if task.isFixedDuration}
                <input type="number" min="1" class="pos-fixed-input" value={task.fixedDuration || 30} on:click|stopPropagation on:change={(e) => setFixed(task, Number(e.currentTarget.value))} />
              {/if}
              
              <button on:click={() => editTask(task)}>Edit</button>
              <button class="pos-del" on:click={() => deleteTask(task.id)}>Delete</button>
            </div>
          </div>
        {/each}
        {#if dragOverStatus === 'running' && dragOverIndex >= running.length}
          <div class="pos-drag-placeholder"></div>
        {/if}
      </div>
    </div>
  </div>

  <!-- REVIEW COLUMN -->
  <div class="pos-board-col">
    <h4 class="pos-board-col-title review">Review ({review.length})</h4>
    <div class="pos-board-list-wrapper" on:dragover={(e) => handleDragOver(e, 'review')} on:drop={(e) => handleDrop(e, 'review')}>
      <div class="pos-board-list">
        {#each review as task, i (task.id)}
          {#if dragOverStatus === 'review' && dragOverIndex === i}
            <div class="pos-drag-placeholder"></div>
          {/if}
          <div class="pos-card pos-board-card pos-completed" class:pos-dragging-source={dragId === task.id} draggable="true" on:dragstart={(e) => handleDragStart(e, task.id)}>
            <div class="pos-ptc-header">
              <div class="pos-ptc-body">
                <div class="pos-card-name" on:click={() => openTaskFile(task.id)}>{task.name}</div>
                {#if task.description}<div class="pos-card-desc">{task.description}</div>{/if}
                <div class="pos-ptc-meta">
                  <span>W:{task.weight}</span>
                </div>
              </div>
            </div>
            <div class="pos-ptc-acts">
              <button on:click={() => updateStatus(task, 'running')}>Restore</button>
              <button on:click={() => editTask(task)}>Edit</button>
              <button class="pos-del" on:click={() => deleteTask(task.id)}>Delete</button>
            </div>
          </div>
        {/each}
        {#if dragOverStatus === 'review' && dragOverIndex >= review.length}
          <div class="pos-drag-placeholder"></div>
        {/if}
      </div>
    </div>
  </div>
</div>
