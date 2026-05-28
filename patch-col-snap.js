const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /async function handleColumnFinalize\(e\) \{\s*boardColumns = e\.detail\.items;\s*isDraggingColumns = false;\s*const settings = await ensureProjectStatuses\(\);/,
  `async function handleColumnFinalize(e) {
    boardColumns = e.detail.items;
    const settings = await ensureProjectStatuses();`
);

content = content.replace(
  /fileManager\.plugin\.settings = settings;\s*fileManager = fileManager; \/\/ Force Svelte Reactivity\s*\}/,
  `fileManager.plugin.settings = settings;
    fileManager = fileManager; // Force Svelte Reactivity
    setTimeout(() => { isDraggingColumns = false; }, 100);
  }`
);

fs.writeFileSync(file, content);
console.log('Patched handleColumnFinalize for snap-back');
