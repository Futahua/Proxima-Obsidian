const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/modals/Modals.ts';
let content = fs.readFileSync(file, 'utf8');

const target = `    const renderSchema = () => {
      schemaContainer.empty();
      const schemaList = this.plugin.settings.projectSchemas[this.projectId];
      const visibleList = this.plugin.settings.projectVisibleProps[this.projectId];`;

const replacement = `    const renderSchema = () => {
      try {
      schemaContainer.empty();
      const schemaList = this.plugin.settings.projectSchemas[this.projectId] || [];
      const visibleList = this.plugin.settings.projectVisibleProps[this.projectId] || [];`;

content = content.replace(target, replacement);

const endTarget = `      btnRow.style.marginTop = '10px';
      new ButtonComponent(btnRow)
        .setButtonText('+ Add Property')
        .setCta()
        .onClick(async () => {
          const newId = 'prop-' + Date.now();
          schemaList.push({
            id: newId,
            name: 'New Property',
            type: 'text'
          });
          this.plugin.settings.projectVisibleProps[this.projectId].push(newId);
          await this.plugin.saveSettings();
          renderSchema();
        });
    };`;

const endReplacement = `      btnRow.style.marginTop = '10px';
      new ButtonComponent(btnRow)
        .setButtonText('+ Add Property')
        .setCta()
        .onClick(async () => {
          const newId = 'prop-' + Date.now();
          schemaList.push({
            id: newId,
            name: 'New Property',
            type: 'text'
          });
          this.plugin.settings.projectVisibleProps[this.projectId].push(newId);
          await this.plugin.saveSettings();
          renderSchema();
        });
      } catch (err) {
        console.error("Proxima schema render error:", err);
        schemaContainer.createEl('div', { text: "Error rendering schema: " + err.message, cls: 'pos-error-text' });
      }
    };`;

content = content.replace(endTarget, endReplacement);

fs.writeFileSync(file, content);
console.log('Patched Modals.ts renderSchema error boundary');
