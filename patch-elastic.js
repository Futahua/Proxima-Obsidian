const fs = require('fs');
const file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/ElasticView.svelte';
let content = fs.readFileSync(file, 'utf8');

// Replace reactive array definitions
content = content.replace(
  `  $: backlog = sortTasks(projectTasks.filter(t => t.status === 'backlog'));\r\n  $: running = sortTasks(projectTasks.filter(t => t.status === 'running'));\r\n  $: review = sortTasks(projectTasks.filter(t => t.status === 'review'));`,
  `  $: statuses = fileManager.plugin.settings.statuses || [];\n  $: sBacklog = statuses[0] || { id: 'backlog', name: 'Backlog', color: '#666' };\n  $: sRunning = statuses[1] || { id: 'running', name: 'Running', color: '#00b894' };\n  $: sReview = statuses[statuses.length - 1] || { id: 'review', name: 'Review', color: '#fdcb6e' };\n\n  $: backlog = sortTasks(projectTasks.filter(t => t.status === sBacklog.id));\n  $: running = sortTasks(projectTasks.filter(t => t.status === sRunning.id));\n  $: review = sortTasks(projectTasks.filter(t => t.status === sReview.id));`
);

// We need to replace string literals for columns in the script and HTML.
// Instead of complex regex, let's just do targeted replaces for the HTML titles:
content = content.replace(/<h4 class="pos-col-title">Backlog \(\{backlog\.length\}\)<\/h4>/g, `<h4 class="pos-col-title" style="color: {sBacklog.color}">{sBacklog.name} ({backlog.length})</h4>`);
content = content.replace(/<h4 class="pos-col-title">Running \(\{running\.length\}\)<\/h4>/g, `<h4 class="pos-col-title" style="color: {sRunning.color}">{sRunning.name} ({running.length})</h4>`);
content = content.replace(/<h4 class="pos-col-title">Review \(\{review\.length\}\)<\/h4>/g, `<h4 class="pos-col-title" style="color: {sReview.color}">{sReview.name} ({review.length})</h4>`);

// Replaces in HTML event handlers
content = content.replace(/'backlog'/g, `sBacklog.id`);
content = content.replace(/'running'/g, `sRunning.id`);
content = content.replace(/'review'/g, `sReview.id`);

fs.writeFileSync(file, content);
console.log('ElasticView patched');
