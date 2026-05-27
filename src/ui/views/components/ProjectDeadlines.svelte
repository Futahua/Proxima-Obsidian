<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import type { FileManager } from '../../../data/FileManager';
  import { tasksStore, getProjectTasks } from '../../../stores/data';
  import { formatCountdown } from '../../../utils';
  import { QuickEditTaskModal } from '../../../modals/Modals';

  export let app;
  export let fileManager;
  export let projectId;

  $: projectTasks = getProjectTasks($tasksStore, projectId);
  $: deadlinedTasks = projectTasks.filter(t => t.deadline && !t.isCompleted).sort((a, b) =>
    new Date(a.deadline || '').getTime() - new Date(b.deadline || '').getTime()
  );

  // Group tasks by their resolved non-overlapping row
  $: tasksByRow = (() => {
    const acc: Record<number, any[]> = {};
    const placedRows: Record<number, { start: number; end: number }[]> = {};

    // Sort tasks by start date for a stable, clean layout assignment
    const sortedTasks = [...deadlinedTasks].sort((a, b) => {
      const aStart = (a.startDate ? new Date(a.startDate) : new Date(a.createdAt || 0)).getTime();
      const bStart = (b.startDate ? new Date(b.startDate) : new Date(b.createdAt || 0)).getTime();
      return aStart - bStart;
    });

    for (const t of sortedTasks) {
      const startMs = (t.startDate ? new Date(t.startDate) : new Date(t.createdAt || 0)).getTime();
      const endMs = new Date(t.deadline || '').getTime();

      let r = t.ganttRow || 0;
      let collides = true;

      while (collides) {
        collides = false;
        const rowItems = placedRows[r];
        if (rowItems) {
          for (const item of rowItems) {
            // Overlap check (the slightest overlap: startMs <= item.end && endMs >= item.start)
            if (startMs <= item.end && endMs >= item.start) {
              collides = true;
              r++;
              break;
            }
          }
        }
      }

      if (!placedRows[r]) placedRows[r] = [];
      placedRows[r].push({ start: startMs, end: endMs });

      if (!acc[r]) acc[r] = [];
      acc[r].push(t);
    }

    return acc;
  })();

  $: maxRow = Object.keys(tasksByRow).reduce((max, rStr) => Math.max(max, parseInt(rStr, 10)), 0);
  // Always render at least 300 rows, or maxRow + 20 to give plenty of scrolling space
  $: gridRows = Array.from({ length: Math.max(300, maxRow + 20) }, (_, i) => i);

  let viewMode: 'calendar' | 'timeline' | 'list' = 'calendar';
  let now = Date.now();
  let timer: number;

  onMount(() => {
    timer = window.setInterval(() => { now = Date.now(); }, 1000);
  });

  onDestroy(() => {
    window.clearInterval(timer);
  });

  function getHueForRemaining(diffMs: number): number {
    const daysLeft = diffMs / (1000 * 60 * 60 * 24);
    if (daysLeft <= 0) return 0;
    if (daysLeft >= 7) return 120;
    return 120 * (daysLeft / 7);
  }

  function urgencyClass(diffMs: number): string {
    const days = diffMs / 86400000;
    if (days < 0) return 'overdue';
    if (days < 1) return 'critical';
    if (days < 3) return 'warning';
    if (days < 7) return 'caution';
    return 'safe';
  }

  let currentDate = new Date();
  $: year = currentDate.getFullYear();
  $: month = currentDate.getMonth();
  $: monthName = currentDate.toLocaleString('default', { month: 'long' });

  function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
  function getFirstDayOfWeek(y: number, m: number) { return new Date(y, m, 1).getDay(); }

  $: daysInMonth = getDaysInMonth(year, month);
  $: firstDayOfWeek = getFirstDayOfWeek(year, month);

  function prevMonth() { currentDate = new Date(year, month - 1, 1); }
  function nextMonth() { currentDate = new Date(year, month + 1, 1); }
  function goToToday() { currentDate = new Date(); }

  function isSameDay(d1: Date, d2: Date) {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  $: gridCells = (() => {
    const cells: { dateStr: string; dayNum: number; isCurrentMonth: boolean; isToday: boolean; isWeekend: boolean }[] = [];
    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDay = prevMonthDays - i;
      const d = new Date(year, month - 1, prevDay);
      cells.push({ dateStr: d.toISOString().slice(0, 10), dayNum: prevDay, isCurrentMonth: false, isToday: isSameDay(d, new Date()), isWeekend: d.getDay() === 0 || d.getDay() === 6 });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      cells.push({ dateStr: d.toISOString().slice(0, 10), dayNum: i, isCurrentMonth: true, isToday: isSameDay(d, new Date()), isWeekend: d.getDay() === 0 || d.getDay() === 6 });
    }
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      cells.push({ dateStr: d.toISOString().slice(0, 10), dayNum: i, isCurrentMonth: false, isToday: isSameDay(d, new Date()), isWeekend: d.getDay() === 0 || d.getDay() === 6 });
    }
    return cells;
  })();

  $: gridWeeks = (() => {
    const weeks = [];
    for (let i = 0; i < gridCells.length; i += 7) {
      const weekCells = gridCells.slice(i, i + 7);
      const weekStartMs = new Date(weekCells[0].dateStr).getTime();
      const weekEndMs = new Date(weekCells[6].dateStr).getTime() + 86400000;
      
      const overlappingTasks = deadlinedTasks.filter(t => {
         const startMs = (t.startDate ? new Date(t.startDate) : new Date(t.createdAt)).getTime();
         const endMs = t.deadline ? new Date(t.deadline).getTime() : startMs + 86400000;
         return startMs < weekEndMs && endMs > weekStartMs;
      }).sort((a, b) => {
         const as = (a.startDate ? new Date(a.startDate) : new Date(a.createdAt)).getTime();
         const bs = (b.startDate ? new Date(b.startDate) : new Date(b.createdAt)).getTime();
         return as - bs;
      });

      const placedTasks = [];
      for (const t of overlappingTasks) {
         const startMs = (t.startDate ? new Date(t.startDate) : new Date(t.createdAt)).getTime();
         const endMs = t.deadline ? new Date(t.deadline).getTime() : startMs + 86400000;
         
         const clampedStartMs = Math.max(startMs, weekStartMs);
         const clampedEndMs = Math.min(endMs, weekEndMs);
         
         const leftPct = ((clampedStartMs - weekStartMs) / (7 * 86400000)) * 100;
         let widthPct = ((clampedEndMs - clampedStartMs) / (7 * 86400000)) * 100;
         if (widthPct < 5) widthPct = 5; // Min width for visibility
         
         let r = 0;
         while (placedTasks.some(p => p.row === r && !(leftPct >= p.rightPct || (leftPct + widthPct) <= p.leftPct))) {
            r++;
         }
         placedTasks.push({ 
           task: t, 
           row: r, 
           leftPct, 
           widthPct, 
           rightPct: leftPct + widthPct, 
           isStart: startMs >= weekStartMs, 
           isEnd: endMs <= weekEndMs,
           diffMs: endMs - Date.now()
         });
      }
      weeks.push({ cells: weekCells, tasks: placedTasks });
    }
    return weeks;
  })();

  // ── Gantt Timeline ──
  let ganttZoom = 40;
  let ganttScrollContainer: HTMLElement;
  $: ganttCols = 180;

  $: timelineDates = (() => {
    const dates: { dateStr: string; label: string; dayLabel: string; isToday: boolean; isWeekend: boolean; isMonday: boolean; isMonthStart: boolean; d: Date }[] = [];
    const today = new Date();
    const offset = -30;
    const count = ganttCols;
    for (let i = offset; i < count + offset; i++) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      dates.push({
        dateStr: d.toISOString().slice(0, 10),
        label: `${d.getMonth() + 1}/${d.getDate()}`,
        dayLabel: ['S','M','T','W','T','F','S'][d.getDay()],
        isToday: i === 0,
        isWeekend: d.getDay() === 0 || d.getDay() === 6,
        isMonday: d.getDay() === 1,
        isMonthStart: d.getDate() === 1,
        d
      });
    }
    return dates;
  })();

  $: todayColIndex = timelineDates.findIndex(td => td.isToday);

  $: zeroMs = timelineDates.length > 0 ? timelineDates[0].d.getTime() : 0;

  $: {
    if (viewMode === 'timeline' && ganttScrollContainer && timelineDates.length) {
      setTimeout(() => {
        if (todayColIndex > -1 && ganttScrollContainer.scrollLeft === 0) {
          const scrollPos = (todayColIndex * ganttZoom) - 100;
          ganttScrollContainer.scrollLeft = scrollPos > 0 ? scrollPos : 0;
        }
      }, 50);
    }
  }

  async function handleWheel(e: WheelEvent) {
    if (e.ctrlKey && ganttScrollContainer) {
      e.preventDefault();
      
      const rect = ganttScrollContainer.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const currentScrollLeft = ganttScrollContainer.scrollLeft;
      
      // Calculate exactly what MS is underneath the cursor right now
      const msPerDay = 86400000;
      const msUnderCursor = zeroMs + ((currentScrollLeft + mouseX) / ganttZoom) * msPerDay;

      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(10, Math.min(300, ganttZoom * zoomFactor));
      ganttZoom = newZoom;
      
      // Calculate where that same MS will be in pixels under the new zoom
      const newPixelForMs = ((msUnderCursor - zeroMs) / msPerDay) * newZoom;
      
      // Await tick to ensure Svelte has fully re-rendered DOM widths
      await tick();
      
      // Adjust scroll so the same pixel is under the mouse
      if (ganttScrollContainer) {
        ganttScrollContainer.scrollLeft = newPixelForMs - mouseX;
      }
    }
  }

  function panGantt(dir: 1 | -1) {
    if (ganttScrollContainer) {
      ganttScrollContainer.scrollBy({ left: dir * 300, behavior: 'smooth' });
    }
  }

  function getGanttPixelOffsets(startDateStr: string | undefined, deadlineStr: string, currentZoom: number) {
    const msPerDay = 86400000;
    const startMs = (startDateStr ? new Date(startDateStr) : new Date()).getTime();
    const endMs = new Date(deadlineStr).getTime();

    const leftPx = ((startMs - zeroMs) / msPerDay) * currentZoom;
    const widthPx = ((endMs - startMs) / msPerDay) * currentZoom;
    return { leftPx: Math.max(0, leftPx), widthPx: Math.max(widthPx, 24) }; // min 24px for handles
  }

  // ── Countdown Groups ──
  $: countdownGroups = (() => {
    const groups: { label: string; cls: string; tasks: typeof deadlinedTasks }[] = [
      { label: '🔴 Overdue', cls: 'overdue', tasks: [] },
      { label: '🟠 Due Today', cls: 'critical', tasks: [] },
      { label: '🟡 Next 3 Days', cls: 'warning', tasks: [] },
      { label: '🟢 This Week', cls: 'caution', tasks: [] },
      { label: '🔵 Later', cls: 'safe', tasks: [] },
    ];
    for (const t of deadlinedTasks) {
      const diff = new Date(t.deadline || '').getTime() - now;
      const days = diff / 86400000;
      if (days < 0) groups[0].tasks.push(t);
      else if (days < 1) groups[1].tasks.push(t);
      else if (days < 3) groups[2].tasks.push(t);
      else if (days < 7) groups[3].tasks.push(t);
      else groups[4].tasks.push(t);
    }
    return groups.filter(g => g.tasks.length > 0);
  })();

  function openTaskEditor(task: any) {
    new QuickEditTaskModal(app, task, async (updates) => {
      await fileManager.updateTask(task.id, updates);
    }, () => {
      const file = app.vault.getAbstractFileByPath(`tasks/${task.id}.md`);
      if (file) app.workspace.getLeaf('tab').openFile(file as any);
    }).open();
  }

  function formatDeadlineDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString('default', { month: 'short', day: 'numeric' });
  }

  // --- Calendar Drag and Drop ---
  let calDraggingTaskId: string | null = null;
  let calDragOverDateStr: string | null = null;

  function handleCalDragStart(e: DragEvent, taskId: string) {
    calDraggingTaskId = taskId;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', taskId);
    }
  }

  function handleCalDragOver(e: DragEvent, dateStr: string) {
    e.preventDefault();
    if (calDraggingTaskId && e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
      calDragOverDateStr = dateStr;
    }
  }

  function handleCalDragLeave(e: DragEvent) {
    calDragOverDateStr = null;
  }

  async function handleCalDrop(e: DragEvent, dateStr: string) {
    e.preventDefault();
    if (!calDraggingTaskId) {
      calDragOverDateStr = null;
      return;
    }
    
    const task = deadlinedTasks.find(t => t.id === calDraggingTaskId);
    if (task && task.deadline) {
      const oldDl = new Date(task.deadline);
      const newDl = new Date(dateStr);
      
      const oldTime = oldDl.getTime();
      const shiftMs = newDl.getTime() - new Date(oldDl.toISOString().slice(0, 10)).getTime();
      
      const updatedDl = new Date(oldTime + shiftMs);
      const updates: any = { deadline: updatedDl.toISOString() };
      
      if (task.startDate) {
        const sd = new Date(task.startDate);
        updates.startDate = new Date(sd.getTime() + shiftMs).toISOString();
      } else {
        const ca = new Date(task.createdAt);
        updates.createdAt = new Date(ca.getTime() + shiftMs).toISOString();
      }
      
      await fileManager.updateTask(task.id, updates);
    }
    
    calDraggingTaskId = null;
    calDragOverDateStr = null;
  }

  // --- Gantt Drag and Drop / Resize ---
  let draggingTaskId: string | null = null;
  let ganttDragMode: 'move' | 'resize-left' | 'resize-right' | null = null;
  let grabOffsetPx = 0;
  let initialClientX = 0;
  let initialClientY = 0;
  let tempDragLeft = 0;
  let tempDragWidth = 0;
  let tempDragTranslateY = 0;
  let isShiftPressed = false;
  let hoverTaskId: string | null = null;
  let hoverSide: 'left' | 'right' | null = null;

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Shift') {
      isShiftPressed = true;
      document.body.setAttribute('data-shift-pressed', 'true');
    }
  }

  function handleKeyUp(e: KeyboardEvent) {
    if (e.key === 'Shift') {
      isShiftPressed = false;
      document.body.removeAttribute('data-shift-pressed');
    }
  }

  function handleBarMouseMove(e: MouseEvent, taskId: string) {
    if (draggingTaskId) return;
    hoverTaskId = taskId;
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    if (e.clientX < rect.left + rect.width / 2) {
      hoverSide = 'left';
    } else {
      hoverSide = 'right';
    }
  }

  function handleBarMouseLeave() {
    hoverTaskId = null;
    hoverSide = null;
  }

  function onGanttMouseDown(e: MouseEvent, taskId: string) {
    e.stopPropagation();
    e.preventDefault(); // prevent text selection
    draggingTaskId = taskId;
    
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();

    let mode: 'move' | 'resize-left' | 'resize-right' = 'move';
    if (e.shiftKey) {
      mode = e.clientX < rect.left + rect.width / 2 ? 'resize-left' : 'resize-right';
    }
    
    ganttDragMode = mode;
    initialClientX = e.clientX;
    initialClientY = e.clientY;
    tempDragTranslateY = 0;
    
    // Set initial temp values for live preview
    const task = deadlinedTasks.find(t => t.id === taskId);
    if (task) {
      const pos = getGanttPixelOffsets(task.startDate || task.createdAt, task.deadline || '', ganttZoom);
      tempDragLeft = pos.leftPx;
      tempDragWidth = pos.widthPx;
    }
    
    if (mode === 'move') {
      document.body.classList.add('pos-is-moving');
    } else {
      document.body.classList.add('pos-is-resizing');
    }
    
    if (mode === 'move') {
       grabOffsetPx = e.clientX - rect.left;
    } else {
       grabOffsetPx = e.clientX - rect.left;
    }

    window.addEventListener('mousemove', onGanttMouseMove);
    window.addEventListener('mouseup', onGanttMouseUp);
  }

  function onGanttMouseMove(e: MouseEvent) {
    if (!draggingTaskId || !ganttScrollContainer) return;
    const containerRect = ganttScrollContainer.getBoundingClientRect();
    const dropPx = (e.clientX - containerRect.left) + ganttScrollContainer.scrollLeft;
    
    const task = deadlinedTasks.find(t => t.id === draggingTaskId);
    if (!task) return;
    const pos = getGanttPixelOffsets(task.startDate || task.createdAt, task.deadline || '', ganttZoom);

    // Live preview update
    if (ganttDragMode === 'move') {
      tempDragLeft = dropPx - grabOffsetPx;
      tempDragWidth = pos.widthPx;
      tempDragTranslateY = e.clientY - initialClientY;
    } else if (ganttDragMode === 'resize-left') {
      const rightEdge = pos.leftPx + pos.widthPx;
      tempDragLeft = Math.min(dropPx, rightEdge - 24);
      tempDragWidth = rightEdge - tempDragLeft;
    } else if (ganttDragMode === 'resize-right') {
      tempDragWidth = Math.max(24, dropPx - pos.leftPx);
    }
  }

  async function onGanttMouseUp(e: MouseEvent) {
    window.removeEventListener('mousemove', onGanttMouseMove);
    window.removeEventListener('mouseup', onGanttMouseUp);
    
    document.body.classList.remove('pos-is-moving');
    document.body.classList.remove('pos-is-resizing');

    if (!draggingTaskId || !ganttScrollContainer) {
      draggingTaskId = null;
      ganttDragMode = null;
      return;
    }

    const task = deadlinedTasks.find(t => t.id === draggingTaskId);
    
    // Distinguish click from drag
    if (Math.abs(e.clientX - initialClientX) < 3 && Math.abs(e.clientY - initialClientY) < 3) {
      if (task) openTaskEditor(task);
      draggingTaskId = null;
      ganttDragMode = null;
      return;
    }

    const containerRect = ganttScrollContainer.getBoundingClientRect();
    // Calculate pixels relative to the virtual grid start
    const dropPx = (e.clientX - containerRect.left) + ganttScrollContainer.scrollLeft;
    const msPerDay = 86400000;
    
    if (!task) return;

    const updates: any = {};

    if (ganttDragMode === 'move') {
      const newLeftPx = dropPx - grabOffsetPx;
      const newStartMs = zeroMs + (newLeftPx / ganttZoom) * msPerDay;
      
      const oldStartMs = (task.startDate ? new Date(task.startDate) : new Date(task.createdAt)).getTime();
      const oldEndMs = new Date(task.deadline!).getTime();
      const durationMs = oldEndMs - oldStartMs;
      
      updates.deadline = new Date(newStartMs + durationMs).toISOString();
      if (task.startDate) {
        updates.startDate = new Date(newStartMs).toISOString();
      } else {
        updates.createdAt = new Date(newStartMs).toISOString();
      }
      
      const rowShift = Math.round(tempDragTranslateY / 40);
      if (rowShift !== 0) {
        updates.ganttRow = Math.max(0, (task.ganttRow || 0) + rowShift);
      }
    } else if (ganttDragMode === 'resize-left') {
        const newStartMs = zeroMs + (dropPx / ganttZoom) * msPerDay;
        updates.startDate = new Date(newStartMs).toISOString();
    } else if (ganttDragMode === 'resize-right') {
        const newEndMs = zeroMs + (dropPx / ganttZoom) * msPerDay;
        updates.deadline = new Date(newEndMs).toISOString();
    }
    
    // Collision detection to prevent overlapping tasks
    const oldStartMs = (task.startDate ? new Date(task.startDate) : new Date(task.createdAt)).getTime();
    const oldEndMs = new Date(task.deadline!).getTime();
    const newStartMsFinal = updates.startDate ? new Date(updates.startDate).getTime() : (updates.createdAt ? new Date(updates.createdAt).getTime() : oldStartMs);
    const newEndMsFinal = updates.deadline ? new Date(updates.deadline).getTime() : oldEndMs;
    
    let targetRow = updates.ganttRow !== undefined ? updates.ganttRow : (task.ganttRow || 0);
    let rowCollides = true;
    while (rowCollides) {
      rowCollides = false;
      if (tasksByRow[targetRow]) {
        for (const otherTask of tasksByRow[targetRow]) {
          if (otherTask.id === task.id) continue;
          const otherStart = (otherTask.startDate ? new Date(otherTask.startDate) : new Date(otherTask.createdAt)).getTime();
          const otherEnd = new Date(otherTask.deadline!).getTime();
          if (newStartMsFinal <= otherEnd && newEndMsFinal >= otherStart) {
            rowCollides = true;
            targetRow++;
            break;
          }
        }
      }
    }
    if (targetRow !== (task.ganttRow || 0)) {
      updates.ganttRow = targetRow;
    }
    
    if (Object.keys(updates).length > 0) {
      await fileManager.updateTask(task.id, updates);
    }
    
    draggingTaskId = null;
    ganttDragMode = null;
  }

  // --- Header Grab-to-Pan ---
  let isPanningHeader = false;
  let panStartX = 0;
  let panScrollStart = 0;

  function onHeaderMouseDown(e: MouseEvent) {
    isPanningHeader = true;
    panStartX = e.clientX;
    panScrollStart = ganttScrollContainer ? ganttScrollContainer.scrollLeft : 0;
    document.body.classList.add('pos-is-moving');
    
    window.addEventListener('mousemove', onHeaderMouseMove);
    window.addEventListener('mouseup', onHeaderMouseUp);
  }

  function onHeaderMouseMove(e: MouseEvent) {
    if (!isPanningHeader || !ganttScrollContainer) return;
    const dx = e.clientX - panStartX;
    ganttScrollContainer.scrollLeft = panScrollStart - dx;
  }

  function onHeaderMouseUp(e: MouseEvent) {
    isPanningHeader = false;
    document.body.classList.remove('pos-is-moving');
    window.removeEventListener('mousemove', onHeaderMouseMove);
    window.removeEventListener('mouseup', onHeaderMouseUp);
  }

