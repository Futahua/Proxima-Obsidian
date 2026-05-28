const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const fromIndex = ps\.findIndex\(s => s\.id === dragColId\);\n\s*if \(fromIndex !== -1\) \{/,
  `const fromIndex = ps.findIndex(s => s.id === dragColId);
      let movedItem;
      if (fromIndex !== -1) {
        [movedItem] = ps.splice(fromIndex, 1);
      } else {
        movedItem = columns.find(c => c.id === dragColId);
      }
      if (movedItem) {`
);

fs.writeFileSync(file, content);
console.log('Patched board drag drops for core columns');
