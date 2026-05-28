const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<div style="padding: 10px; background: red; color: white; margin-bottom: 10px; border-radius: 5px;">DEBUG.*?<\/div>\n/g,
  ""
);

fs.writeFileSync(file, content);
console.log('Removed visual debug banner');
