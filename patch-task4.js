const fs = require('fs');

const elasticFile = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/ElasticView.svelte';
let elasticContent = fs.readFileSync(elasticFile, 'utf8');

const elasticTarget = `  const sBacklog = { id: 'backlog', name: 'Elastic Backlog', color: '#636e72' };
  const sRunning = { id: 'running', name: 'Elastic Running', color: '#00b894' };
  const sReview = { id: 'review', name: 'Elastic Review', color: '#fdcb6e' };`;

const elasticReplace = `  $: statuses = fileManager.plugin.settings.statuses || [];
  $: sBacklog = statuses.find(s => s.id === 'backlog') || { id: 'backlog', name: 'Elastic Backlog', color: '#636e72' };
  $: sRunning = statuses.find(s => s.id === 'running') || { id: 'running', name: 'Elastic Running', color: '#00b894' };
  $: sReview = statuses.find(s => s.id === 'review') || { id: 'review', name: 'Finished', color: '#fdcb6e' };`;

elasticContent = elasticContent.replace(elasticTarget, elasticReplace);
fs.writeFileSync(elasticFile, elasticContent);

console.log('Patched ElasticView');
