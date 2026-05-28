const fs = require('fs');

// Patch settings.ts
const settingsFile = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/settings.ts';
let settingsContent = fs.readFileSync(settingsFile, 'utf8');

settingsContent = settingsContent.replace(
  "{ id: 'backlog', name: 'Backlog', color: '#636e72' }",
  "{ id: 'backlog', name: 'Elastic Backlog', color: '#636e72' }"
).replace(
  "{ id: 'running', name: 'Running', color: '#00b894' }",
  "{ id: 'running', name: 'Elastic Running', color: '#00b894' }"
).replace(
  "{ id: 'review', name: 'Review', color: '#fdcb6e' }",
  "{ id: 'review', name: 'Finished', color: '#fdcb6e' }"
);

fs.writeFileSync(settingsFile, settingsContent);

// Patch main.ts
const mainFile = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/main.ts';
let mainContent = fs.readFileSync(mainFile, 'utf8');

const targetMain = `async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }`;

const replaceMain = `async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    
    const hasBacklog = this.settings.statuses.some(s => s.id === 'backlog');
    const hasRunning = this.settings.statuses.some(s => s.id === 'running');
    const hasReview = this.settings.statuses.some(s => s.id === 'review');
    
    if (!hasBacklog) this.settings.statuses.push({ id: 'backlog', name: 'Elastic Backlog', color: '#636e72' });
    if (!hasRunning) this.settings.statuses.push({ id: 'running', name: 'Elastic Running', color: '#00b894' });
    if (!hasReview) this.settings.statuses.push({ id: 'review', name: 'Finished', color: '#fdcb6e' });
    
    // Auto-migrate old "Review" name to "Finished" if it's identical to the old default
    const reviewStatus = this.settings.statuses.find(s => s.id === 'review');
    if (reviewStatus && reviewStatus.name === 'Review') reviewStatus.name = 'Finished';
  }`;

mainContent = mainContent.replace(targetMain, replaceMain);
fs.writeFileSync(mainFile, mainContent);

console.log('Patched main.ts and settings.ts');
