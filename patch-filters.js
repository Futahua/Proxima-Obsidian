const fs = require('fs');
let file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskGrid.svelte';
let content = fs.readFileSync(file, 'utf8');

// 1. Setup FilterRule state and persistence
const importsOld = `  export let fileManager: FileManager;
  export let projectTasks: TaskData[];`;
const importsNew = `  export let fileManager: FileManager;
  export let projectTasks: TaskData[];
  export let projectId: string;
  import type { FilterRule } from '../../../types';
  
  // Dynamic Filters
  $: schema = fileManager.plugin.settings.taskSchema || [];
  $: projectFilters = (fileManager.plugin.settings.projectFilters || {})[projectId] || [];
  
  async function saveFilters() {
    if (!fileManager.plugin.settings.projectFilters) fileManager.plugin.settings.projectFilters = {};
    fileManager.plugin.settings.projectFilters[projectId] = projectFilters;
    await fileManager.plugin.saveSettings();
  }
  
  function addFilter() {
    projectFilters = [...projectFilters, { id: Math.random().toString(), property: 'status', operator: 'is', value: '' }];
    saveFilters();
  }
  
  function removeFilter(id: string) {
    projectFilters = projectFilters.filter(f => f.id !== id);
    saveFilters();
  }`;

content = content.replace(importsOld, importsNew);

// 2. Replace hardcoded filters with dynamic filter application
const filterStateOld = `  // Search & Filter state
  let searchQuery = '';
  let statusFilter: 'all' | 'planned' | 'active' | 'review' = 'all';
  let priorityFilter: 'all' | 1 | 2 | 3 = 'all';
  let tagFilter: string | null = null;`;
const filterStateNew = `  // Search & Filter state
  let searchQuery = '';
  let tagFilter: string | null = null;`;
content = content.replace(filterStateOld, filterStateNew);

const applyFiltersOld = `    // 2. Status Group filter
    if (statusFilter === 'planned' && task.status !== 'planned') return false;
    if (statusFilter === 'active' && task.status !== 'backlog' && task.status !== 'running') return false;
    if (statusFilter === 'review' && task.status !== 'review') return false;

    // 3. Priority filter
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

    // 4. Tag filter
    if (tagFilter && !(task.tags || []).includes(tagFilter)) return false;

    return true;
  });`;
const applyFiltersNew = `    // 2. Tag filter
    if (tagFilter && !(task.tags || []).includes(tagFilter)) return false;

    // 3. Dynamic Property Filters
    for (const rule of projectFilters) {
      if (!rule.property) continue;
      
      let taskValue;
      if (rule.property === 'status') taskValue = task.status;
      else if (rule.property === 'isCompleted') taskValue = task.isCompleted;
      else if (rule.property === 'name') taskValue = task.name;
      else taskValue = task.properties ? task.properties[rule.property] : undefined;
      
      const rVal = rule.value;
      const op = rule.operator;
      
      if (op === 'is-empty') {
        if (taskValue !== undefined && taskValue !== null && taskValue !== '') return false;
      } else if (op === 'not-empty') {
        if (taskValue === undefined || taskValue === null || taskValue === '') return false;
      } else if (op === 'is') {
        if (String(taskValue) !== String(rVal)) return false;
      } else if (op === 'is-not') {
        if (String(taskValue) === String(rVal)) return false;
      } else if (op === 'contains') {
        if (!String(taskValue).toLowerCase().includes(String(rVal).toLowerCase())) return false;
      } else if (op === 'not-contains') {
        if (String(taskValue).toLowerCase().includes(String(rVal).toLowerCase())) return false;
      } else if (op === 'gt') {
        if (Number(taskValue) <= Number(rVal)) return false;
      } else if (op === 'lt') {
        if (Number(taskValue) >= Number(rVal)) return false;
      }
    }

    return true;
  });`;
content = content.replace(applyFiltersOld, applyFiltersNew);

// 3. Replace the UI filter bar
const filterBarOld = `    <select bind:value={statusFilter} class="pos-grid-select-filter">
      <option value="all">All Task States</option>
      <option value="planned">Planned (Inactive)</option>
      <option value="active">Active (Backlog/Running)</option>
      <option value="review">Review (Completed)</option>
    </select>
    
    <select bind:value={priorityFilter} class="pos-grid-select-filter">
      <option value="all">All Priorities</option>
      <option value={1}>High Priority</option>
      <option value={2}>Medium Priority</option>
      <option value={3}>Low Priority</option>
    </select>
  </div>`;
const filterBarNew = `  </div>
  
  <div class="pos-dynamic-filters">
    {#each projectFilters as filter (filter.id)}
      <div class="pos-filter-rule" style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
        <select bind:value={filter.property} on:change={saveFilters} class="pos-grid-select-filter">
          <option value="status">Status</option>
          <option value="isCompleted">Is Completed</option>
          <option value="name">Task Name</option>
          <optgroup label="Custom Properties">
            {#each schema as prop}
              <option value={prop.id}>{prop.name}</option>
            {/each}
          </optgroup>
        </select>
        
        <select bind:value={filter.operator} on:change={saveFilters} class="pos-grid-select-filter">
          <option value="is">Is</option>
          <option value="is-not">Is Not</option>
          <option value="contains">Contains</option>
          <option value="not-contains">Does Not Contain</option>
          <option value="gt">Greater Than</option>
          <option value="lt">Less Than</option>
          <option value="is-empty">Is Empty</option>
          <option value="not-empty">Is Not Empty</option>
        </select>
        
        {#if filter.operator !== 'is-empty' && filter.operator !== 'not-empty'}
          <input type="text" bind:value={filter.value} on:input={saveFilters} class="pos-grid-search-input" style="flex: 1; max-width: 200px;" placeholder="Value..." />
        {/if}
        
        <button class="pos-del" style="padding: 4px 8px;" on:click={() => removeFilter(filter.id)}>x</button>
      </div>
    {/each}
    <button class="pos-fb-new-btn" style="margin-bottom: 12px; font-size: 0.8em;" on:click={addFilter}>+ Add Filter</button>
  </div>`;
content = content.replace(filterBarOld, filterBarNew);

fs.writeFileSync(file, content);
console.log('Patched ProjectTaskGrid.svelte filters');
