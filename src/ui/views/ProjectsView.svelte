<script lang="ts">
  import { App as ObsidianApp, Notice } from 'obsidian';
  import type { FileManager } from '../../data/FileManager';
  import { projectsStore, tasksStore } from '../../stores/data';
  import type { ProjectData } from '../../types';
  
  import ProjectTaskBoard from './components/ProjectTaskBoard.svelte';
  import ProjectTaskGrid from './components/ProjectTaskGrid.svelte';

  export let app;
  export let fileManager: FileManager;
  export let plugin;
  export let isFullPage = false;
  export let selectedProjectId: string | null = null;

  $: activeProjects = $projectsStore.filter(p => p.status === 'active');
  $: tasks = $tasksStore;

  let selectedProject: ProjectData | null = null;
  let projectContent = '';
  let isSaving = false;

  let newProjectName = '';
  let projectTab: 'notes' | 'board' | 'grid' = 'notes';

  $: {
    if (selectedProjectId) {
      const proj = activeProjects.find(p => p.id === selectedProjectId);
      if (proj) {
        selectedProject = proj;
        loadProjectContent(selectedProjectId);
      } else {
        selectedProject = null;
        projectContent = '';
      }
    } else {
      selectedProject = null;
      projectContent = '';
      projectTab = 'notes';
    }
  }

  // Filter tasks belonging to the current project
  $: projectTasks = selectedProject
    ? tasks.filter(t => t.project === selectedProject.id).sort((a, b) => a.orderIndex - b.orderIndex)
    : [];

  async function loadProjectContent(id: string) {
    projectContent = await fileManager.getProjectContent(id);
  }

  async function handleSaveProject() {
    if (!selectedProject) return;
    isSaving = true;
    try {
      await fileManager.saveProjectContent(selectedProject.id, projectContent);
      new Notice('Project saved successfully!');
    } catch (e) {
      new Notice('Failed to save project: ' + e.message);
    } finally {
      isSaving = false;
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSaveProject();
    }
  }

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
      selectedProjectId = id;
    } else {
      plugin.activateWorkspaceView(id);
    }
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
        
        if (selectedProjectId === id) {
          selectedProjectId = null;
        }
        await fileManager.loadAll();
      }
    }
  }

  function handleSelectProject(id: string) {
    if (isFullPage) {
      selectedProjectId = id;
    } else {
      plugin.activateWorkspaceView(id);
    }
  }
</script>

{#if !selectedProject || !isFullPage}
  <!-- NO PROJECT SELECTED (LIST PROJECTS) OR IN SIDEBAR LAUNCHER MODE -->
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
{:else}
  <!-- SELECTED PROJECT HUB (FULL-PAGE MODE ONLY) -->
  <div class="pos-project-full-workspace">
    <!-- SUB-TABS NAVIGATION HEADER -->
    <header class="pos-editor-header">
      <div class="pos-editor-header-left">
        <button class="pos-back-btn" on:click={() => selectedProjectId = null}>
          ← Back
        </button>
        <div class="pos-editor-project-title">
          <h3>{selectedProject.name}</h3>
          <span class="pos-editor-project-file">{selectedProject.id}.md</span>
        </div>
      </div>
      
      <!-- sub-tabs -->
      <div class="pos-editor-header-tabs">
        <button 
          class="pos-tab-btn" 
          class:active={projectTab === 'notes'} 
          on:click={() => projectTab = 'notes'}
        >
          📄 Notes
        </button>
        <button 
          class="pos-tab-btn" 
          class:active={projectTab === 'board'} 
          on:click={() => projectTab = 'board'}
        >
          📋 Task Board
        </button>
        <button 
          class="pos-tab-btn" 
          class:active={projectTab === 'grid'} 
          on:click={() => projectTab = 'grid'}
        >
          📊 Backlog Grid
        </button>
      </div>

      {#if projectTab === 'notes'}
        <button 
          class="pos-save-btn" 
          class:saving={isSaving} 
          on:click={handleSaveProject}
        >
          {isSaving ? 'Saving...' : 'Save (Ctrl+S)'}
        </button>
      {:else}
        <div style="width: 100px;"></div>
      {/if}
    </header>

    <!-- CONTENT DISPATCHER -->
    <div class="pos-project-workspace-body">
      {#if projectTab === 'notes'}
        <!-- 📄 NOTES VIEW (EDITOR ONLY - SIDEBAR DISCARDED FOR EXCALIDRAW INTEGRATION PREP) -->
        <div class="pos-project-split-workspace">
          <!-- Text Editor (Now takes up full space cleanly) -->
          <div class="pos-editor-pane">
            <textarea 
              class="pos-markdown-textarea" 
              bind:value={projectContent} 
              on:keydown={handleKeyDown} 
              placeholder="Write your project details, research notes, and action plans here using standard markdown..."
              spellcheck="false"
            />
          </div>
        </div>
      {:else if projectTab === 'board'}
        <!-- 📋 TASK BOARD VIEW (KANBAN) -->
        <ProjectTaskBoard 
          {app} 
          {fileManager} 
          projectId={selectedProject.id} 
          {projectTasks} 
        />
      {:else if projectTab === 'grid'}
        <!-- 📊 BACKLOG GRID VIEW (SPREADSHEET) -->
        <ProjectTaskGrid 
          {app} 
          {fileManager} 
          projectId={selectedProject.id} 
          {projectTasks} 
        />
      {/if}
    </div>
  </div>
{/if}
