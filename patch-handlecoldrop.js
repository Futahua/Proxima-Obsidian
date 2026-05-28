const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /async function handleColDrop\(e: DragEvent, id: string\) \{[\s\S]*?dragOverColIndex = -1;\s*\n\s*\}/,
  `async function handleColDrop(e: DragEvent, id: string) {
    e.stopPropagation();
    if (!dragColId || dragColId === id) return;
    e.preventDefault();
    const settings = await ensureProjectStatuses();
    
    let newOrder = [...columns];
    const fromIndex = newOrder.findIndex(c => c.id === dragColId);
    if (fromIndex !== -1) {
      const [movedItem] = newOrder.splice(fromIndex, 1);
      let insertIndex = dragOverColIndex;
      if (insertIndex > newOrder.length) insertIndex = newOrder.length;
      newOrder.splice(insertIndex, 0, movedItem);
      
      settings.projectStatuses[projectId] = newOrder.map(c => ({ id: c.id, name: c.name, color: c.color }));
      await fileManager.plugin.saveSettings();
      fileManager.plugin.settings = settings;
      fileManager = fileManager;
    }
    dragColId = null;
    dragOverColId = null;
    dragOverColIndex = -1;
  }`
);

fs.writeFileSync(file, content);
console.log('Patched handleColDrop logic');
