const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/main.ts';
let content = fs.readFileSync(file, 'utf8');

// Add a debounce to loadAll to prevent file read avalanches
content = content.replace(
  /this\.registerEvent\(\s*this\.app\.metadataCache\.on\('changed', async \(file\) => \{\s*if \(file\.path\.startsWith\('tasks\/'\) \|\| file\.path\.startsWith\('projects\/'\)\) \{\s*await this\.fileManager\.loadAll\(\);\s*\}\s*\}\)\s*\);/,
  `let loadAllTimeout: any = null;
        this.registerEvent(
          this.app.metadataCache.on('changed', (file) => {
            if (file.path.startsWith('tasks/') || file.path.startsWith('projects/')) {
              if (loadAllTimeout) clearTimeout(loadAllTimeout);
              loadAllTimeout = setTimeout(async () => {
                await this.fileManager.loadAll();
              }, 300);
            }
          })
        );`
);

fs.writeFileSync(file, content);
console.log('Patched src/main.ts with loadAll debounce');
