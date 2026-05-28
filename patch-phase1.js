const fs = require('fs');

// PATCH ProjectTaskBoard.svelte
const boardFile = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/views/components/ProjectTaskBoard.svelte';
let boardContent = fs.readFileSync(boardFile, 'utf8');

// 1. Fix Drag Math
const colSpliceOld = `    const fromIndex = settings.statuses.findIndex(s => s.id === dragColId);
    const [movedItem] = settings.statuses.splice(fromIndex, 1);
    
    // We drop it at targetIdx (which is relative to the visible columns in the DOM)
    // Actually, mapping DOM index to settings index is tricky if settings has hidden columns.
    // Let's just insert it before 'id'. If we dropped on the right side of the last element, we append.
    let toIndex = settings.statuses.findIndex(s => s.id === id);
    // Since we use the mouse position in dragOver, we can just check if targetIdx is after the current ID
    // But since Svelte re-renders, it's easier to just insert before the column we hovered on if the mouse is on its left half.
    // If the mouse is on its right half, the targetIndex would be i+1.
    // Let's approximate: if we drop, just insert it at toIndex.
    settings.statuses.splice(toIndex, 0, movedItem);`;

const colSpliceNew = `    const fromIndex = settings.statuses.findIndex(s => s.id === dragColId);
    const oldToIndex = settings.statuses.findIndex(s => s.id === id);
    const [movedItem] = settings.statuses.splice(fromIndex, 1);
    const newToIndex = settings.statuses.findIndex(s => s.id === id);
    const finalIndex = fromIndex < oldToIndex ? newToIndex + 1 : newToIndex;
    settings.statuses.splice(finalIndex, 0, movedItem);`;

boardContent = boardContent.replace(colSpliceOld, colSpliceNew);

// 2. Fix Task Creation Params
const taskCreateOld = `await fileManager.createTask(name, pid, { status: statusId });`;
const taskCreateNew = `await fileManager.createTask({ name, project: pid, status: statusId });`;
boardContent = boardContent.replace(taskCreateOld, taskCreateNew);

// 3. Add Elastic Class
const colClassOld = `<div class="pos-board-col" class:pos-dragging-source={dragColId === col.id}>`;
const colClassNew = `<div class="pos-board-col" class:pos-dragging-source={dragColId === col.id} class:pos-col-elastic={['backlog', 'running', 'review'].includes(col.id)}>`;
boardContent = boardContent.replace(colClassOld, colClassNew);

fs.writeFileSync(boardFile, boardContent);

// PATCH App.svelte
const appFile = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/src/ui/App.svelte';
let appContent = fs.readFileSync(appFile, 'utf8');

const modeOld = `let mode: 'projects' | 'elastic' | 'deadlines' = 'projects';`;
const modeNew = `let mode: 'projects' | 'elastic' | 'deadlines' = 'elastic';`;
appContent = appContent.replace(modeOld, modeNew);

const navBarOld = `<div class="pos-mode-bar">
    <button class="pos-mode-btn" class:pos-mode-active={mode === 'projects'} on:click={() => mode = 'projects'}>Projects</button>
    <button class="pos-mode-btn" class:pos-mode-active={mode === 'elastic'} on:click={() => mode = 'elastic'}>Elastic</button>
    <button class="pos-mode-btn" class:pos-mode-active={mode === 'deadlines'} on:click={() => mode = 'deadlines'}>Deadlines</button>
    
    {#if mode !== 'projects'}
      <div class="pos-project-selector-row">`;

const navBarNew = `<div class="pos-mode-bar">
    <button class="pos-mode-btn" class:pos-mode-active={mode === 'elastic'} on:click={() => mode = 'elastic'}>Elastic</button>
    <button class="pos-mode-btn" class:pos-mode-active={mode === 'deadlines'} on:click={() => mode = 'deadlines'}>Deadlines</button>
    
    {#if mode !== 'projects'}
      <div class="pos-project-selector-row">`;

appContent = appContent.replace(navBarOld, navBarNew);

const settingsBtnOld = `<button 
      class="pos-settings-btn"`;
const settingsBtnNew = `<button class="pos-mode-btn" class:pos-mode-active={mode === 'projects'} on:click={() => mode = 'projects'}>Project Hub</button>
    <button 
      class="pos-settings-btn"`;
appContent = appContent.replace(settingsBtnOld, settingsBtnNew);

fs.writeFileSync(appFile, appContent);

console.log('Phase 1 patches applied');
