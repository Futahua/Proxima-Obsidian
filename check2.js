const fs = require('fs');
const content = fs.readFileSync('c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectDeadlines.svelte', 'utf8');

const regex = /<[a-zA-Z0-9-]+\s+([^>]+)>/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const attrs = match[1];
  const classMatches = attrs.match(/class=/g);
  if (classMatches && classMatches.length > 1) {
    console.log("Duplicate class in tag: " + match[0]);
  }
  const styleMatches = attrs.match(/style=/g);
  if (styleMatches && styleMatches.length > 1) {
    console.log("Duplicate style in tag: " + match[0]);
  }
}
