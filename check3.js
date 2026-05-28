const fs = require('fs');
const content = fs.readFileSync('c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectDeadlines.svelte', 'utf8');

const regex = /<([a-zA-Z0-9-]+)\s+([^>]+)>/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const tagName = match[1];
  const attrsString = match[2];

  // Regex to match attribute names (e.g., class="...", style="...", disabled)
  const attrRegex = /([a-zA-Z0-9-:]+)(?:=(?:"[^"]*"|'[^']*'|{[^}]*}|[^\s>]+))?/g;
  let attrMatch;
  const attrNames = new Set();
  
  while ((attrMatch = attrRegex.exec(attrsString)) !== null) {
    const attrName = attrMatch[1];
    
    // Ignore boolean attributes without a value if they don't break esbuild
    // Svelte allows class:name={...} which is not a duplicate of class="..."
    
    if (attrNames.has(attrName) && !attrName.startsWith('class:')) {
      console.log(`Duplicate attribute found: ${attrName} in tag <${tagName}> at index ${match.index}`);
    }
    attrNames.add(attrName);
  }
}
