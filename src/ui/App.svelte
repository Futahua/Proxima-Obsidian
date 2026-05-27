<script lang="ts">
  import { App as ObsidianApp } from 'obsidian';
  import type { FileManager } from '../data/FileManager';
  import AgingView from './views/AgingView.svelte';
  import ElasticView from './views/ElasticView.svelte';
  import DeadlinesView from './views/DeadlinesView.svelte';
  import { projectsStore } from '../stores/data';

  export let app;
  export let fileManager;

  let mode: 'aging' | 'elastic' | 'deadlines' = 'aging';
  let selectedProjectId: string | null = null;

  $: activeProjects = $projectsStore.filter(p => p.status === 'active');
</script>

<div class="pos-view">
  <!-- MODE BAR -->
  <div class="pos-mode-bar">
    <button class="pos-mode-btn" class:pos-mode-active={mode === 'aging'} on:click={() => mode = 'aging'}>Aging</button>
    <button class="pos-mode-btn" class:pos-mode-active={mode === 'elastic'} on:click={() => mode = 'elastic'}>Elastic</button>
    <button class="pos-mode-btn" class:pos-mode-active={mode === 'deadlines'} on:click={() => mode = 'deadlines'}>Deadlines</button>
    
    {#if mode !== 'aging'}
      <div class="pos-project-selector-row">
        <label for="project-select">Project:</label>
        <select id="project-select" bind:value={selectedProjectId} class="pos-project-selector">
          <option value={null}>— Uncategorized —</option>
          {#each activeProjects as p (p.id)}
            <option value={p.id}>{p.name}</option>
          {/each}
        </select>
      </div>
    {/if}
  </div>

  <!-- VIEW AREA -->
  <div class="pos-content">
    {#if mode === 'aging'}
      <AgingView {app} {fileManager} onSelect={(id, m) => { selectedProjectId = id; mode = m; }} />
    {:else if mode === 'elastic'}
      <ElasticView {app} {fileManager} projectId={selectedProjectId} />
    {:else if mode === 'deadlines'}
      <DeadlinesView {app} {fileManager} projectId={selectedProjectId} />
    {/if}
  </div>
</div>
