<script lang="ts">
  import { App as ObsidianApp, Notice } from 'obsidian';
  import type { FileManager } from '../../data/FileManager';
  import { projectsStore, tasksStore } from '../../stores/data';
  import type { ProjectData } from '../../types';

  export let app;
  export let fileManager: FileManager;
  export let plugin;
  export let isFullPage = false;
  export let onSelect: (id: string, view: 'elastic' | 'deadlines') => void;

  $: activeProjects = $projectsStore.filter(p => p.status === 'active');
  $: tasks = $tasksStore;

  let newProjectName = '';

  async function handleCreateProject() {
    const name = newProjectName.trim();
    if (!name) return;
    const id = `proj-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
    const fm = { 
      type: 'project', 
      name, 
      description: '', 
      createdAt: new Date().toISOString(), 
      status: 'active' 
    };
    const content = '---\n' + Object.entries(fm).map(([k,v]) => `${k}: ${v}`).join('\n') + '\n---\n';
    await app.vault.create(`projects/${id}.md`, content);
    newProjectName = '';
    await fileManager.loadAll();
    
    if (isFullPage) {
      onSelect(id, 'elastic'); // Open project reactively in central tab
    } else {
      plugin.activateWorkspaceView(id); // Launch central tab from sidebar list
    }
    new Notice('Project created successfully!');
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
</script>

<div class="pos-projects-selection-layout">
  <div class="pos-projects-central-pane">
    <h2 class="pos-workspace-title">Projects Hub</h2>
    <p class="pos-subtitle">Select or create a workspace to manage project notes and tasks modularly in a central tab.</p>
    
    <form on:submit|preventDefault={handleCreateProject} class="pos-create-project-form">
      <input 
        type="text" 
        placeholder="Enter new project name..." 
        bind:value={newProjectName} 
        class="pos-modal-input pos-newproject-input" 
      />
      <button type="submit" class="pos-modal-primary pos-createproject-btn">+ Create Project</button>
    </form>

    <div class="pos-project-list-cards">
      {#if activeProjects.length === 0}
        <p class="pos-empty">No projects yet. Type a name above to build your first project workspace!</p>
      {:else}
        {#each activeProjects as p (p.id)}
          {@const pTasksCount = tasks.filter(t => t.project === p.id).length}
          {@const pActiveCount = tasks.filter(t => t.project === p.id && t.status !== 'planned' && t.status !== 'review').length}
          <div class="pos-project-workspace-card">
            <div class="pos-pwc-info" on:click={() => handleSelectProject(p.id)}>
              <div class="pos-pwc-name">{p.name}</div>
              <div class="pos-pwc-meta">
                <span>{pTasksCount} total tasks</span>
                {#if pActiveCount > 0}
                  <span class="pos-pwc-active-badge">{pActiveCount} active</span>
                {/if}
              </div>
            </div>
            <div class="pos-pwc-actions">
              <button 
                class="pos-modal-primary pos-open-ws-btn" 
                on:click={() => handleSelectProject(p.id)}
              >
                Open Workspace
              </button>
              <button 
                class="pos-del pos-del-project-btn" 
                on:click={() => handleDeleteProject(p.id)}
                title="Delete project"
              >
                Delete
              </button>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>