</script>

<svelte:window on:keydown={handleKeyDown} on:keyup={handleKeyUp} />

<div class="pos-dl-container">
  <div class="pos-dl-header">
    <div class="pos-dl-modes">
      <button class="pos-dl-mode-btn" class:active={viewMode === 'calendar'} on:click={() => viewMode = 'calendar'}>
        <span class="pos-dl-mode-icon">📅</span> Calendar
      </button>
      <button class="pos-dl-mode-btn" class:active={viewMode === 'timeline'} on:click={() => viewMode = 'timeline'}>
        <span class="pos-dl-mode-icon">📊</span> Timeline
      </button>
      <button class="pos-dl-mode-btn" class:active={viewMode === 'list'} on:click={() => viewMode = 'list'}>
        <span class="pos-dl-mode-icon">⏳</span> Countdowns
      </button>
    </div>

    {#if viewMode === 'calendar'}
      <div class="pos-dl-cal-nav">
        <button class="pos-dl-nav-btn" on:click={prevMonth}>‹</button>
        <span class="pos-dl-cal-label">{monthName} {year}</span>
        <button class="pos-dl-nav-btn" on:click={nextMonth}>›</button>
        <button class="pos-dl-nav-btn pos-dl-today-btn" on:click={goToToday}>Today</button>
      </div>
    {:else if viewMode === 'timeline'}
      <div class="pos-dl-cal-nav">
        <button class="pos-dl-nav-btn pos-dl-today-btn" on:click={() => {
          if (todayColIndex > -1 && ganttScrollContainer) {
            ganttScrollContainer.scrollLeft = Math.max(0, (todayColIndex * ganttZoom) - 100);
          }
        }}>Today</button>
      </div>
    {/if}
  </div>

  <div class="pos-dl-body">
    {#if deadlinedTasks.length === 0}
      <div class="pos-dl-empty">
        <div class="pos-dl-empty-icon">📭</div>
        <p>No tasks with deadlines yet.</p>
        <p class="pos-dl-empty-hint">Add deadlines to your tasks via Edit to see them here.</p>
      </div>
    {:else if viewMode === 'calendar'}
      <div class="pos-dl-cal-scroll">
        <div class="pos-dl-cal-grid">
          <div class="pos-dl-cal-weekrow">
            {#each weekDays as wd, i}
              <div class="pos-dl-cal-weekday" class:weekend={i === 0 || i === 6}>{wd}</div>
            {/each}
          </div>

          <div class="pos-dl-cal-cells">
            {#each gridWeeks as week}
              <div class="pos-dl-cal-week">
                <div class="pos-dl-cal-week-bg">
                  {#each week.cells as cell}
                    <div
                      class="pos-dl-cal-day"
                      class:other-month={!cell.isCurrentMonth}
                      class:today={cell.isToday}
                      class:weekend={cell.isWeekend}
                    >
                      <div class="pos-dl-day-num">
                        <span class:today-badge={cell.isToday}>{cell.dayNum}</span>
                      </div>
                    </div>
                  {/each}
                </div>
                <div class="pos-dl-cal-week-events" style="height: {week.tasks.length > 0 ? Math.max(...week.tasks.map(t => t.row + 1)) * 28 + 10 : 10}px">
                  {#each week.tasks as pt (pt.task.id)}
                    <button
                      class="pos-dl-cal-bar {urgencyClass(pt.diffMs)}"
                      class:is-start={pt.isStart}
                      class:is-end={pt.isEnd}
                      style="left: {pt.leftPct}%; width: {pt.widthPct}%; top: {pt.row * 28 + 4}px;"
                      on:click={() => openTaskEditor(pt.task)}
                      title="{pt.task.name}"
                    >
                      <span class="pos-dl-cal-bar-title">{pt.task.name}</span>
                    </button>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>

    {:else if viewMode === 'timeline'}
      <div class="pos-dl-gantt-scroll" bind:this={ganttScrollContainer} on:wheel={handleWheel}>
        <div class="pos-dl-gantt" style="--gantt-cols: {ganttCols}; --gantt-col-width: {ganttZoom}px;">
          <div class="pos-dl-gantt-dates" on:mousedown={onHeaderMouseDown} style="cursor: grab;">
            {#each timelineDates as td, i}
              <div class="pos-dl-gantt-date" class:today={td.isToday} class:weekend={td.isWeekend} class:is-monday={td.isMonday} class:is-month-start={td.isMonthStart}>
                <span class="pos-dl-gd-day">{td.dayLabel}</span>
                <span class="pos-dl-gd-num">{td.label}</span>
                {#if td.isToday}<span class="pos-dl-gd-today-dot"></span>{/if}
                {#if ganttZoom > 150}
                  <div class="pos-dl-gantt-hours">
                    <span>12a</span><span>6a</span><span>12p</span><span>6p</span>
                  </div>
                {/if}
              </div>
            {/each}
          </div>

          {#each gridRows as rowIdx}
            <div 
              class="pos-dl-gantt-row" 
              class:alt={rowIdx % 2 === 1}
              style={ganttZoom > 150 ? "background-image: repeating-linear-gradient(90deg, transparent, transparent calc(" + ganttZoom + "px / 4 - 1px), rgba(0,0,0,0.05) calc(" + ganttZoom + "px / 4 - 1px), rgba(0,0,0,0.05) calc(" + ganttZoom + "px / 4)); background-size: " + ganttZoom + "px 100%;" : ""}
            >
              {#if todayColIndex >= 0}
                <div class="pos-dl-gantt-today-line" style="left: calc(var(--gantt-col-width, 40px) * {todayColIndex} + (var(--gantt-col-width, 40px) / 2));"></div>
              {/if}
              
              {#if tasksByRow[rowIdx]}
                {#each tasksByRow[rowIdx] as task (task.id)}
                  {@const pos = getGanttPixelOffsets(task.startDate || task.createdAt, task.deadline || '', ganttZoom)}
                  {@const diffMs = new Date(task.deadline || '').getTime() - now}
                  {@const hue = diffMs > 0 ? getHueForRemaining(diffMs) : 0}
                  
                  <div
                    class="pos-dl-gantt-bar {urgencyClass(diffMs)}"
                    class:dragging={draggingTaskId === task.id}
                    class:hover-left-half={hoverTaskId === task.id && hoverSide === 'left'}
                    class:hover-right-half={hoverTaskId === task.id && hoverSide === 'right'}
                    style="left: {draggingTaskId === task.id ? tempDragLeft : pos.leftPx}px; width: {draggingTaskId === task.id ? tempDragWidth : pos.widthPx}px; --bar-hue: {hue}; transform: translateY({draggingTaskId === task.id && ganttDragMode === 'move' ? tempDragTranslateY : 0}px);"
                    title="{task.name} — {formatCountdown(diffMs)}"
                    on:mousemove={(e) => handleBarMouseMove(e, task.id)}
                    on:mouseleave={handleBarMouseLeave}
                    on:mousedown={(e) => onGanttMouseDown(e, task.id)}
                  >
                    <span class="pos-dl-gantt-bar-label">{task.name}</span>
                  </div>
                {/each}
              {/if}
            </div>
          {/each}
        </div>
      </div>

    {:else}
      <!-- ═══ COUNTDOWN LIST VIEW ═══ -->
      <div class="pos-dl-countdown-list">
        {#each countdownGroups as group}
          <div class="pos-dl-group">
            <div class="pos-dl-group-header {group.cls}">{group.label} <span class="pos-dl-group-count">{group.tasks.length}</span></div>
            <div class="pos-dl-group-items">
              {#each group.tasks as task (task.id)}
                {@const diff = new Date(task.deadline || '').getTime() - now}
                {@const totalMs = new Date(task.deadline || '').getTime() - new Date(task.createdAt).getTime()}
                {@const elapsed = now - new Date(task.createdAt).getTime()}
                {@const progress = totalMs > 0 ? Math.min(1, Math.max(0, elapsed / totalMs)) : 1}
                <div class="pos-dl-countdown-card {urgencyClass(diff)}" on:click={() => openTaskEditor(task)}>
                  <div class="pos-dl-cc-info">
                    <div class="pos-dl-cc-name">{task.name}</div>
                    <div class="pos-dl-cc-date">Due {formatDeadlineDate(task.deadline || '')}</div>
                  </div>
                  <div class="pos-dl-cc-right">
                    <div class="pos-dl-cc-timer">{formatCountdown(diff)}</div>
                    <div class="pos-dl-cc-progress-track">
                      <div class="pos-dl-cc-progress-fill {urgencyClass(diff)}" style="width: {progress * 100}%;"></div>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
