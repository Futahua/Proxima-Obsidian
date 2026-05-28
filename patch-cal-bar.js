const fs = require('fs');
const file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectDeadlines.svelte';
let content = fs.readFileSync(file, 'utf8');

// The faulty string:
const faulty = `class="pos-dl-cal-bar" style="background: {getRuleColor(pt.task, pt.diffMs)}; border-color: {getRuleColor(pt.task, pt.diffMs)};"
                        class:is-start={pt.isStart}
                        class:is-end={pt.isEnd}
                        style="left: {pt.leftPct}%; width: {pt.widthPct}%; top: {pt.row * 28 + 4}px;"`;

const fixed = `class="pos-dl-cal-bar"
                        class:is-start={pt.isStart}
                        class:is-end={pt.isEnd}
                        style="background: {getRuleColor(pt.task, pt.diffMs)}; border-color: {getRuleColor(pt.task, pt.diffMs)}; left: {pt.leftPct}%; width: {pt.widthPct}%; top: {pt.row * 28 + 4}px;"`;

content = content.replace(faulty, fixed);
fs.writeFileSync(file, content);
console.log('Fixed duplicate style tag in pos-dl-cal-bar');
