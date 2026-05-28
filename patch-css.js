const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/styles.css';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('min-height: 100%;')) {
  content = content.replace(
    /\.pos-board-list \{/,
    `.pos-board-list {\n  min-height: 100%;`
  );
  fs.writeFileSync(file, content);
}
console.log('Ensured pos-board-list fills the column vertically for drop target');
