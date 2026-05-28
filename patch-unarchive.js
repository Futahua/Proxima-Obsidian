const fs = require('fs');
const file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/data/FileManager.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const newFileContent = stringifyYamlFrontmatter\(fm\) \+ newBody;\s+await this\.app\.vault\.modify\(file, newFileContent\);/g,
  `const newFileContent = serializeFrontmatter(fm) + '\\n' + newBody;\n      await this.app.vault.modify(file, newFileContent);\n      await this.loadAll();`
);

fs.writeFileSync(file, content);
console.log('FileManager unarchive logic fixed');
