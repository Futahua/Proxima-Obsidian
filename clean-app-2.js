const fs = require('fs');
const file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/App.svelte';
let content = fs.readFileSync(file, 'utf8');

// Replace the entire select block just in case
content = content.replace(
  /<div class="pos-project-selector-row">[\s\S]*?<\/div>/,
  `<div class="pos-project-selector-row">
        <label>Project:
        <select bind:value={selectedProjectId} class="pos-project-selector">
          <option value="all">-- All Projects --</option>
          <option value="">-- Uncategorized --</option>
          {#each activeProjects as p (p.id)}
            <option value={p.id}>{p.name}</option>
          {/each}
        </select>
        </label>
      </div>`
);

fs.writeFileSync(file, content);
console.log('App.svelte selector replaced');
