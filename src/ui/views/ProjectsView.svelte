<script lang="ts">
  import { App as ObsidianApp, Notice, MarkdownRenderer, TFile } from 'obsidian';
  import type { FileManager } from '../../data/FileManager';
  import type { ProjectFileInfo } from '../../data/FileManager';
  import { projectsStore, tasksStore } from '../../stores/data';
  import type { ProjectData } from '../../types';
  
  import ProjectTaskBoard from './components/ProjectTaskBoard.svelte';
  import ProjectTaskGrid from './components/ProjectTaskGrid.svelte';
  import ProjectDeadlines from './components/ProjectDeadlines.svelte';
  import ProjectsHub from './AgingView.svelte';

  export let app;
  export let fileManager: FileManager;
  export let plugin;
  export let selectedProjectId: string | null = null;

  $: activeProjects = $projectsStore.filter(p => p.status === 'active');

  let selectedProject: ProjectData | null = null;
  let projectContent = '';
  let previewEl: HTMLElement;
  let projectFiles: ProjectFileInfo[] = [];
  let showNewFileMenu = false;

  let projectTab: 'notes' | 'board' | 'grid' | 'deadlines' = 'notes';

  $: {
    if (selectedProjectId) {
      const proj = activeProjects.find(p => p.id === selectedProjectId);
      if (proj) {
        selectedProject = proj;
        loadProjectContent(selectedProjectId);
        refreshProjectFiles(selectedProjectId);
      } else {
        selectedProject = null;
        projectContent = '';
        projectFiles = [];
      }
    } else {
      selectedProject = null;
      projectContent = '';
      projectTab = 'notes';
      projectFiles = [];
    }
  }

  async function loadProjectContent(id: string) {
    projectContent = await fileManager.getProjectContent(id);
  }

  function refreshProjectFiles(id: string) {
    projectFiles = fileManager.getProjectFiles(id);
  }

  // Reactive Markdown Compiler
  $: {
    if (previewEl && projectContent !== undefined && selectedProject) {
      previewEl.empty();
      MarkdownRenderer.renderMarkdown(
        projectContent,
        previewEl,
        fileManager.resolveProjectNotePath(selectedProject.id) || `projects/${selectedProject.id}.md`,
        plugin
      );
    }
  }

  function handleOpenNoteNatively() {
    if (!selectedProject) return;
    const file = fileManager.getProjectNoteFile(selectedProject.id);
    if (file) {
      app.workspace.getLeaf('tab').openFile(file);
    }
  }

  function openFile(filePath: string) {
    const file = app.vault.getAbstractFileByPath(filePath);
    if (file instanceof TFile) {
      app.workspace.getLeaf('tab').openFile(file);
    }
  }

  function fileIcon(ext: string): string {
    switch (ext) {
      case 'md': return '📄';
      case 'canvas': return '🗺️';
      case 'excalidraw': return '🎨';
      case 'png': case 'jpg': case 'jpeg': case 'gif': case 'svg': case 'webp': return '🖼️';
      case 'pdf': return '📕';
      default: return '📎';
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }

  function formatFileDate(mtime: number): string {
    return new Date(mtime).toLocaleDateString('default', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function getAvailableFilename(baseName: string, extension: string): string {
    const existingNames = projectFiles.map(f => f.name);
    let filename = `${baseName}${extension}`;
    let counter = 1;
    while (existingNames.includes(filename)) {
      filename = `${baseName} ${counter}${extension}`;
      counter++;
    }
    return filename;
  }

  async function createNewFile(type: 'md' | 'canvas' | 'excalidraw') {
    if (!selectedProject) return;
    showNewFileMenu = false;
    
    let filename: string;
    let content: string;
    
    switch (type) {
      case 'md':
        filename = getAvailableFilename('Untitled Note', '.md');
        content = `# New Note\n\nCreated in project: ${selectedProject.name}\n`;
        break;
      case 'canvas':
        filename = getAvailableFilename('Untitled Canvas', '.canvas');
        content = '{"nodes":[],"edges":[]}';
        break;
      case 'excalidraw':
        filename = getAvailableFilename('Untitled Drawing', '.excalidraw.md');
        content = `---\nexcalidraw-plugin: parsed\ntags: [excalidraw]\n---\n\n==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠==\n\n# Drawing\n\n\`\`\`json\n{"type":"excalidraw","version":2,"source":"","elements":[],"appState":{"gridSize":null,"viewBackgroundColor":"#ffffff"},"files":{}}\n\`\`\`\n`;
        break;
    }

    try {
      const file = await fileManager.createProjectFile(selectedProject.id, filename, content);
      refreshProjectFiles(selectedProject.id);
      // Open the new file natively
      app.workspace.getLeaf('tab').openFile(file);
      new Notice(`Created ${filename}`);
    } catch (e) {
      new Notice('Failed to create file: ' + e.message);
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
          📊 Backlog
        </button>
        <button 
          class="pos-tab-btn" 
          class:active={projectTab === 'deadlines'} 
          on:click={() => projectTab = 'deadlines'}
        >
          📅 Deadlines
        </button>
      </div>

      <div style="width: 40px;"></div>
    </header>

    <!-- CONTENT DISPATCHER -->
    <div class="pos-project-workspace-body">
      {#if projectTab === 'notes'}
        <!-- 📄 NOTES + FILE BROWSER VIEW -->
        <div class="pos-notes-layout">
          <!-- Note Preview Section -->
          <div class="pos-note-preview-section">
            <div class="pos-native-note-bar">
              <span class="pos-note-bar-label">📄 Project Note</span>
              <button class="pos-modal-primary pos-note-edit-btn" on:click={handleOpenNoteNatively}>
                Edit Natively ↗
              </button>
            </div>
            <div class="pos-note-preview-body">
              <div bind:this={previewEl} class="markdown-preview-view markdown-rendered pos-note-md-render"></div>
            </div>
          </div>

          <!-- File Browser Section -->
          <div class="pos-file-browser">
            <div class="pos-fb-header">
              <span class="pos-fb-title">📁 Project Files</span>
              <div class="pos-fb-actions">
                <button class="pos-fb-new-btn" on:click={() => showNewFileMenu = !showNewFileMenu}>
                  + New
                </button>
                {#if showNewFileMenu}
                  <div class="pos-fb-dropdown">
                    <button on:click={() => createNewFile('md')}>📄 Markdown Note</button>
                    <button on:click={() => createNewFile('canvas')}>🗺️ Canvas</button>
                    <button on:click={() => createNewFile('excalidraw')}>🎨 Excalidraw</button>
                  </div>
                {/if}
              </div>
            </div>
            <div class="pos-fb-list">
              {#if projectFiles.length === 0}
                <div class="pos-fb-empty">No files yet. Click "+ New" to create one.</div>
              {:else}
                {#each projectFiles as f}
                  <button class="pos-fb-item" on:click={() => openFile(f.path)} title={f.path}>
                    <span class="pos-fb-icon">{fileIcon(f.extension)}</span>
                    <div class="pos-fb-info">
                      <span class="pos-fb-name">{f.name}</span>
                      <span class="pos-fb-meta">{formatFileSize(f.size)} · {formatFileDate(f.mtime)}</span>
                    </div>
                  </button>
                {/each}
              {/if}
            </div>
          </div>
        </div>

      {:else if projectTab === 'deadlines'}
        <!-- 📅 DEADLINES VIEW -->
        <div style="height: 100%; overflow: hidden;">
          <ProjectDeadlines {app} {fileManager} {plugin} projectId={selectedProject.id} />
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
