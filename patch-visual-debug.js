const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<div class="pos-board-scroll-container">/,
  "<div style=\"padding: 10px; background: red; color: white; margin-bottom: 10px; border-radius: 5px;\">DEBUG: projectTasks count = {projectTasks.length} | columns count = {columns.length}</div>\n<div class=\"pos-board-scroll-container\">"
);

fs.writeFileSync(file, content);
console.log('Added visual debug banner');
