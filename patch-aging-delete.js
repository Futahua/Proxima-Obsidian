const fs = require('fs');
const file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/AgingView.svelte';
let content = fs.readFileSync(file, 'utf8');

const target1 = `if (confirm('Delete project and its Markdown file? Tasks remain but will be uncategorized.')) {`;
const insert1 = `if (confirm('Delete project and ALL its child tasks? This will permanently delete the Markdown files of all tasks inside this project.')) {`;

const target2 = `await fileManager.updateTask(t.id, { project: null });`;
const insert2 = `await fileManager.deleteTask(t.id);`;

content = content.replace(target1, insert1).replace(target2, insert2);
fs.writeFileSync(file, content);
console.log('AgingView.svelte updated');
