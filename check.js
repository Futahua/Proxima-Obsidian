const fs = require('fs');
const content = fs.readFileSync('c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectDeadlines.svelte', 'utf8');

const lines = content.split('\n');
for(let i=0; i<lines.length; i++) {
  const line = lines[i];
  if(line.includes('class=') && line.includes('class=')) {
     if(line.match(/class="[^"]*".*class="[^"]*"/)) {
       console.log("Duplicate class at " + (i+1) + ": " + line.trim());
     }
  }
  if(line.includes('style=') && line.includes('style=')) {
     if(line.match(/style="[^"]*".*style="[^"]*"/)) {
       console.log("Duplicate style at " + (i+1) + ": " + line.trim());
     }
  }
}
