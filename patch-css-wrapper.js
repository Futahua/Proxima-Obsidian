const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

// Replace the buggy outer containers with the correct CSS class
content = content.replace(
  /<div class="pos-board-scroll-container">\s*<div class="pos-board-container" use:dndzone=\{\{items: boardColumns, flipDurationMs, type: 'columns'\}\} on:consider=\{handleColumnConsider\} on:finalize=\{handleColumnFinalize\}>/,
  `<div class="pos-board-workspace" use:dndzone={{items: boardColumns, flipDurationMs, type: 'columns'}} on:consider={handleColumnConsider} on:finalize={handleColumnFinalize}>`
);

// Close tag fix
content = content.replace(
  /    <\/div>\n  <\/div>\n<\/div>/,
  `    </div>\n  </div>` // removing one closing div since we merged two wrappers into one
);

fs.writeFileSync(file, content);
console.log('Patched outer CSS wrapper');
