<script lang="ts">
  import { App as ObsidianApp, TFile } from 'obsidian';
  import type { FileManager } from '../../../data/FileManager';
  import { QuickEditTaskModal, ConfirmModal } from '../../../modals/Modals';
  import type { TaskData, TaskStatus } from '../../../types';

  export let app;
  export let fileManager: FileManager;
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
  }

  // Search & Filter state
  let searchQuery = '';
  let tagFilter: string | null = null;

  $: uniqueTags = Array.from(new Set(projectTasks.flatMap(t => t.tags || []))).sort();

  // Sorting state
  let sortBy: 'name' | 'weight' | 'status' | 'createdAt' | 'priority' | 'tags' = 'name';
  let sortOrder: 'asc' | 'desc' = 'asc';

  // Multi-select state
  let selectedTaskIds = new Set<string>();

  $: filteredTasks = projectTasks.filter(task => {
    // 1. Search Query filter
    const matchesSearch = 
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    // 2. Tag filter
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
  });

  // Apply sorting
  $: sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'tags') {
      const aCount = (a.tags || []).length;
      const bCount = (b.tags || []).length;
      if (aCount !== bCount) return sortOrder === 'asc' ? (aCount - bCount) : (bCount - aCount);
      const aName = (a.tags || []).join(', ').toLowerCase();
      const bName = (b.tags || []).join(', ').toLowerCase();
      if (aName < bName) return sortOrder === 'asc' ? -1 : 1;
      if (aName > bName) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    }
    
    let fieldA: any = a[sortBy];
    let fieldB: any = b[sortBy];

    if (typeof fieldA === 'string') {
      fieldA = fieldA.toLowerCase();
      fieldB = fieldB.toLowerCase();
    }

    if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Handle individual selection toggling
  function toggleSelection(id: string) {
    if (selectedTaskIds.has(id)) {
      selectedTaskIds.delete(id);
    } else {
      selectedTaskIds.add(id);
    }
    selectedTaskIds = selectedTaskIds; // trigger reactivity
  }

  // Handle select all
  $: allSelected = sortedTasks.length > 0 && sortedTasks.every(t => selectedTaskIds.has(t.id));
  
  function toggleSelectAll() {
    if (allSelected) {
      sortedTasks.forEach(t => selectedTaskIds.delete(t.id));
    } else {
      sortedTasks.forEach(t => selectedTaskIds.add(t.id));
    }
    selectedTaskIds = selectedTaskIds; // trigger reactivity
  }

  // Bulk actions
  async function bulkActivate() {
    if (selectedTaskIds.size === 0) return;
    const ids = Array.from(selectedTaskIds);
    await Promise.all(ids.map(id => 
      fileManager.updateTask(id, { status: 'backlog', isCompleted: false })
    ));
    selectedTaskIds.clear();
    selectedTaskIds = selectedTaskIds;
  }

  async function bulkPlan() {
    if (selectedTaskIds.size === 0) return;
    const ids = Array.from(selectedTaskIds);
    await Promise.all(ids.map(id => 
      fileManager.updateTask(id, { status: 'planned', isCompleted: false })
    ));
    selectedTaskIds.clear();
    selectedTaskIds = selectedTaskIds;
  }

  async function bulkComplete() {
    if (selectedTaskIds.size === 0) return;
    const ids = Array.from(selectedTaskIds);
    await Promise.all(ids.map(id => 
      fileManager.updateTask(id, { status: 'review', isCompleted: true })
    ));
    selectedTaskIds.clear();
    selectedTaskIds = selectedTaskIds;
  }

  function bulkDelete() {
    if (selectedTaskIds.size === 0) return;
    new ConfirmModal(app, 'Bulk Delete Tasks', `Permanently delete all ${selectedTaskIds.size} selected tasks?`, async () => {
      const ids = Array.from(selectedTaskIds);
      await Promise.all(ids.map(id => fileManager.deleteTask(id)));
      selectedTaskIds.clear();
      selectedTaskIds = selectedTaskIds;
    }).open();
  }

  function toggleSort(field: typeof sortBy) {
    if (sortBy === field) {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      sortBy = field;
      sortOrder = 'asc';
    }
  }

  function editTask(task: TaskData) {
    new QuickEditTaskModal(app, fileManager.plugin, task, async (updates) => {
      await fileManager.updateTask(task.id, updates);
    }).open();
  }

  function openTaskFile(taskId: string) {
    const file = app.vault.getAbstractFileByPath(`tasks/${taskId}.md`);
    if (file instanceof TFile) {
      app.workspace.getLeaf().openFile(file);
    }
  }
</script>

