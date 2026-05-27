<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { App as ObsidianApp } from 'obsidian';
  import type { FileManager } from '../../data/FileManager';
  import { tasksStore, getProjectTasks } from '../../stores/data';
  import { formatCountdown, deadlineHue } from '../../utils';

  export let app;
  export let fileManager;
  export let projectId;

  $: projectTasks = getProjectTasks($tasksStore, projectId);
  $: deadlinedTasks = projectTasks.filter(t => t.deadline && !t.isCompleted);

  // View state: 'calendar' | 'timeline' | 'list'
  let viewMode: 'calendar' | 'timeline' | 'list' = 'calendar';
  let now = Date.now();
  let timer: number;

  onMount(() => {
    timer = window.setInterval(() => { now = Date.now(); }, 1000);
  });

  onDestroy(() => {
    window.clearInterval(timer);
  });

  // ── Monthly Calendar View Calculations ──
  let currentDate = new Date();
  $: year = currentDate.getFullYear();
  $: month = currentDate.getMonth(); // 0-indexed
  $: monthName = currentDate.toLocaleString('default', { month: 'long' });

  function getDaysInMonth(y: number, m: number) {
    return new Date(y, m + 1, 0).getDate();
  }

  function getFirstDayOfWeek(y: number, m: number) {
    return new Date(y, m, 1).getDay(); // 0 is Sunday, 1 is Monday, etc.
  }

  $: daysInMonth = getDaysInMonth(year, month);
  $: firstDayOfWeek = getFirstDayOfWeek(year, month);

  function prevMonth() {
    currentDate = new Date(year, month - 1, 1);
  }

  function nextMonth() {
    currentDate = new Date(year, month + 1, 1);
  }

  function goToToday() {
    currentDate = new Date();
  }

  function isSameDay(d1: Date, d2: Date) {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }

  $: gridCells = (() => {
    const cells: { dateStr: string; dayNum: number; isCurrentMonth: boolean; isToday: boolean }[] = [];
    const prevMonthDays = getDaysInMonth(year, month - 1);
    const startDay = firstDayOfWeek;
    
    // Padding from previous month
    for (let i = startDay - 1; i >= 0; i--) {
      const prevDay = prevMonthDays - i;
      const d = new Date(year, month - 1, prevDay);
      cells.push({
        dateStr: d.toISOString().slice(0, 10),
        dayNum: prevDay,
        isCurrentMonth: false,
        isToday: isSameDay(d, new Date())
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      cells.push({
        dateStr: d.toISOString().slice(0, 10),
        dayNum: i,
        isCurrentMonth: true,
        isToday: isSameDay(d, new Date())
      });
    }
    
    // Padding from next month
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      cells.push({
        dateStr: d.toISOString().slice(0, 10),
        dayNum: i,
        isCurrentMonth: false,
        isToday: isSameDay(d, new Date())
      });
    }
    
    return cells;
  })();

  // ── Gantt Chart Timeline Calculations ──
  // Display a 14-day window: 2 days ago to 11 days ahead
  $: timelineDates = (() => {
    const dates: { dateStr: string; label: string; isToday: boolean; d: Date }[] = [];
    const today = new Date();
    for (let i = -2; i < 12; i++) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      dates.push({
        dateStr: d.toISOString().slice(0, 10),
        label: `${d.getMonth() + 1}/${d.getDate()}`,
        isToday: i === 0,
        d
      });
    }
    return dates;
  })();

  function getGanttPosition(createdAtStr: string | undefined, deadlineStr: string) {
    const startD = createdAtStr ? new Date(createdAtStr) : new Date();
    const endD = new Date(deadlineStr);
    
    const tStart = startD.toISOString().slice(0, 10);
    const tEnd = endD.toISOString().slice(0, 10);
    
    let startIndex = timelineDates.findIndex(td => td.dateStr === tStart);
    let endIndex = timelineDates.findIndex(td => td.dateStr === tEnd);
    
    if (startIndex === -1) {
      if (startD < timelineDates[0].d) startIndex = 0;
      else startIndex = 13;
    }
    if (endIndex === -1) {
      if (endD > timelineDates[13].d) endIndex = 13;
      else endIndex = 0;
    }
    
    if (startIndex > endIndex) startIndex = endIndex;
    
    return {
      gridStart: startIndex + 1,
      gridEnd: endIndex + 2
    };
  }

  function openTaskFile(taskId: string) {
    const file = app.vault.getAbstractFileByPath(`tasks/${taskId}.md`);
    if (file) {
      app.workspace.getLeaf('tab').openFile(file as any);
    }
  }

  // ── Countdowns List View ──
  $: countdownTasks = [...deadlinedTasks].sort((a, b) => 
    new Date(a.deadline || '').getTime() - new Date(b.deadline || '').getTime()
  );
