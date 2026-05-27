<script lang="ts">
  import { App as ObsidianApp, Notice, MarkdownRenderer } from 'obsidian';
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
  let previewEl: HTMLElement;

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

  // Reactive Markdown Compiler
  $: {
    if (previewEl && projectContent !== undefined && selectedProject) {
      previewEl.empty();
      MarkdownRenderer.renderMarkdown(
        projectContent,
        previewEl,
        `projects/${selectedProject.id}.md`,
        plugin
      );
    }
  }

  function handleOpenNoteNatively() {
    if (!selectedProject) return;
    const file = app.vault.getAbstractFileByPath(`projects/${selectedProject.id}.md`);
    if (file) {
      app.workspace.getLeaf('tab').openFile(file as any);
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

      <div style="width: 100px;"></div>
    </header>

    <!-- CONTENT DISPATCHER -->
    <div class="pos-project-workspace-body">
      {#if projectTab === 'notes'}
        <!-- 📄 NOTES VIEW (NATIVE EMBEDDED MIRROR PREVIEW & EDIT ACTION) -->
        <div class="pos-project-split-workspace" style="flex-direction: column; height: 100%;">
          <div class="pos-native-note-bar" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; background: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-bottom: none; border-radius: 8px 8px 0 0; flex-shrink: 0;">
            <span style="font-weight: 700; font-size: 0.85em; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 6px;">
              📄 Note Preview
            </span>
            <button class="pos-modal-primary" on:click={handleOpenNoteNatively} style="padding: 4px 12px; font-size: 0.85em; font-weight: 600;">
              Edit Note Natively ↗
            </button>
          </div>
          
          <div class="pos-editor-pane" style="border-radius: 0 0 8px 8px; flex: 1; min-height: 0; display: flex; flex-direction: column; overflow: hidden; background: var(--background-primary);">
            <div style="flex: 1; overflow-y: auto; padding: 24px; min-height: 0;">
              <div bind:this={previewEl} class="markdown-preview-view markdown-rendered" style="color: var(--text-normal); line-height: 1.6; font-family: var(--font-interface); height: 100%;"></div>
            </div>
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