<div class="pos-grid-workspace">
  <!-- TAG FILTER BAR -->
  {#if uniqueTags.length > 0}
    <div class="pos-tag-filter-bar">
      <button class="pos-tag-filter-pill" class:active={tagFilter === null} on:click={() => tagFilter = null}>All Tags</button>
      {#each uniqueTags as tag}
        <button class="pos-tag-filter-pill" class:active={tagFilter === tag} on:click={() => tagFilter = tag}>{tag}</button>
      {/each}
    </div>
  {/if}

  <!-- FILTER BAR -->
  <div class="pos-grid-filter-bar">
    <input 
      type="text" 
      placeholder="Search planned task names or descriptions..." 
      bind:value={searchQuery} 
      class="pos-grid-search-input" 
    />
    
  </div>
  
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
  </div>

  <!-- BULK ACTIONS ACTION BAR -->
  {#if selectedTaskIds.size > 0}
    <div class="pos-bulk-bar">
      <span class="pos-bulk-bar-count">{selectedTaskIds.size} tasks selected</span>
      <div class="pos-bulk-bar-acts">
        <button class="pos-bulk-act-btn activate" on:click={bulkActivate}>
          Activate (Move to Backlog)
        </button>
        <button class="pos-bulk-act-btn plan" on:click={bulkPlan}>
          Deactivate (Move to Planned)
        </button>
        <button class="pos-bulk-act-btn complete" on:click={bulkComplete}>
          Complete
        </button>
        <button class="pos-bulk-act-btn delete pos-del" on:click={bulkDelete}>
          Delete Permanently
        </button>
      </div>
    </div>
  {/if}

  <!-- GRID TABLE LIST -->
  <div class="pos-grid-table-container">
    <table class="pos-grid-table">
      <thead>
        <tr>
          <th class="pos-th-check">
            <input type="checkbox" checked={allSelected} on:change={toggleSelectAll} />
          </th>
          <th class="pos-th-name" on:click={() => toggleSort('name')}>
            Task Name {sortBy === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </th>
          <th class="pos-th-status" on:click={() => toggleSort('status')}>
            Status {sortBy === 'status' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </th>
          <th class="pos-th-priority" on:click={() => toggleSort('priority')}>
            Priority {sortBy === 'priority' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </th>
          <th class="pos-th-tags" on:click={() => toggleSort('tags')}>
            Tags {sortBy === 'tags' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </th>
          <th class="pos-th-weight" on:click={() => toggleSort('weight')}>
            Weight {sortBy === 'weight' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </th>
          <th class="pos-th-date" on:click={() => toggleSort('createdAt')}>
            Created {sortBy === 'createdAt' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </th>
          <th class="pos-th-acts">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#if sortedTasks.length === 0}
          <tr>
            <td colspan="8" class="pos-empty-grid">
              No tasks match your search filters.
            </td>
          </tr>
        {:else}
          {#each sortedTasks as task (task.id)}
            <tr class:selected={selectedTaskIds.has(task.id)} class:completed={task.isCompleted}>
              <td class="pos-td-check">
                <input 
                  type="checkbox" 
                  checked={selectedTaskIds.has(task.id)} 
                  on:change={() => toggleSelection(task.id)} 
                />
              </td>
              <td class="pos-td-name">
                <div class="pos-td-name-cell">
                  <span class="pos-td-task-title" on:click={() => editTask(task)}>
                    {task.name}
                  </span>
                  {#if task.description}
                    <span class="pos-td-task-desc">{task.description}</span>
                  {/if}
                </div>
              </td>
              <td class="pos-td-status">
                <span class="pos-ptc-status-badge {task.status}">
                  {task.status.toUpperCase()}
                </span>
              </td>
              <td class="pos-td-priority">
                {#if task.priority === 1}
                  <span class="pos-priority-badge high">High</span>
                {:else if task.priority === 2}
                  <span class="pos-priority-badge medium">Medium</span>
                {:else}
                  <span class="pos-priority-badge low">Low</span>
                {/if}
              </td>
              <td class="pos-td-tags">
                <div class="pos-card-meta">
                  {#if task.tags}
                    {#each task.tags as tag}
                      <span class="pos-tag-pill" style="cursor: pointer;" on:click|stopPropagation={() => tagFilter = tag}>{tag}</span>
                    {/each}
                  {/if}
                </div>
              </td>
              <td class="pos-td-weight font-mono">
                {task.weight}
              </td>
              <td class="pos-td-date font-mono">
                {new Date(task.createdAt).toLocaleDateString()}
              </td>
              <td class="pos-td-acts">
                <div class="pos-grid-row-acts">
                  <button class="pos-del" on:click={() => fileManager.deleteTask(task.id)}>Delete</button>
                </div>
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</div>
