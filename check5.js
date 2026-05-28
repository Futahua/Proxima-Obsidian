const fs = require('fs');
const content = fs.readFileSync('c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectDeadlines.svelte', 'utf8');

console.log(content.substring(25400, 25900));
