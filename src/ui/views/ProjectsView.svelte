<script lang="ts">
  import { App as ObsidianApp, TFile, Notice } from 'obsidian';
  import type { FileManager } from '../../data/FileManager';
  import { projectsStore, tasksStore } from '../../stores/data';
  import { EditTaskModal } from '../../modals/Modals';
  import type { ProjectData, TaskData, TaskStatus } from '../../types';
  
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

  // Planned task form states (inline in Note editor sidebar)
  let newTaskName = '';
  let newTaskDesc = '';
  let newTaskWeight = 1;

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

  // Sort tasks for the sidebar checklist: running first, then backlog, then planned, then review
  $: sortedSidebarTasks = [...projectTasks].sort((a, b) => {
    if (a.status === 'review' && b.status !== 'review') return 1;
    if (a.status !== 'review' && b.status === 'review') return -1;
    if (a.status === 'running' && b.status !== 'running') return -1;
    if (a.status !== 'running' && b.status === 'running') return 1;
    if (a.status === 'backlog' && b.status === 'planned') return -1;
    if (a.status === 'planned' && b.status === 'backlog') return 1;
    return a.orderIndex - b.orderIndex || a.name.localeCompare(b.name);
  });

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

  // Quick toggle status inside the sidebar checklist card using standard state routing
  async function handleToggleTaskCheckbox(task: TaskData) {
    if (task.status === 'planned') {
      await fileManager.updateTask(task.id, { status: 'backlog', isCompleted: false });
    } else if (task.status === 'backlog') {
      await fileManager.updateTask(task.id, { status: 'planned', isCompleted: false });
    } else if (task.status === 'running') {
      await fileManager.updateTask(task.id, { status: 'review', isCompleted: true });
    } else if (task.status === 'review') {
      await fileManager.updateTask(task.id, { status: 'running', isCompleted: false });
    }
  }

  async function handleStartTask(task: TaskData) {
    await fileManager.updateTask(task.id, { status: 'running', isCompleted: false });
  }

  function handleEditTask(task: TaskData) {
    new EditTaskModal(app, task, async (updates) => {
      await fileManager.updateTask(task.id, updates);
    }).open();
  }

  async function handleDeleteTask(taskId: string) {
    if (confirm('Permanently delete this task?')) {
      await fileManager.deleteTask(taskId);
      new Notice('Task deleted');
    }
  }

  async function handlePlanTask() {
    const name = newTaskName.trim();
    if (!name || !selectedProject) return;

    await fileManager.createTask({
      name,
      description: newTaskDesc.trim() || `From ${selectedProject.name}`,
      project: selectedProject.id,
      status: 'planned',
      weight: Math.max(1, newTaskWeight)
    });

    newTaskName = '';
    newTaskDesc = '';
    newTaskWeight = 1;
    new Notice('Task planned!');
  }

  function openTaskFile(taskId: string) {
    const file = app.vault.getAbstractFileByPath(`tasks/${taskId}.md`);
    if (file instanceof TFile) {
      app.workspace.getLeaf().openFile(file);
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
        <!-- 📄 NOTES VIEW (EDITOR + FULL PLANNED CHEKLIST SIDEBAR) -->
        <div class="pos-project-split-workspace">
          <!-- Text Editor -->
          <div class="pos-editor-pane">
            <textarea 
              class="pos-markdown-textarea" 
              bind:value={projectContent} 
              on:keydown={handleKeyDown} 
              placeholder="Write your project details, research notes, and action plans here using standard markdown..."
              spellcheck="false"
            />
          </div>

          <!-- Beautiful Scrollable Task planning & Checklist Sidebar -->
          <aside class="pos-tasks-sidebar">
            <div class="pos-sidebar-header">
              <h4>Project Tasks ({projectTasks.length})</h4>
              <button 
                class="pos-sidebar-link-btn" 
                on:click={() => projectTab = 'board'}
              >
                Manage Board →
              </button>
            </div>
            
            <!-- Quick Plan Task Form -->
            <div class="pos-sidebar-add-task">
              <form on:submit|preventDefault={handlePlanTask} class="pos-planned-task-form">
                <input 
                  type="text" 
                  placeholder="Plan task name..." 
                  bind:value={newTaskName} 
                  class="pos-modal-input" 
                  required
                />
                <textarea 
                  placeholder="Task description (optional)..." 
                  bind:value={newTaskDesc} 
                  class="pos-modal-textarea pos-desc-textarea"
                />
                <div class="pos-sidebar-form-row">
                  <label class="pos-weight-label">
                    Weight:
                    <input 
                      type="number" 
                      min="1" 
                      bind:value={newTaskWeight} 
                      class="pos-modal-number" 
                    />
                  </label>
                  <button type="submit" class="pos-modal-primary pos-plan-task-btn">+ Plan Task</button>
                </div>
              </form>
            </div>
            
            <!-- Vertical Scrollable Task Cards -->
            <div class="pos-sidebar-task-list scrollable">
              {#if sortedSidebarTasks.length === 0}
                <p class="pos-empty-small">No tasks created yet. Plan one using the form above!</p>
              {:else}
                {#each sortedSidebarTasks as task (task.id)}
                  <div class="pos-project-task-card" class:completed={task.status === 'review'}>
                    <div class="pos-ptc-header">
                      <input 
                        type="checkbox" 
                        checked={task.status === 'review' || task.status === 'backlog'} 
                        on:change={() => handleToggleTaskCheckbox(task)} 
                        class="pos-task-checkbox"
                        title="Toggle task state"
                      />
                      <div class="pos-ptc-body">
                        <div 
                          class="pos-ptc-name" 
                          class:completed={task.status === 'review'}
                          on:click={() => openTaskFile(task.id)}
                        >
                          {task.name}
                        </div>
                        {#if task.description}
                          <div class="pos-ptc-desc">{task.description}</div>
                        {/if}
                        <div class="pos-ptc-meta">
                          <span class="pos-ptc-status-badge {task.status}">{task.status}</span>
                          <span>W:{task.weight}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="pos-ptc-acts">
                      {#if task.status === 'planned'}
                        <button class="pos-ptc-add-btn" on:click={() => handleToggleTaskCheckbox(task)}>Activate</button>
                      {:else if task.status === 'backlog'}
                        <button class="pos-ptc-start-btn" on:click={() => handleStartTask(task)}>Start</button>
                      {/if}
                      <button on:click={() => handleEditTask(task)}>Edit</button>
                      <button class="pos-del" on:click={() => handleDeleteTask(task.id)}>Delete</button>
                    </div>
                  </div>
                {/each}
              {/if}
            </div>
          </aside>
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
