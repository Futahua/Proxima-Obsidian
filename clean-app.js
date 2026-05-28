const fs = require('fs');
const file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/App.svelte';
let content = fs.readFileSync(file, 'utf8');

// Remove all non-ASCII characters
content = content.replace(/[^\x00-\x7F]/g, '');

fs.writeFileSync(file, content);
console.log('App.svelte cleaned');
