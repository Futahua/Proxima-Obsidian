const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix the "+ Add Column" button
content = content.replace(
  /<div class="pos-board-col" style="min-width: 300px; background: transparent; border: 2px dashed var\(--background-modifier-border\); border-radius: 8px; display: flex; align-items: center; justify-content: center; opacity: 0.7; cursor: pointer; margin-left: 10px; transition: opacity 0.2s;" on:click=\{addColumn\} on:mouseenter=\{\(e\) => e.currentTarget.style.opacity = '1'\} on:mouseleave=\{\(e\) => e.currentTarget.style.opacity = '0.7'\}>\s*<span style="font-size: 1.2em; font-weight: 600; color: var\(--text-muted\);">\+ Add Column<\/span>\s*<\/div>/g,
  ""
);

content = content.replace(
  /<div class="pos-board-workspace"/,
  `<div class="pos-board-header-actions" style="position: absolute; top: 10px; right: 20px; z-index: 10;">
     <button class="pos-btn" style="padding: 4px 10px; font-weight: bold; background: var(--interactive-accent); color: var(--text-on-accent);" on:click={addColumn}>+ Add Kanban Column</button>
   </div>
   <div class="pos-board-workspace"`
);

// 2. Wrap properties vertically in the card
const oldMeta = `<div class="pos-ptc-meta">
                  <span>W:{task.weight || 1}</span>
                  {#each getCustomProps(task) as prop}
                    {#if prop.color}
                      <span class="pos-tag-pill" style="background-color: {prop.color}20; color: {prop.color}; border: 1px solid {prop.color}40;">
                        {prop.value}
                      </span>
                    {:else}
                      <span class="pos-tag-pill" style="background-color: var(--background-modifier-border); color: var(--text-muted);">
                        {prop.name}: {prop.value}
                      </span>
                    {/if}
                  {/each}
                </div>`;
                
const newMeta = `<div class="pos-ptc-meta" style="display: flex; flex-direction: column; gap: 4px; margin-top: 8px; align-items: flex-start;">
                  <span style="font-size: 0.85em; opacity: 0.7;">W:{task.weight || 1}</span>
                  {#each getCustomProps(task) as prop}
                    {#if prop.color}
                      <span class="pos-tag-pill" style="background-color: {prop.color}20; color: {prop.color}; border: 1px solid {prop.color}40; display: inline-block; white-space: normal; text-align: left; line-height: 1.2;">
                        <span style="opacity: 0.7; font-size: 0.9em; margin-right: 4px;">{prop.name}:</span>{prop.value}
                      </span>
                    {:else}
                      <span class="pos-tag-pill" style="background-color: var(--background-modifier-border); color: var(--text-normal); display: inline-block; white-space: normal; text-align: left; line-height: 1.2; border: 1px solid var(--background-modifier-border-hover);">
                        <span style="opacity: 0.7; font-size: 0.9em; margin-right: 4px;">{prop.name}:</span>{prop.value}
                      </span>
                    {/if}
                  {/each}
                </div>`;
content = content.replace(oldMeta, newMeta);

// 3. Confirm Delete Kanban
const oldDeleteCol = `async function deleteColumn(colId: string) {
    const settings = await ensureProjectStatuses();
    const ps = settings.projectStatuses[projectId];
    const idx = ps.findIndex(s => s.id === colId);
    if (idx !== -1) {
      ps.splice(idx, 1);
      await fileManager.plugin.saveSettings();
      fileManager.plugin.settings = settings;
    }
  }`;

const newDeleteCol = `async function deleteColumn(colId: string) {
    if (!confirm("Are you sure you want to delete this column? ALL TASKS inside this column will also be permanently deleted!")) return;
    
    // Delete all tasks in this column
    const tasksToDelete = projectTasks.filter(t => t.status === colId);
    for (const t of tasksToDelete) {
      await fileManager.deleteTask(t.id);
    }
    
    // Delete the column
    const settings = await ensureProjectStatuses();
    const ps = settings.projectStatuses[projectId];
    const idx = ps.findIndex(s => s.id === colId);
    if (idx !== -1) {
      ps.splice(idx, 1);
      await fileManager.plugin.saveSettings();
      fileManager.plugin.settings = settings;
    }
  }`;
content = content.replace(oldDeleteCol, newDeleteCol);


fs.writeFileSync(file, content);
console.log('Patched UI requests');
