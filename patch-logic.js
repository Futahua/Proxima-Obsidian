const fs = require('fs');

// PATCH ELASTICVIEW.SVELTE
const elasticFile = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/ElasticView.svelte';
let elasticContent = fs.readFileSync(elasticFile, 'utf8');

const elasticTarget = `$: statuses = fileManager.plugin.settings.statuses || [];
  $: sBacklog = statuses[0] || { id: 'backlog', name: 'Backlog', color: '#666' };
  $: sRunning = statuses[1] || { id: 'running', name: 'Running', color: '#00b894' };
  $: sReview = statuses[statuses.length - 1] || { id: 'review', name: 'Review', color: '#fdcb6e' };`;

const elasticReplace = `  const sBacklog = { id: 'backlog', name: 'Elastic Backlog', color: '#636e72' };
  const sRunning = { id: 'running', name: 'Elastic Running', color: '#00b894' };
  const sReview = { id: 'review', name: 'Elastic Review', color: '#fdcb6e' };`;

elasticContent = elasticContent.replace(elasticTarget, elasticReplace);
fs.writeFileSync(elasticFile, elasticContent);

// PATCH PROJECTTASKBOARD.SVELTE
const boardFile = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let boardContent = fs.readFileSync(boardFile, 'utf8');

const boardTarget = `$: settingsStatuses = fileManager.plugin.settings.statuses || [];
  $: statuses = [
    { id: 'backlog', name: 'Elastic Backlog', color: '#636e72' },
    ...settingsStatuses.filter(s => s.id !== 'backlog')
  ];`;

const boardReplace = `$: settingsStatuses = fileManager.plugin.settings.statuses || [];
  $: statuses = (() => {
    const cols = [ { id: 'backlog', name: 'Elastic Backlog', color: '#636e72' } ];
    settingsStatuses.forEach(s => {
      if (!cols.find(c => c.id === s.id)) cols.push(s);
    });
    const activeStatuses = new Set(projectTasks.map(t => t.status));
    activeStatuses.forEach(statusId => {
      if (!cols.find(c => c.id === statusId)) {
        if (statusId === 'running') cols.push({ id: 'running', name: 'Elastic Running', color: '#00b894' });
        else if (statusId === 'review') cols.push({ id: 'review', name: 'Elastic Review', color: '#fdcb6e' });
        else cols.push({ id: statusId, name: statusId, color: '#a29bfe' });
      }
    });
    return cols;
  })();`;

boardContent = boardContent.replace(boardTarget, boardReplace);
fs.writeFileSync(boardFile, boardContent);

console.log('Patched ElasticView and ProjectTaskBoard');
