const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/ProjectsView.svelte';
let content = fs.readFileSync(file, 'utf8');

const backOld = `<button class="pos-back-btn" on:click={() => selectedProjectId = null}>`;
const backNew = `{#if !isFullPage}<button class="pos-back-btn" on:click={() => selectedProjectId = null}>`;
content = content.replace(backOld, backNew);
content = content.replace(`? Back\n        </button>`, `? Back\n        </button>{/if}`);

fs.writeFileSync(file, content);
console.log('Patched ProjectsView.svelte to hide Back button when isFullPage is true');
