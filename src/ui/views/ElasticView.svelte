<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { App as ObsidianApp, TFile } from 'obsidian';
  import type { FileManager } from '../../data/FileManager';
  import { tasksStore, getProjectTasks } from '../../stores/data';
  import { calculateLiquidTimeline, fmtDate, fmtTime, fmtDur } from '../../utils';
  import { QuickEditTaskModal, ConfirmModal, NewTaskModal } from '../../modals/Modals';
  import type { TaskData, TaskStatus, TimelineItem } from '../../types';

  export let app;
  export let fileManager;
  export let projectId;

  $: projectTasks = getProjectTasks($tasksStore, projectId);
  
  const sortTasks = (tasks: TaskData[]) => tasks.sort((a, b) => (a.priority - b.priority) || (a.orderIndex - b.orderIndex));
  $: backlog = sortTasks(projectTasks.filter(t => t.status === 'backlog'));
  $: running = sortTasks(projectTasks.filter(t => t.status === 'running'));
  $: review = sortTasks(projectTasks.filter(t => t.status === 'review'));

  let deadline = new Date();
  deadline.setHours(17, 0, 0, 0);
  let dDate = fmtDate(deadline.toISOString());
  let dTime = fmtTime(deadline.toISOString());
  
  let isLocked = false;
  let lockAt: string | null = null;
  let lockDeadline: string | null = null;
  let lockedTimeline: TimelineItem[] = [];
  
  let now = Date.now();
  let timer: number;
  let runningWrapperHeight = 300;
  
  let lockLineTop = 0;
  let lockWipeHeight = 0;

  $: timeline = isLocked 
    ? lockedTimeline 
    : calculateLiquidTimeline(running, new Date(), new Date(`${dDate}T${dTime}`));

  // Fully reactive proportional height computations based on container clientHeight!
  $: taskHeights = (() => {
    const H = runningWrapperHeight;
    const heights: Record<string, number> = {};
    if (running.length === 0) return heights;
    
    const tl = timeline;
    const total = tl.reduce((s, t) => s + t.calculatedDuration, 0);
    
    if (total <= 0 || H <= 0) {
      const tw = running.reduce((s, t) => s + t.weight, 0) || 1;
      running.forEach(t => {
        heights[t.id] = Math.max(65, (t.weight / tw) * Math.max(H, 300));
      });
      return heights;
    }
    
    running.forEach(t => {
      const ti = tl.find(item => item.id === t.id);
      const dur = ti ? ti.calculatedDuration : 0;
      heights[t.id] = Math.max(65, (dur / total) * H);
    });
    return heights;
  })();

  function updateLockProgress() {
    if (!isLocked || !lockAt || !lockDeadline) return;
    const start = new Date(lockAt).getTime();
    const end = new Date(lockDeadline).getTime();
    const p = Math.min(1, Math.max(0, (Date.now() - start) / (end - start)));
    const totalHeight = runningWrapperHeight;
    lockLineTop = p * totalHeight;
    lockWipeHeight = lockLineTop;
  }

  onMount(() => {
    // Dynamic countdown timer ticking every second for smooth redline movements
    timer = window.setInterval(() => {
      now = Date.now();
      if (isLocked) {
        updateLockProgress();
      }
    }, 1000);
  });

  onDestroy(() => {
    window.clearInterval(timer);
  });

  function createTask() {
    new NewTaskModal(app, async (name) => {
      await fileManager.createTask({ name, project: projectId === 'all' ? null : projectId });
    }).open();
  }

  function editTask(task: TaskData) {
    new QuickEditTaskModal(app, task, async (updates) => {
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

  function confirmRestoreAll() {
    new ConfirmModal(app, 'Restore All', 'Move all review tasks back to running?', () => {
      review.forEach(t => fileManager.updateTask(t.id, { status: 'running', isCompleted: false }));
    }).open();
  }

  function confirmDeleteAll() {
    new ConfirmModal(app, 'Delete All', 'Permanently delete all tasks in review?', () => {
      review.forEach(t => fileManager.deleteTask(t.id));
    }).open();
  }

  function toggleLock() {
    if (isLocked) {
      isLocked = false;
      lockAt = null;
      lockDeadline = null;
      lockedTimeline = [];
    } else {
      const dl = new Date(`${dDate}T${dTime}`);
      lockAt = new Date().toISOString();
      lockDeadline = dl.toISOString();
      lockedTimeline = calculateLiquidTimeline(running, new Date(), dl);
      isLocked = true;
      updateLockProgress();
    }
  }

  // Advanced drag & drop with vertical indexing and placeholders
  let dragId: string | null = null;
  let dragOverStatus: TaskStatus | null = null;
  let dragOverIndex: number = -1;

  let dragHeight = 60;

  function handleDragStart(e: DragEvent, id: string) {
    const target = (e.target as HTMLElement).closest('.pos-card');
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

  function handleDragOver(e: DragEvent, status: TaskStatus) {
    e.preventDefault();
    if (!dragId) return;
    
    const task = $tasksStore.find(t => t.id === dragId);
    if (!task) return;
    
    if (isLocked && (task.status === 'running' || status === 'running') && task.status !== status) {
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'none';
      return;
    }

    const listEl = (e.currentTarget as HTMLElement).querySelector('.pos-list');
    if (!listEl) return;
    
    const isPlaceholderInThisColumn = (dragOverStatus === status && dragOverIndex !== -1);
    const placeholderShift = dragHeight + 8; // card height + gap

    const cards = Array.from(listEl.querySelectorAll('.pos-card'));
    let index = 0;
    for (let i = 0; i < cards.length; i++) {
      const rect = cards[i].getBoundingClientRect();
      let virtualTop = rect.top;
      
      if (isPlaceholderInThisColumn && dragOverIndex <= i) {
        virtualTop -= placeholderShift;
      }
      
      if (e.clientY < virtualTop + rect.height / 2) {
        index = i;
        break;
      }
      index = i + 1;
    }
    
    dragOverStatus = status;
    dragOverIndex = index;
  }

  async function handleDrop(e: DragEvent, status: TaskStatus) {
    e.preventDefault();
    if (!dragId) return;

    const task = $tasksStore.find(t => t.id === dragId);
    if (!task) return;

    const oldStatus = task.status;
    const targetIndex = dragOverIndex;

    dragId = null;
    dragOverStatus = null;
    dragOverIndex = -1;

    // Filter project-specific tasks to reindex correctly
    const allTasksOfProject = getProjectTasks($tasksStore, projectId);
    
    if (oldStatus === status) {
      // Reordering within the same column
      const colTasks = allTasksOfProject.filter(t => t.status === status);
      const cardToMove = colTasks.find(t => t.id === task.id);
      if (!cardToMove) return;
      const oldIndex = colTasks.indexOf(cardToMove);
      if (oldIndex === targetIndex || oldIndex === targetIndex - 1) return;

      const newColTasks = [...colTasks];
      newColTasks.splice(oldIndex, 1);
      
      let adjustedTarget = targetIndex;
      if (oldIndex < targetIndex) adjustedTarget--;
      newColTasks.splice(adjustedTarget, 0, cardToMove);

      // Reindex and batch update
      await Promise.all(newColTasks.map((t, idx) => 
        fileManager.updateTask(t.id, { orderIndex: idx })
      ));
    } else {
      // Moving to a different column
      if (isLocked && status === 'running') return;
      
      const sourceCol = allTasksOfProject.filter(t => t.status === oldStatus && t.id !== task.id);
      const destCol = allTasksOfProject.filter(t => t.status === status);
      
      destCol.splice(targetIndex, 0, { ...task, status, isCompleted: status === 'review' });

      // Save order indexes in both source and destination columns
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
</script>

<div class="pos-header">
  <div class="pos-deadline-controls">
    <input type="date" bind:value={dDate} />
    <input type="time" bind:value={dTime} step="60" />
    <button on:click={() => {
      if (isLocked) return;
      // Triggers reactive timeline re-run
      dDate = dDate;
    }}>Apply</button>
    <button class="pos-lock-btn" class:locked={isLocked} on:click={toggleLock}>
      {isLocked ? 'Unlock' : 'Lock'}
    </button>
  </div>
</div>

<div class="pos-columns">
  <!-- BACKLOG -->
  <div class="pos-col">
    <h4 class="pos-col-title">Backlog ({backlog.length})</h4>
    <div class="pos-list-wrapper" on:dragover={(e) => handleDragOver(e, 'backlog')} on:drop={(e) => handleDrop(e, 'backlog')}>
      <div class="pos-list">
        {#each backlog as task, i (task.id)}
          {#if dragOverStatus === 'backlog' && dragOverIndex === i}
            <div class="pos-drag-placeholder" style="height: {dragHeight}px"></div>
          {/if}
          <div class="pos-card priority-{task.priority}" class:pos-dragging-source={dragId === task.id} draggable="true" on:dragstart={(e) => handleDragStart(e, task.id)} on:dragend={handleDragEnd}>
            <div style="cursor: pointer;" on:click={() => editTask(task)}>
              <div class="pos-card-name">{task.name}</div>
              {#if task.description}<div class="pos-card-desc">{task.description}</div>{/if}
              {#if task.tags && task.tags.length > 0}
                <div class="pos-card-meta">
                  {#each task.tags as tag}
                    <span class="pos-tag-pill">{tag}</span>
                  {/each}
                </div>
              {/if}
            </div>
            <div class="pos-card-acts">
              <button class="pos-del" on:click={() => deleteTask(task.id)}>Delete</button>
            </div>
          </div>
        {/each}
        {#if dragOverStatus === 'backlog' && dragOverIndex >= backlog.length}
          <div class="pos-drag-placeholder" style="height: {dragHeight}px"></div>
        {/if}
        <div class="pos-newtask-row">
          <button class="pos-newtask-btn" on:click={createTask}>+ New Task</button>
        </div>
      </div>
    </div>
  </div>

  <!-- RUNNING -->
  <div class="pos-col">
    <h4 class="pos-col-title">Running ({running.length})</h4>
    <div 
      class="pos-list-wrapper" 
      bind:clientHeight={runningWrapperHeight} 
      on:dragover={(e) => handleDragOver(e, 'running')} 
      on:drop={(e) => handleDrop(e, 'running')}
    >
      <div class="pos-list">
        {#each running as task, i (task.id)}
          {#if dragOverStatus === 'running' && dragOverIndex === i}
            <div class="pos-drag-placeholder" style="height: {dragHeight}px"></div>
          {/if}
          {@const ti = timeline.find(t => t.id === task.id)}
          <div 
            class="pos-card priority-{task.priority}" 
            class:pos-dragging-source={dragId === task.id} 
            style="height: {taskHeights[task.id] ? taskHeights[task.id] + 'px' : 'auto'};"
            draggable="true" 
            on:dragstart={(e) => handleDragStart(e, task.id)}
            on:dragend={handleDragEnd}
          >
            <div style="cursor: pointer;" on:click={() => editTask(task)}>
              <div class="pos-card-name">{task.name}</div>
              {#if task.description}<div class="pos-card-desc">{task.description}</div>{/if}
              <div class="pos-card-meta">
                {#if task.tags && task.tags.length > 0}
                  {#each task.tags as tag}
                    <span class="pos-tag-pill">{tag}</span>
                  {/each}
                {/if}
                {#if task.isFixedDuration && task.fixedDuration}<span>Fixed {task.fixedDuration}m</span>{/if}
                {#if ti}<span>{fmtTime(ti.endTime)} ({fmtDur(Math.round(ti.calculatedDuration))})</span>{/if}
              </div>
            </div>
            <div class="pos-card-acts">
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
                <input 
                  type="number" 
                  min="1" 
                  class="pos-fixed-input" 
                  value={task.fixedDuration || 30} 
                  on:click|stopPropagation
                  on:keydown|stopPropagation
                  on:keypress|stopPropagation
                  on:keyup|stopPropagation
                  on:change={(e) => setFixed(task, Number(e.currentTarget.value))} 
                />
              {/if}
              
              <button class="pos-del" on:click={() => deleteTask(task.id)}>Delete</button>
            </div>
          </div>
        {/each}
        {#if dragOverStatus === 'running' && dragOverIndex >= running.length}
          <div class="pos-drag-placeholder" style="height: {dragHeight}px"></div>
        {/if}
      </div>
      {#if isLocked}
        <div class="pos-wipe" style="top: 0px; height: {lockWipeHeight}px;"></div>
        <div class="pos-redline" style="top: {lockLineTop}px;"></div>
      {/if}
    </div>
  </div>

  <!-- REVIEW -->
  <div class="pos-col">
    <h4 class="pos-col-title">Review ({review.length})</h4>
    <div class="pos-list-wrapper" on:dragover={(e) => handleDragOver(e, 'review')} on:drop={(e) => handleDrop(e, 'review')}>
      <div class="pos-list">
        {#each review as task, i (task.id)}
          {#if dragOverStatus === 'review' && dragOverIndex === i}
            <div class="pos-drag-placeholder" style="height: {dragHeight}px"></div>
          {/if}
          <div class="pos-card pos-completed priority-{task.priority}" class:pos-dragging-source={dragId === task.id} draggable="true" on:dragstart={(e) => handleDragStart(e, task.id)} on:dragend={handleDragEnd}>
            <div style="cursor: pointer;" on:click={() => editTask(task)}>
              <div class="pos-card-name">{task.name}</div>
              {#if task.tags && task.tags.length > 0}
                <div class="pos-card-meta">
                  {#each task.tags as tag}
                    <span class="pos-tag-pill">{tag}</span>
                  {/each}
                </div>
              {/if}
            </div>
            <div class="pos-card-acts">
              <button class="pos-del" on:click={() => deleteTask(task.id)}>Delete</button>
            </div>
          </div>
        {/each}
        {#if dragOverStatus === 'review' && dragOverIndex >= review.length}
          <div class="pos-drag-placeholder" style="height: {dragHeight}px"></div>
        {/if}
        {#if review.length > 0}
          <div class="pos-bulk-row">
            <button on:click={confirmRestoreAll}>Restore All</button>
            <button on:click={confirmDeleteAll}>Delete All</button>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
