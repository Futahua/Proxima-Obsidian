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

  let showArchived = false;

  $: displayProjects = $projectsStore.filter(p => showArchived ? p.status === 'archived' : p.status === 'active');
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
    if (confirm('Delete project and ALL its child tasks? This will permanently delete the Markdown files of all tasks inside this project.')) {
      const file = app.vault.getAbstractFileByPath(`projects/${id}.md`) || app.vault.getAbstractFileByPath(`projects/${id}/index.md`);
      if (file) {
        await app.vault.delete(file);
        
        // Unlink all tasks belonging to this project
        const linked = tasks.filter(t => t.project === id);
        for (const t of linked) {
          await fileManager.deleteTask(t.id);
        }
        
        await fileManager.loadAll();
        new Notice('Project deleted.');
      }
    }
  }

  async function handleArchiveProject(id: string) {
    if (confirm('Archive this project?')) {
      await fileManager.archiveProject(id);
      new Notice('Project archived.');
    }
  }

  async function handleUnarchiveProject(id: string) {
    if (confirm('Restore this project to active status?')) {
      await fileManager.unarchiveProject(id);
      new Notice('Project restored.');
    }
  }

  function handleSelectProject(id: string) {
    if (isFullPage) {
      onSelect(id, 'elastic');
    } else {
      plugin.activateWorkspaceView(id);
    }
  }

  $: allTimes = displayProjects.map(p => new Date(p.createdAt).getTime());
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
    
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <p class="pos-subtitle" style="margin-bottom: 0;">Select or create a workspace to manage project notes and tasks modularly in a central tab.</p>
      
      <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.9em;">
        <input type="checkbox" bind:checked={showArchived} />
        <span>Show Archived Projects</span>
      </label>
    </div>

    <div class="pos-project-list">
      {#if displayProjects.length === 0}
        <p class="pos-empty">{showArchived ? 'No archived projects.' : 'No active projects yet. Click "+ New Project" above to build your first project workspace!'}</p>
      {:else}
        {#each displayProjects as p (p.id)}
          {@const pTasks = tasks.filter(t => t.project === p.id)}
          {@const total = pTasks.length}
          {@const completed = pTasks.filter(t => t.status === 'review').length}
          {@const running = pTasks.filter(t => t.status === 'running').length}
          {@const overdue = pTasks.filter(t => t.status !== 'review' && t.deadline && new Date(t.deadline).getTime() < now).length}
          {@const activeCount = pTasks.filter(t => t.status !== 'review').length}
          {@const highPriority = pTasks.filter(t => t.status !== 'review' && t.properties && t.properties['priority'] === '1').length}
          {@const futureDeadlines = pTasks.filter(t => t.status !== 'review' && t.deadline && new Date(t.deadline).getTime() > now).map(t => new Date(t.deadline || '').getTime())}
          {@const nearestDeadline = futureDeadlines.length > 0 ? Math.min(...futureDeadlines) : null}
          {@const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0}
          
          <div class="pos-card pos-project-card" style="background-color: hsl({showArchived ? '0, 0%, 90%' : getHue(p.createdAt, range, minTime) + ', 70%, 90%'});">
            <div class="pos-card-name" on:click={() => handleSelectProject(p.id)} style="cursor: pointer; font-weight: bold; font-size: 1.15em;">
              {p.name}
              {#if showArchived}<span style="font-size: 0.7em; margin-left: 8px; padding: 2px 6px; background: rgba(0,0,0,0.1); border-radius: 4px;">ARCHIVED</span>{/if}
            </div>
            {#if p.description}
              <div class="pos-card-desc">{p.description}</div>
            {/if}
            <div class="pos-age">Age: {formatAge(p.createdAt, now)}</div>
            
            <div class="pos-card-meta" style="display: flex; flex-direction: column; gap: 8px; margin-top: 12px;">
              <div style="display: flex; align-items: center; gap: 12px; font-weight: 600;">
                <span title="Total Tasks">{total} Tasks</span>
                <span title="Completion">✅ {completionPct}%</span>
                {#if overdue > 0}<span title="Overdue Tasks" style="color: #dc3545;">⚠️ {overdue} Overdue</span>{/if}
                {#if highPriority > 0}<span title="High Priority Tasks" style="color: #ff6b6b;">🔥 {highPriority} P1</span>{/if}
              </div>
              <div style="font-size: 0.9em; opacity: 0.8;">
                {#if nearestDeadline}
                  Next Deadline: {new Date(nearestDeadline).toLocaleDateString()}
                {:else}
                  No upcoming deadlines
                {/if}
              </div>
              <div style="width: 100%; height: 6px; background: rgba(0,0,0,0.1); border-radius: 3px; overflow: hidden; margin-top: 4px;">
                <div style="height: 100%; width: {completionPct}%; background: #28a745; transition: width 0.3s;"></div>
              </div>
            </div>

            <div class="pos-card-acts" style="margin-top: 16px; display: flex; gap: 8px; flex-wrap: wrap;">
              <button class="pos-ptc-start-btn" on:click={() => handleSelectProject(p.id)}>Open Workspace</button>
              {#if !showArchived}
                <button on:click={() => handleArchiveProject(p.id)} title="Archive project">Archive</button>
              {:else}
                <button on:click={() => handleUnarchiveProject(p.id)} title="Restore project">Restore</button>
              {/if}
              <button class="pos-del" on:click={() => handleDeleteProject(p.id)} title="Delete project">Delete</button>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>

