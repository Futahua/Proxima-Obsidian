const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima';

function walk(directory) {
  let results = [];
  const list = fs.readdirSync(directory);
  list.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        results = results.concat(walk(filePath));
      }
    } else {
      if (['.ts', '.js', '.json', '.svelte', '.css', '.md'].includes(path.extname(file))) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const files = walk(dir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content
    .replace(/Proxima/g, 'Proxima')
    .replace(/proxima/g, 'proxima')
    .replace(/Proxima/g, 'Proxima');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Replaced in ${file}`);
  }
});
