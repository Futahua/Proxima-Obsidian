const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/AgingView.svelte';
let content = fs.readFileSync(file, 'utf8');

// Replace handleSelectProject
const oldHandle = `  function handleSelectProject(id: string) {
    const pFile = fileManager.getProjectNoteFile(id);
    if (pFile) {
      app.workspace.getLeaf('tab').openFile(pFile);
    } else {
      new Notice('Project note not found');
    }
  }`;

const newHandle = `  function handleSelectProject(id: string) {
    plugin.activateWorkspaceView(id);
  }`;

content = content.replace(oldHandle, newHandle);

fs.writeFileSync(file, content);
console.log('Patched AgingView to use plugin.activateWorkspaceView');