</script>

<div class="pos-deadlines-workspace" style="display: flex; flex-direction: column; height: 100%;">
  <!-- View mode selectors -->
  <div class="pos-deadlines-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--background-modifier-border); padding-bottom: 10px; margin-bottom: 16px; flex-shrink: 0; flex-wrap: wrap; gap: 10px;">
    <div class="pos-deadlines-modes" style="display: flex; gap: 8px;">
      <button class="pos-tab-btn" class:active={viewMode === 'calendar'} on:click={() => viewMode = 'calendar'}>📅 Calendar</button>
      <button class="pos-tab-btn" class:active={viewMode === 'timeline'} on:click={() => viewMode = 'timeline'}>📊 Timeline</button>
      <button class="pos-tab-btn" class:active={viewMode === 'list'} on:click={() => viewMode = 'list'}>⏳ Countdowns</button>
    </div>
    
    {#if viewMode === 'calendar'}
      <div class="pos-calendar-nav" style="display: flex; align-items: center; gap: 8px;">
        <button class="pos-nav-btn" on:click={prevMonth} style="padding: 4px 8px; font-size: 0.82em; background: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-radius: 4px; cursor: pointer;">←</button>
        <span style="font-weight: 700; font-size: 0.9em; min-width: 120px; text-align: center; color: var(--text-normal);">{monthName} {year}</span>
        <button class="pos-nav-btn" on:click={nextMonth} style="padding: 4px 8px; font-size: 0.82em; background: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-radius: 4px; cursor: pointer;">→</button>
        <button class="pos-nav-btn" on:click={goToToday} style="padding: 4px 10px; font-size: 0.82em; font-weight: 600; background: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-radius: 4px; cursor: pointer;">Today</button>
      </div>
    {/if}
  </div>

  <div class="pos-deadlines-body" style="flex: 1; min-height: 0; overflow-y: auto;">
    {#if deadlinedTasks.length === 0}
      <p class="pos-empty">No active tasks with upcoming deadlines in this project.</p>
    {:else}
      {#if viewMode === 'calendar'}
        <!-- 📅 CALENDAR VIEW -->
        <div class="pos-calendar-scroll-wrapper" style="overflow-x: auto; width: 100%; border: 1px solid var(--background-modifier-border); border-radius: 8px; background: var(--background-primary);">
          <div class="pos-calendar-grid-container" style="min-width: 720px; display: flex; flex-direction: column;">
            <!-- Days of Week Header -->
            <div class="pos-calendar-weekdays" style="display: grid; grid-template-columns: repeat(7, 1fr); border-bottom: 1px solid var(--background-modifier-border); background: var(--background-secondary); padding: 8px 0; text-align: center; font-weight: 700; font-size: 0.82em; color: var(--text-muted); text-transform: uppercase;">
              <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>
            
            <!-- 7x6 Days Grid -->
            <div class="pos-calendar-cells" style="display: grid; grid-template-columns: repeat(7, 1fr); grid-auto-rows: minmax(90px, 1fr); background: var(--background-modifier-border); gap: 1px;">
              {#each gridCells as cell}
                {@const cellTasks = deadlinedTasks.filter(t => (t.deadline || '').startsWith(cell.dateStr))}
                <div class="pos-calendar-day-cell" style="background: {cell.isToday ? 'var(--background-modifier-hover)' : 'var(--background-primary)'}; padding: 6px; display: flex; flex-direction: column; gap: 4px; min-height: 90px; border-top: {cell.isToday ? '2px solid #A7C957' : 'none'};">
                  <div class="pos-day-number" style="font-weight: {cell.isToday ? '700' : '600'}; font-size: 0.82em; color: {cell.isCurrentMonth ? 'var(--text-normal)' : 'var(--text-muted)'}; display: flex; justify-content: space-between; align-items: center;">
                    <span>{cell.dayNum}</span>
                    {#if cell.isToday}
                      <span style="font-size: 0.75em; text-transform: uppercase; color: #A7C957; font-weight: 700; padding-right: 2px;">Today</span>
                    {/if}
                  </div>
                  
                  <div class="pos-day-tasks" style="display: flex; flex-direction: column; gap: 3px; overflow-y: auto; flex: 1;">
                    {#each cellTasks as t}
                      {@const diffMs = new Date(t.deadline || '').getTime() - now}
                      <div 
                        class="pos-cal-task-pill" 
                        on:click={() => openTaskFile(t.id)}
                        style="font-size: 0.75em; font-weight: 600; padding: 2px 6px; border-radius: 3px; background: hsl({(new Date(t.deadline || '').getTime() - now) > 0 ? getHueForRemaining(diffMs) : 0}, 80%, 85%); color: #101010; border: 1px solid rgba(0,0,0,0.08); cursor: pointer; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;"
                        title={`${t.name} (Deadline: ${t.deadline})`}
                      >
                        {t.name}
                      </div>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {:else if viewMode === 'timeline'}
        <!-- 📊 TIMELINE (GANTT CHART) VIEW -->
        <div class="pos-gantt-scroll-wrapper" style="overflow-x: auto; width: 100%; border: 1px solid var(--background-modifier-border); border-radius: 8px; background: var(--background-primary);">
          <div class="pos-gantt-chart-container" style="min-width: 800px; display: flex; flex-direction: column; position: relative;">
            
            <!-- Dates Header Columns -->
            <div class="pos-gantt-header" style="display: grid; grid-template-columns: repeat(14, 1fr); border-bottom: 1px solid var(--background-modifier-border); background: var(--background-secondary); padding: 10px 0; text-align: center; font-weight: 700; font-size: 0.8em; color: var(--text-muted);">
              {#each timelineDates as td}
                <div style="color: {td.isToday ? '#A7C957' : 'var(--text-muted)'}; font-weight: {td.isToday ? '800' : '600'}; font-size: 0.95em;">
                  {td.label}
                  {#if td.isToday}<div style="font-size: 0.7em; text-transform: uppercase; margin-top: 1px;">Today</div>{/if}
                </div>
              {/each}
            </div>

            <!-- Gantt Tasks Rows -->
            <div class="pos-gantt-rows" style="display: flex; flex-direction: column; position: relative; min-height: 200px;">
              <!-- Red dashed line marking Today's column -->
              <div class="pos-gantt-today-line" style="position: absolute; top: 0; bottom: 0; left: calc(100% / 14 * 2); border-left: 2px dashed #E5484D; z-index: 5; pointer-events: none; box-shadow: 0 0 4px rgba(229,72,77,0.2);"></div>
              
              {#each deadlinedTasks as task, idx}
                {@const pos = getGanttPosition(task.createdAt, task.deadline || '')}
                {@const diffMs = new Date(task.deadline || '').getTime() - now}
                <div class="pos-gantt-row" style="display: grid; grid-template-columns: repeat(14, 1fr); align-items: center; border-bottom: 1px solid var(--background-modifier-border); padding: 12px 0; background: {idx % 2 === 0 ? 'rgba(0,0,0,0.01)' : 'transparent'};">
                  
                  <!-- Horizontal Spanning Pill -->
                  <div 
                    class="pos-gantt-bar-pill" 
                    on:click={() => openTaskFile(task.id)}
                    style="grid-column: {pos.gridStart} / {pos.gridEnd}; background: linear-gradient(135deg, hsl({diffMs > 0 ? getHueForRemaining(diffMs) : 0}, 85%, 85%), hsl({diffMs > 0 ? getHueForRemaining(diffMs) : 0}, 80%, 90%)); color: #101010; border: 1px solid rgba(0,0,0,0.12); padding: 6px 12px; border-radius: 9999px; font-weight: 700; font-size: 0.78em; cursor: pointer; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); margin: 0 4px; transition: transform 0.2s;"
                    title={`${task.name} (Ends: ${task.deadline})`}
                  >
                    🚀 {task.name}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {:else}
        <!-- ⏳ COUNTDOWNS LIST VIEW -->
        <div class="pos-deadlines-list" style="display: flex; flex-direction: column; gap: 8px;">
          {#each countdownTasks as task (task.id)}
            {@const diff = new Date(task.deadline || '').getTime() - now}
            <div class="pos-card pos-deadline-card" style="border-left: 4px solid {deadlineHue(diff)} !important; background: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-radius: 8px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div class="pos-card-name" on:click={() => openTaskFile(task.id)} style="font-weight: 700; color: var(--text-normal); cursor: pointer;">{task.name}</div>
                {#if task.description}<div style="font-size: 0.8em; color: var(--text-muted); margin-top: 2px;">{task.description}</div>{/if}
              </div>
              <div class="pos-countdown" style="font-family: var(--font-monospace), monospace; font-weight: 700; font-size: 0.9em; color: {deadlineHue(diff)}; text-shadow: 0 0 1px rgba(0,0,0,0.05);">
                {formatCountdown(diff)}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</div>

<script context="module" lang="ts">
  function getHueForRemaining(diffMs: number) {
    const daysLeft = diffMs / (1000 * 60 * 60 * 24);
    if (daysLeft <= 0) return 0;
    if (daysLeft >= 7) return 120;
    // Map 0 to 7 days linearly to 0 to 120 hue (Red to Green)
    return 120 * (daysLeft / 7);
  }
</script>

