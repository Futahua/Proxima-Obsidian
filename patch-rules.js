const fs = require('fs');
const file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectDeadlines.svelte';
let content = fs.readFileSync(file, 'utf8');

const newFunc = `  function getRuleColor(task: TaskData, diffMs: number): string {
    const rules = plugin.settings.colorRules || [];
    const nowMs = Date.now();
    for (const rule of rules) {
      const targetDateStr = rule.targetDate === 'deadline' ? task.deadline : task.createdAt;
      if (!targetDateStr) continue;
      const targetMs = new Date(targetDateStr).getTime();
      const diffDays = (targetMs - nowMs) / 86400000;
      
      let matches = false;
      if (rule.value === 'overdue' && diffDays < 0) matches = true;
      else if (rule.value === 'today' && diffDays >= 0 && diffDays <= 1) matches = true;
      else if (rule.value === 'next 2 days' && diffDays >= 0 && diffDays <= 2) matches = true;
      else if (rule.value === 'next 3 days' && diffDays >= 0 && diffDays <= 3) matches = true;
      else if (rule.value === 'next week' && diffDays >= 0 && diffDays <= 7) matches = true;
      else if (rule.value === 'next month' && diffDays >= 0 && diffDays <= 30) matches = true;
      
      if (matches) return rule.color;
    }
    return 'var(--background-modifier-border)'; // fallback
  }`;

content = content.replace(/function urgencyClass\(diffMs: number\): string \{[\s\S]*?return 'safe';\r?\n\s*\}/, newFunc);

content = content.replace(/class="pos-dl-cal-bar \{urgencyClass\(pt\.diffMs\)\}"/g, 'class="pos-dl-cal-bar" style="background: {getRuleColor(pt.task, pt.diffMs)}; border-color: {getRuleColor(pt.task, pt.diffMs)};"');
content = content.replace(/class="pos-dl-gantt-bar \{urgencyClass\(diffMs\)\}"/g, 'class="pos-dl-gantt-bar"');
content = content.replace(/style="left: \{draggingTaskId === task\.id \? tempDragLeft : pos\.leftPx\}px; width: \{draggingTaskId === task\.id \? tempDragWidth : pos\.widthPx\}px;/g, 'style="background: {getRuleColor(task, diffMs)}; border-color: {getRuleColor(task, diffMs)}; left: {draggingTaskId === task.id ? tempDragLeft : pos.leftPx}px; width: {draggingTaskId === task.id ? tempDragWidth : pos.widthPx}px;');
content = content.replace(/class="pos-dl-countdown-card \{urgencyClass\(diff\)\}"/g, 'class="pos-dl-countdown-card" style="border-left: 4px solid {getRuleColor(task, diff)};"');
content = content.replace(/class="pos-dl-cc-progress-fill \{urgencyClass\(diff\)\}"/g, 'class="pos-dl-cc-progress-fill" style="width: {progress * 100}%; background: {getRuleColor(task, diff)};"');

// also fix the group header urgency classes
content = content.replace(/class="pos-dl-group-header \{group\.cls\}"/g, 'class="pos-dl-group-header"');

fs.writeFileSync(file, content);
console.log('ProjectDeadlines updated with color rules logic');
