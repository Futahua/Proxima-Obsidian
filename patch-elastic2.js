const fs = require('fs');
const file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/ElasticView.svelte';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /\$:\s+backlog\s+=\s+sortTasks\([\s\S]*?\$:\s+review\s+=\s+sortTasks\([^)]+\)\);/,
  `$: statuses = fileManager.plugin.settings.statuses || [];
  $: sBacklog = statuses[0] || { id: 'backlog', name: 'Backlog', color: '#666' };
  $: sRunning = statuses[1] || { id: 'running', name: 'Running', color: '#00b894' };
  $: sReview = statuses[statuses.length - 1] || { id: 'review', name: 'Review', color: '#fdcb6e' };

  $: backlog = sortTasks(projectTasks.filter(t => t.status === sBacklog.id));
  $: running = sortTasks(projectTasks.filter(t => t.status === sRunning.id));
  $: review = sortTasks(projectTasks.filter(t => t.status === sReview.id));`
);

fs.writeFileSync(file, content);
console.log('ElasticView patched again');
