<script lang="ts">
  import { App as ObsidianApp, Notice } from 'obsidian';
  import type { FileManager } from '../../data/FileManager';
  import { projectsStore, tasksStore } from '../../stores/data';
  import type { ProjectData } from '../../types';
  
  import ProjectTaskBoard from './components/ProjectTaskBoard.svelte';
  import ProjectTaskGrid from './components/ProjectTaskGrid.svelte';
  import ProjectsHub from './AgingView.svelte'; // Imported the unified dashboard selector

  export let app;
  export let fileManager: FileManager;
  export let plugin;
  export let selectedProjectId: string | null = null;

  $: activeProjects = $projectsStore.filter(p => p.status === 'active');

  let selectedProject: ProjectData | null = null;
  let projectContent = '';
  let isSaving = false;

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
</script>

{#if !selectedProject}
  <!-- UNIFIED DASHBOARD SELECTOR IN FULL-PAGE MODE -->
  <ProjectsHub 
    {app} 
    {fileManager} 
    {plugin} 
    isFullPage={true} 
    onSelect={(id, m) => { selectedProjectId = id; }} 
  />
{:else}
  <!-- SELECTED PROJECT HUB -->
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
        <!-- 📄 NOTES VIEW (EDITOR ONLY - SPACIOUS SPLIT OPTIMIZED) -->
        <div class="pos-project-split-workspace">
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
      {:else}
        {@const projectTasks = $tasksStore.filter(t => t.project === selectedProject.id).sort((a, b) => a.orderIndex - b.orderIndex)}
        {#if projectTab === 'board'}
          <!-- 📋 TASK BOARD VIEW (KANBAN) -->
          <ProjectTaskBoard 
            {app} 
            {fileManager} 
            projectId={selectedProject.id} 
            {projectTasks} 
          />
        {:else}
          <!-- 📊 BACKLOG GRID VIEW (SPREADSHEET) -->
          <ProjectTaskGrid 
            {app} 
            {fileManager} 
            projectId={selectedProject.id} 
            {projectTasks} 
          />
        {/if}
      {/if}
    </div>
  </div>
{/if}
