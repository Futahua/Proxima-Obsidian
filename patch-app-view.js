const fs = require('fs');
// PATCH App.svelte to use ProjectsView instead of AgingView
let appFile = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/App.svelte';
let appContent = fs.readFileSync(appFile, 'utf8');

appContent = appContent.replace(
  `import ProjectsHub from './views/AgingView.svelte';`,
  `import ProjectsView from './views/ProjectsView.svelte';`
);

appContent = appContent.replace(
  `<ProjectsHub {app} {fileManager} {plugin} onSelect={(id, m) => { selectedProjectId = id; mode = m; }} />`,
  `<ProjectsView {app} {fileManager} {plugin} bind:selectedProjectId={selectedProjectId} />`
);

fs.writeFileSync(appFile, appContent);
console.log('Patched App.svelte');
