const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/ProjectsView.svelte';
let content = fs.readFileSync(file, 'utf8');

const propOld = `  export let selectedProjectId: string | null = null;`;
const propNew = `  export let selectedProjectId: string | null = null;
  export let isFullPage: boolean = false;`;

content = content.replace(propOld, propNew);

fs.writeFileSync(file, content);
console.log('Added isFullPage to ProjectsView.svelte');
