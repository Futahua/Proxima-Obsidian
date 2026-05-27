<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { App as ObsidianApp } from 'obsidian';
  import type { FileManager } from '../../data/FileManager';
  import { projectsStore, tasksStore } from '../../stores/data';
  import { formatAge } from '../../utils';

  import { NewProjectModal } from '../../modals/Modals';

  export let app;
  export let fileManager;
  export let onSelect;

  $: activeProjects = $projectsStore.filter(p => p.status === 'active');
  $: tasks = $tasksStore;

  let timer: number;
  let now = Date.now();

  onMount(() => {
    timer = window.setInterval(() => { now = Date.now(); }, 60000); // refresh age strings every minute
  });

  onDestroy(() => {
    window.clearInterval(timer);
  });

  function getHue(createdAt: string, range: number, minTime: number) {
    const tMs = new Date(createdAt).getTime();
    const ratio = range > 1 ? (tMs - minTime) / range : 0;
    return 120 * (1 - ratio);
  }

  function createProject() {
    new NewProjectModal(app, async (name, desc) => {
      const id = `proj-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
      const fm = { 
        type: 'project', 
        name, 
        description: desc, 
        createdAt: new Date().toISOString(), 
        status: 'active' 
      };
      const content = '---\n' + Object.entries(fm).map(([k,v]) => `${k}: ${v}`).join('\n') + '\n---\n';
      await app.vault.create(`projects/${id}.md`, content);
      await fileManager.loadAll(); // Reload everything
    }).open();
  }

  async function archiveProject(id: string) {
    if (confirm('Archive this project?')) {
      const file = app.vault.getAbstractFileByPath(`projects/${id}.md`);
      if (file) {
        let c = await app.vault.read(file as any);
        c = c.replace(/status:\s*active/, 'status: archived');
        if (!c.includes('status:')) c = c.replace(/---/, '---\nstatus: archived');
        await app.vault.modify(file as any, c);
        await fileManager.loadAll();
      }
    }
  }

  $: allTimes = activeProjects.map(p => new Date(p.createdAt).getTime());
  $: minTime = Math.min(...allTimes);
  $: maxTime = Math.max(...allTimes);
  $: range = maxTime - minTime || 1;
</script>

<div class="pos-newtask-row">
  <button class="pos-newtask-btn" on:click={createProject}>+ New Project</button>
</div>

{#if activeProjects.length === 0}
  <p class="pos-empty">No projects yet. Create one!</p>
{:else}
  <div class="pos-project-list">
    {#each activeProjects as project (project.id)}
      {@const projectTasks = tasks.filter(t => t.project === project.id)}
      {@const counts = {
        running: projectTasks.filter(t => t.status === 'running').length,
        review: projectTasks.filter(t => t.status === 'review').length,
        total: projectTasks.length,
      }}
      <div class="pos-card pos-project-card" style="background-color: hsl({getHue(project.createdAt, range, minTime)}, 70%, 90%);">
        <div class="pos-card-name">{project.name}</div>
        {#if project.description}
          <div class="pos-card-desc">{project.description}</div>
        {/if}
        <!-- Reactivity forced by passing `now` -->
        <div class="pos-age">{formatAge(project.createdAt, now)}</div>
        
        <div class="pos-card-meta">
          <span>{counts.total} tasks</span>
          {#if counts.running > 0}<span>{counts.running} running</span>{/if}
          {#if counts.review > 0}<span>{counts.review} done</span>{/if}
        </div>

        <div class="pos-card-acts">
          <button on:click={() => onSelect(project.id, 'elastic')}>Open</button>
          <button on:click={() => onSelect(project.id, 'deadlines')}>Deadlines</button>
          <button class="pos-del" on:click={() => archiveProject(project.id)}>Archive</button>
        </div>
      </div>
    {/each}
  </div>
{/if}
