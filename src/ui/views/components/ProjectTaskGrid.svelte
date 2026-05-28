<script lang="ts">
  import { App as ObsidianApp, TFile } from 'obsidian';
  import type { FileManager } from '../../../data/FileManager';
  import { QuickEditTaskModal, ConfirmModal } from '../../../modals/Modals';
  import type { TaskData, TaskStatus } from '../../../types';

  export let app;
  export let fileManager: FileManager;
  export let projectTasks: TaskData[];

  // Search & Filter state
  let searchQuery = '';
  let statusFilter: 'all' | 'planned' | 'active' | 'review' = 'all';
  let priorityFilter: 'all' | 1 | 2 | 3 = 'all';
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

    // 2. Status Group filter
    if (statusFilter === 'planned' && task.status !== 'planned') return false;
    if (statusFilter === 'active' && task.status !== 'backlog' && task.status !== 'running') return false;
    if (statusFilter === 'review' && task.status !== 'review') return false;

    // 3. Priority filter
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

    // 4. Tag filter
    if (tagFilter && !(task.tags || []).includes(tagFilter)) return false;

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
    
    <select bind:value={statusFilter} class="pos-grid-select-filter">
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
