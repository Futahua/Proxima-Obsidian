const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

// Remove all file writes from ProjectTaskBoard.svelte
content = content.replace(/require\('fs'\)\.appendFileSync[^;]+;/g, '');
content = content.replace(/require\('fs'\)\.writeFileSync[^;]+;/g, '');
content = content.replace(/import \{ onMount \} from 'svelte';/g, '');
content = content.replace(/onMount\(\(\) => \{[\s\S]*?\}\);/g, '');

fs.writeFileSync(file, content);
console.log('Removed debug file writes');
