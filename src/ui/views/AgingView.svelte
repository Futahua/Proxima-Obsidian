<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { App as ObsidianApp, Notice } from 'obsidian';
  import type { FileManager } from '../../data/FileManager';
  import { projectsStore, tasksStore } from '../../stores/data';
  import type { ProjectData } from '../../types';
  import { formatAge } from '../../utils';
  import { NewProjectModal } from '../../modals/Modals';

  export let app;
  export let fileManager: FileManager;
  export let plugin;
  export let isFullPage = false;
  export let onSelect: (id: string, view: 'elastic' | 'deadlines') => void;

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

  function handleCreateProject() {
    new NewProjectModal(app, async (name, desc) => {
      const id = `proj-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
      const fm = { 
        type: 'project', 
        name, 
        description: desc || '', 
        createdAt: new Date().toISOString(), 
        status: 'active' 
      };
      const content = '---\n' + Object.entries(fm).map(([k,v]) => `${k}: ${v}`).join('\n') + '\n---\n\n# ' + name + '\n';
      
      // Create project in subfolder convention: projects/{id}/index.md
      await fileManager.ensureFolder(`projects/${id}`);
      await app.vault.create(`projects/${id}/index.md`, content);
      await fileManager.loadAll();
      
      if (isFullPage) {
        onSelect(id, 'elastic'); // Open project reactively in central tab
      } else {
        plugin.activateWorkspaceView(id); // Launch central tab from sidebar list
      }
      new Notice('Project created successfully!');
    }).open();
  }

  async function handleDeleteProject(id: string) {
    if (confirm('Delete project and its Markdown file? Tasks remain but will be uncategorized.')) {
      const file = app.vault.getAbstractFileByPath(`projects/${id}.md`);
      if (file) {
        await app.vault.delete(file);
        
        // Unlink all tasks belonging to this project
        const linked = tasks.filter(t => t.project === id);
        for (const t of linked) {
          await fileManager.updateTask(t.id, { project: null });
        }
        
        await fileManager.loadAll();
        new Notice('Project deleted.');
      }
    }
  }

  function handleSelectProject(id: string) {
    if (isFullPage) {
      onSelect(id, 'elastic');
    } else {
      plugin.activateWorkspaceView(id);
    }
  }

  $: allTimes = activeProjects.map(p => new Date(p.createdAt).getTime());
  $: minTime = Math.min(...allTimes);
  $: maxTime = Math.max(...allTimes);
  $: range = maxTime - minTime || 1;
</script>

<div class="pos-projects-selection-layout">
  <div class="pos-projects-central-pane">
    <div class="pos-workspace-header-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
      <h2 class="pos-workspace-title" style="margin: 0;">Projects Hub</h2>
      <button class="pos-modal-primary pos-create-new-project-btn" on:click={handleCreateProject}>
        + New Project
      </button>
    </div>
    
    <p class="pos-subtitle">Select or create a workspace to manage project notes and tasks modularly in a central tab.</p>

    <div class="pos-project-list">
      {#if activeProjects.length === 0}
        <p class="pos-empty">No projects yet. Click "+ New Project" above to build your first project workspace!</p>
      {:else}
        {#each activeProjects as p (p.id)}
          {@const pTasks = tasks.filter(t => t.project === p.id)}
          {@const counts = {
            running: pTasks.filter(t => t.status === 'running').length,
            review: pTasks.filter(t => t.status === 'review').length,
            total: pTasks.length,
          }}
          <div class="pos-card pos-project-card" style="background-color: hsl({getHue(p.createdAt, range, minTime)}, 70%, 90%);">
            <div class="pos-card-name" on:click={() => handleSelectProject(p.id)} style="cursor: pointer; font-weight: bold; font-size: 1.15em;">
              {p.name}
            </div>
            {#if p.description}
              <div class="pos-card-desc">{p.description}</div>
            {/if}
            <div class="pos-age">Age: {formatAge(p.createdAt, now)}</div>
            
            <div class="pos-card-meta">
              <span>{counts.total} tasks</span>
              {#if counts.running > 0}
                <span class="pos-pwc-active-badge" style="background: rgba(167, 201, 87, 0.4); color: #101010; border: 1px solid rgba(0,0,0,0.1); font-size: 0.9em; padding: 1px 6px;">
                  {counts.running} active
                </span>
              {/if}
              {#if counts.review > 0}<span>{counts.review} completed</span>{/if}
            </div>

            <div class="pos-card-acts" style="margin-top: 12px; display: flex; gap: 6px; flex-wrap: wrap;">
              <button class="pos-ptc-start-btn" on:click={() => handleSelectProject(p.id)}>Workspace</button>
              <button class="pos-del" on:click={() => handleDeleteProject(p.id)} title="Delete project">Delete</button>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>

