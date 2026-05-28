const fs = require('fs');
const file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

// Fix 1: Hardcoded Elastic Backlog board
const statusesTarget = `$: statuses = fileManager.plugin.settings.statuses || [];`;
const statusesReplace = `$: settingsStatuses = fileManager.plugin.settings.statuses || [];
  $: statuses = [
    { id: 'backlog', name: 'Elastic Backlog', color: '#636e72' },
    ...settingsStatuses.filter(s => s.id !== 'backlog')
  ];`;
content = content.replace(statusesTarget, statusesReplace);

// Fix 2: Drag and drop timeout fix
const dragIdTarget = `    }
    dragId = id;
  }`;
const dragIdReplace = `    }
    setTimeout(() => {
      dragId = id;
    }, 0);
  }`;
content = content.replace(dragIdTarget, dragIdReplace);

fs.writeFileSync(file, content);
console.log('ProjectTaskBoard fixed');
