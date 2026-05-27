<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { App as ObsidianApp, Notice } from 'obsidian';
  import type { FileManager } from '../../data/FileManager';
  import { projectsStore, tasksStore } from '../../stores/data';
  import { formatAge } from '../../utils';
  import { NewProjectModal } from '../../modals/Modals';

  export let app;
  export let fileManager: FileManager;
  export let plugin;
  export let onSelect: (id: string, view: 'elastic' | 'deadlines') => void;

  $: activeProjects = $projectsStore.filter(p => p.status === 'active');
  $: tasks = $tasksStore;

  let timer: number;
  let now = Date.now();

  // Notion-like Modular Config States (Persistent)
  let showDesc = true;
  let showAge = true;
  let showStats = true;
  let showHeatmap = true;
  let sortBy: 'name' | 'createdAt' | 'tasks' | 'activeTasks' = 'createdAt';
  let sortOrder: 'asc' | 'desc' = 'desc';
  let searchQuery = '';

  onMount(() => {
    timer = window.setInterval(() => { now = Date.now(); }, 60000); // refresh age strings every minute
    
    // Load config from localStorage
    try {
      const saved = localStorage.getItem('pos-dashboard-config');
      if (saved) {
        const config = JSON.parse(saved);
        showDesc = config.showDesc !== undefined ? config.showDesc : true;
        showAge = config.showAge !== undefined ? config.showAge : true;
        showStats = config.showStats !== undefined ? config.showStats : true;
        showHeatmap = config.showHeatmap !== undefined ? config.showHeatmap : true;
        sortBy = config.sortBy || 'createdAt';
        sortOrder = config.sortOrder || 'desc';
      }
    } catch (e) {
      console.error('Failed to load dashboard configuration:', e);
    }
  });

  onDestroy(() => {
    window.clearInterval(timer);
  });

  function saveConfig() {
    try {
      localStorage.setItem('pos-dashboard-config', JSON.stringify({
        showDesc, showAge, showStats, showHeatmap, sortBy, sortOrder
      }));
    } catch (e) {
      console.error('Failed to save dashboard configuration:', e);
    }
  }

  function getHue(createdAt: string, range: number, minTime: number) {
    const tMs = new Date(createdAt).getTime();
    const ratio = range > 1 ? (tMs - minTime) / range : 0;
    // 0 is red (oldest), 120 is green (newest)
    return 120 * ratio;
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
      new Notice('Project created successfully!');
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
        new Notice('Project archived.');
      }
    }
  }

  function handleOpenWorkspace(projectId: string) {
    plugin.activateWorkspaceView(projectId);
  }

  $: allTimes = activeProjects.map(p => new Date(p.createdAt).getTime());
  $: minTime = Math.min(...allTimes);
  $: maxTime = Math.max(...allTimes);
  $: range = maxTime - minTime || 1;

  // Reactive task counts per project
  $: projectCounts = $projectsStore.reduce((acc, p) => {
    const pTasks = tasks.filter(t => t.project === p.id);
    acc[p.id] = {
      running: pTasks.filter(t => t.status === 'running').length,
      review: pTasks.filter(t => t.status === 'review').length,
      total: pTasks.length
    };
    return acc;
  }, {} as Record<string, { running: number; review: number; total: number }>);

  // Search filter
  $: filteredProjects = activeProjects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Reactive sorting
  $: sortedProjects = [...filteredProjects].sort((a, b) => {
    let valA: any;
    let valB: any;

    if (sortBy === 'name') {
      valA = a.name.toLowerCase();
      valB = b.name.toLowerCase();
    } else if (sortBy === 'createdAt') {
      valA = new Date(a.createdAt).getTime();
      valB = new Date(b.createdAt).getTime();
    } else if (sortBy === 'tasks') {
      valA = projectCounts[a.id]?.total || 0;
      valB = projectCounts[b.id]?.total || 0;
    } else if (sortBy === 'activeTasks') {
      valA = projectCounts[a.id]?.running || 0;
      valB = projectCounts[b.id]?.running || 0;
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
</script>

<!-- MODULAR TOOLBAR -->
<div class="pos-dashboard-toolbar">
  <div class="pos-dt-search-row">
    <input 
      type="text" 
      placeholder="Search projects..." 
      bind:value={searchQuery} 
      class="pos-dt-search-input" 
    />
    <button class="pos-newtask-btn" on:click={createProject}>+ New Project</button>
  </div>
  
  <div class="pos-dt-controls">
    <!-- Notion Property Toggles -->
    <div class="pos-dt-group">
      <span class="pos-dt-label">Properties:</span>
      <label class="pos-dt-toggle">
        <input type="checkbox" bind:checked={showDesc} on:change={saveConfig} />
        <span>Description</span>
      </label>
      <label class="pos-dt-toggle">
        <input type="checkbox" bind:checked={showAge} on:change={saveConfig} />
        <span>Age</span>
      </label>
      <label class="pos-dt-toggle">
        <input type="checkbox" bind:checked={showStats} on:change={saveConfig} />
        <span>Stats</span>
      </label>
      <label class="pos-dt-toggle">
        <input type="checkbox" bind:checked={showHeatmap} on:change={saveConfig} />
        <span>Heatmap</span>
      </label>
    </div>
    
    <!-- Sorting -->
    <div class="pos-dt-group">
      <span class="pos-dt-label">Sort:</span>
      <select bind:value={sortBy} on:change={saveConfig} class="pos-dt-select">
        <option value="name">Name</option>
        <option value="createdAt">Date Created</option>
        <option value="tasks">Total Tasks</option>
        <option value="activeTasks">Active Tasks</option>
      </select>
      <button 
        class="pos-dt-order-btn" 
        on:click={() => { sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'; saveConfig(); }}
        title="Toggle sort direction"
      >
        {sortOrder === 'asc' ? '▲' : '▼'}
      </button>
    </div>
  </div>
</div>

{#if sortedProjects.length === 0}
  <p class="pos-empty">No projects match your filters or dashboard parameters.</p>
{:else}
  <div class="pos-project-list">
    {#each sortedProjects as project (project.id)}
      {@const counts = projectCounts[project.id] || { running: 0, review: 0, total: 0 }}
      <div 
        class="pos-card pos-project-card" 
        style={showHeatmap ? `border-left: 4px solid hsl(${getHue(project.createdAt, range, minTime)}, 75%, 50%) !important;` : ''}
      >
        <div class="pos-card-name" on:click={() => handleOpenWorkspace(project.id)}>{project.name}</div>
        
        {#if showDesc && project.description}
          <div class="pos-card-desc">{project.description}</div>
        {/if}
        
        {#if showAge}
          <div class="pos-age">Age: {formatAge(project.createdAt, now)}</div>
        {/if}
        
        {#if showStats}
          <div class="pos-card-meta">
            <span>{counts.total} tasks</span>
            {#if counts.running > 0}
              <span class="pos-pwc-active-badge" style="font-size: 1em; padding: 1px 6px;">{counts.running} active</span>
            {/if}
            {#if counts.review > 0}<span>{counts.review} completed</span>{/if}
          </div>
        {/if}

        <div class="pos-card-acts" style="margin-top: 10px;">
          <button class="pos-ptc-start-btn" on:click={() => handleOpenWorkspace(project.id)}>Workspace</button>
          <button on:click={() => onSelect(project.id, 'elastic')}>Elastic</button>
          <button on:click={() => onSelect(project.id, 'deadlines')}>Deadlines</button>
          <button class="pos-del" on:click={() => archiveProject(project.id)}>Archive</button>
        </div>
      </div>
    {/each}
  </div>
{/if}
