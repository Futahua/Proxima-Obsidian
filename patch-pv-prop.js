const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/ProjectsView.svelte';
let content = fs.readFileSync(file, 'utf8');

const propBlock = `  export let fileManager: FileManager;
  export let plugin: any;
  export let selectedProjectId: string | null = null;`;

const newPropBlock = `  export let fileManager: FileManager;
  export let plugin: any;
  export let selectedProjectId: string | null = null;
  export let isFullPage: boolean = false;`;

content = content.replace(propBlock, newPropBlock);

fs.writeFileSync(file, content);
console.log('Added isFullPage prop to ProjectsView');
