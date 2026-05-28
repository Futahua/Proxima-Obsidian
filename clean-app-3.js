const fs = require('fs');
const file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/App.svelte';
const cleanContent = `<script lang="ts">
  import { App as ObsidianApp } from 'obsidian';
  import type { FileManager } from '../data/FileManager';
  import ProjectsHub from './views/AgingView.svelte';
  import ElasticView from './views/ElasticView.svelte';
  import DeadlinesView from './views/DeadlinesView.svelte';
  import { projectsStore } from '../stores/data';

  export let app;
  export let fileManager: FileManager;
  export let plugin;

  let mode: 'projects' | 'elastic' | 'deadlines' = 'projects';
  let selectedProjectId: string | null = 'all';

  $: activeProjects = $projectsStore.filter(p => p.status === 'active');
</script>

<div class="pos-view">
  <div class="pos-mode-bar">
    <button class="pos-mode-btn" class:pos-mode-active={mode === 'projects'} on:click={() => mode = 'projects'}>Projects</button>
    <button class="pos-mode-btn" class:pos-mode-active={mode === 'elastic'} on:click={() => mode = 'elastic'}>Elastic</button>
    <button class="pos-mode-btn" class:pos-mode-active={mode === 'deadlines'} on:click={() => mode = 'deadlines'}>Deadlines</button>
    
    {#if mode !== 'projects'}
      <div class="pos-project-selector-row">
        <label>Project:
        <select bind:value={selectedProjectId} class="pos-project-selector">
          <option value="all">-- All Projects --</option>
          <option value="">-- Uncategorized --</option>
          {#each activeProjects as p (p.id)}
            <option value={p.id}>{p.name}</option>
          {/each}
        </select>
        </label>
      </div>
    {/if}
    
    <div style="flex: 1;"></div>
    <button 
      class="pos-settings-btn" 
      style="background: transparent; border: none; font-size: 1.2em; cursor: pointer; color: var(--text-muted);"
      title="Settings"
      on:click={() => { if (app.setting) { app.setting.open(); app.setting.openTabById('proxima'); } }}>
      [Settings]
    </button>
  </div>

  <div class="pos-content">
    {#if mode === 'projects'}
      <ProjectsHub {app} {fileManager} {plugin} onSelect={(id, m) => { selectedProjectId = id; mode = m; }} />
    {:else if mode === 'elastic'}
      <ElasticView {app} {fileManager} projectId={selectedProjectId} />
    {:else if mode === 'deadlines'}
      <DeadlinesView {app} {fileManager} projectId={selectedProjectId} />
    {/if}
  </div>
</div>
`;

fs.writeFileSync(file, cleanContent);
console.log('App.svelte strictly rewritten');
