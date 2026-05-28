const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { onMount } from')) {
  content = content.replace(
    /import \{ App \} from 'obsidian';/,
    "import { App } from 'obsidian';\n  import { onMount } from 'svelte';"
  );
  content = content.replace(
    /export let fileManager: FileManager;/,
    "export let fileManager: FileManager;\n  onMount(() => {\n    require('fs').writeFileSync('c:/proxima-debug.txt', 'ProjectTaskBoard MOUNTED SUCCESSFULLY\\n', { flag: 'a' });\n  });"
  );
  fs.writeFileSync(file, content);
  console.log('Added onMount logger');
}
