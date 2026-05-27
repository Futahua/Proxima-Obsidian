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
  
  let selectedDateStr: string | null = null;
  
  $: filteredTasks = selectedDateStr 
    ? deadlinedTasks.filter(t => (t.deadline || '').startsWith(selectedDateStr || ''))
    : deadlinedTasks;
    
  $: sortedTasks = [...filteredTasks].sort((a, b) => 
    new Date(a.deadline || '').getTime() - new Date(b.deadline || '').getTime()
  );

  let now = Date.now();
  let timer: number;

  onMount(() => {
    timer = window.setInterval(() => { now = Date.now(); }, 1000);
  });

  onDestroy(() => {
    window.clearInterval(timer);
  });

  // Unique dates for the mini calendar
  $: uniqueDates = Array.from(new Set(deadlinedTasks.map(t => (t.deadline || '').slice(0, 10)))).sort();

  function toggleDateFilter(d: string) {
    selectedDateStr = selectedDateStr === d ? null : d;
  }
</script>

<div class="pos-deadlines-view">
  {#if deadlinedTasks.length === 0}
    <p class="pos-empty">No upcoming deadlines.</p>
  {:else}
    <!-- Mini Calendar -->
    <div class="pos-mini-cal">
      {#each uniqueDates as d}
        {@const count = deadlinedTasks.filter(t => (t.deadline || '').startsWith(d)).length}
        {@const dMs = new Date(d).getTime() - now}
        <div 
          class="pos-cal-day" 
          class:selected={selectedDateStr === d}
          style="background-color: {deadlineHue(dMs)};"
          on:click={() => toggleDateFilter(d)}
        >
          <div class="pos-cal-date">{d.slice(5)}</div>
          <div class="pos-cal-count">{count}</div>
        </div>
      {/each}
    </div>

    <!-- Deadlines List -->
    <div class="pos-deadlines-list">
      {#each sortedTasks as task (task.id)}
        {@const diff = new Date(task.deadline || '').getTime() - now}
        <div class="pos-card pos-deadline-card" style="border-left-color: {deadlineHue(diff)}">
          <div class="pos-card-name">{task.name}</div>
          <div class="pos-countdown">{formatCountdown(diff)}</div>
        </div>
      {/each}
    </div>
  {/if}
</div>
