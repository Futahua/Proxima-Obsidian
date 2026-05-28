const fs = require('fs');
const file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/settings.ts';
let content = fs.readFileSync(file, 'utf8');

const target1 = `    this.renderTaskSchema();\n  }`;
const insert1 = `    this.renderTaskSchema();\n    this.renderColorRules();\n  }`;

const target2 = `  renderStatuses() {`;
const insert2 = `  renderColorRules() {
    const { containerEl } = this;
    
    containerEl.createEl('h2', { text: 'Dynamic Gantt Color Rules' });
    const rulesContainer = containerEl.createDiv('pos-settings-rules');
    rulesContainer.style.display = 'flex';
    rulesContainer.style.flexDirection = 'column';
    rulesContainer.style.gap = '16px';

    this.plugin.settings.colorRules.forEach((rule, index) => {
      const row = rulesContainer.createDiv('pos-rule-row');
      row.style.display = 'flex';
      row.style.gap = '12px';
      row.style.alignItems = 'center';
      row.style.padding = '12px';
      row.style.background = 'var(--background-secondary)';
      row.style.borderRadius = '8px';
      row.style.border = '1px solid var(--background-modifier-border)';
      
      const targetDate = new DropdownComponent(row)
        .addOptions({ 'deadline': 'Deadline', 'createdAt': 'Created At' })
        .setValue(rule.targetDate)
        .onChange(async (val: 'deadline' | 'createdAt') => {
          rule.targetDate = val;
          await this.plugin.saveSettings();
        });
      
      row.createSpan({ text: 'is relative to today' }).style.color = 'var(--text-muted)';
      
      const valueDrop = new DropdownComponent(row)
        .addOptions({
           'overdue': 'Overdue',
           'today': 'Today',
           'next 2 days': 'Next 2 Days',
           'next 3 days': 'Next 3 Days',
           'next week': 'Next Week',
           'next month': 'Next Month'
        })
        .setValue(rule.value)
        .onChange(async (val: any) => {
          rule.value = val;
          await this.plugin.saveSettings();
        });
        
      row.createSpan({ text: '=>' }).style.color = 'var(--text-muted)';
      
      const colorDrop = new DropdownComponent(row)
        .addOptions({
           '#E5484D': 'Red',
           '#FFB224': 'Orange',
           '#FFD60A': 'Yellow',
           '#A7C957': 'Caution Green',
           '#46A758': 'Safe Green',
           '#8A2BE2': 'Purple',
           '#1E90FF': 'Blue'
        })
        .setValue(rule.color)
        .onChange(async (val) => {
          rule.color = val;
          await this.plugin.saveSettings();
        });
        
      new ButtonComponent(row)
        .setIcon('trash')
        .setTooltip('Delete rule')
        .onClick(async () => {
          this.plugin.settings.colorRules.splice(index, 1);
          await this.plugin.saveSettings();
          this.display();
        });
    });

    new Setting(containerEl)
      .addButton(btn => btn
        .setButtonText('+ Add Rule')
        .onClick(async () => {
          this.plugin.settings.colorRules.push({
            id: Date.now().toString(),
            targetDate: 'deadline',
            condition: 'is relative to today',
            value: 'next 2 days',
            color: '#8A2BE2'
          });
          await this.plugin.saveSettings();
          this.display();
        }));
  }

  renderStatuses() {`;

if (!content.includes('renderColorRules() {')) {
  content = content.replace(target1, insert1).replace(target2, insert2);
  fs.writeFileSync(file, content);
  console.log('Added Color Rules UI to Settings');
} else {
  console.log('Color Rules UI already exists');
}
