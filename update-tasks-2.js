const fs = require('fs');
const path = require('path');

function updateDummyTasks(vaultPath) {
  const tasksDir = path.join(vaultPath, 'tasks');
  if (!fs.existsSync(tasksDir)) return;
  
  const files = fs.readdirSync(tasksDir).filter(f => f.endsWith('.md'));
  
  for (const file of files) {
    const filePath = path.join(tasksDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add custom properties if not exist
    if (!content.includes('energy:')) {
      content = content.replace('status: backlog\n', 'status: backlog\nenergy: high\nclient_ready: false\neffort: 5\npriority: 1\ntags:\n  - bug\n  - ui\n');
      content = content.replace('status: running\n', 'status: running\nenergy: medium\nclient_ready: true\neffort: 12\npriority: 2\ntags:\n  - feature\n');
      content = content.replace('status: review\n', 'status: review\nenergy: low\nclient_ready: true\neffort: 2\npriority: 3\ntags:\n  - ui\n');
      
      // Remove old tags formats if they existed
      content = content.replace('tags: []\n', '');
      content = content.replace('tags: \n', '');
      content = content.replace(/priority: [0-9]\n/g, (match, offset) => {
         // Only replace the old priority if we already added a new one above it
         return '';
      });

      fs.writeFileSync(filePath, content);
    }
  }
}

updateDummyTasks('c:/Users/admin/Dropbox/Apps/remotely-save/Croptop');
updateDummyTasks('D:/Letters/Vault/Local');
console.log('Dummy tasks updated!');
