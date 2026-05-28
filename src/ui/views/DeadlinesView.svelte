<script lang="ts">
  import type { FileManager } from '../../data/FileManager';
  import ProjectDeadlines from './components/ProjectDeadlines.svelte';

  export let app;
  export let fileManager;
  export let projectId;
</script>

<div style="height: 100%; display: flex; flex-direction: column; overflow: hidden;">
  <ProjectDeadlines {app} {fileManager} {projectId} plugin={fileManager.plugin} />
</div>


