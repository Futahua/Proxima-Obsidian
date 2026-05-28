import { Plugin, ItemView, WorkspaceLeaf, Notice } from 'obsidian';
import { get } from 'svelte/store';
import { FileManager } from './data/FileManager';
import { projectsStore } from './stores/data';
import App from './ui/App.svelte';
import ProjectsView from './ui/views/ProjectsView.svelte';
import { ProximaSettings, DEFAULT_SETTINGS, ProximaSettingTab } from './settings';

const VIEW_TYPE = 'proxima-view';
const WORKSPACE_VIEW_TYPE = 'proxima-workspace-view';

class ProximaView extends ItemView {
  component: App | null = null;
  fileManager: FileManager;
  plugin: ProximaPlugin;

  constructor(leaf: WorkspaceLeaf, fileManager: FileManager, plugin: ProximaPlugin) {
    super(leaf);
    this.fileManager = fileManager;
    this.plugin = plugin;
  }

  getViewType() { return VIEW_TYPE; }
  getDisplayText() { return 'Proxima'; }
  getIcon() { return 'layout-dashboard'; }

  async onOpen() {
    this.component = new App({
      target: this.contentEl,
      props: {
        app: this.app,
        fileManager: this.fileManager,
        plugin: this.plugin
      }
    });
  }

  async onClose() {
    if (this.component) {
      this.component.$destroy();
    }
  }
}

class ProjectWorkspaceView extends ItemView {
  component: ProjectsView | null = null;
  fileManager: FileManager;
  plugin: ProximaPlugin;
  projectId: string | null = null;

  constructor(leaf: WorkspaceLeaf, fileManager: FileManager, plugin: ProximaPlugin) {
    super(leaf);
    this.fileManager = fileManager;
    this.plugin = plugin;
  }

  getViewType() { return WORKSPACE_VIEW_TYPE; }

  getDisplayText() {
    if (this.projectId) {
      const proj = get(projectsStore).find(p => p.id === this.projectId);
      if (proj) return `${proj.name} - Project Workspace`;
    }
    return 'Project Workspace';
  }

  getIcon() { return 'folder-kanban'; }

  async setState(state: any, result: any) {
    this.projectId = state.projectId || null;
    this.leaf.updateHeader();

    if (this.component) {
      this.component.$set({ selectedProjectId: this.projectId });
    } else {
      this.component = new ProjectsView({
        target: this.contentEl,
        props: {
          app: this.app,
          fileManager: this.fileManager,
          plugin: this.plugin,
          selectedProjectId: this.projectId,
          isFullPage: true
        }
      });
    }
    await super.setState(state, result);
  }

  async onClose() {
    if (this.component) {
      this.component.$destroy();
    }
  }
}

export default class ProximaPlugin extends Plugin {
  fileManager!: FileManager;
  settings!: ProximaSettings;

  async onload() {
    try {
      console.log("Initializing Proxima...");
      new Notice("Initializing Proxima...");
      
      await this.loadSettings();

      this.fileManager = new FileManager(this.app, this);

      this.addSettingTab(new ProximaSettingTab(this.app, this));

      this.app.workspace.onLayoutReady(async () => {
        try {
          await this.fileManager.initialize();
          console.log("Proxima: data initialized successfully!");
          
          // Schema Migration
          let didMigrate = false;
          // Status Migration
          if (this.settings.statuses && this.settings.statuses.length > 0) {
            const projects = get(projectsStore);
            if (!this.settings.globalStatuses) this.settings.globalStatuses = {};
            if (!this.settings.projectStatuses) this.settings.projectStatuses = {};
            
            // Extract the global overrides if any
            const coreIds = ['backlog', 'running', 'review'];
            for (const s of this.settings.statuses) {
               if (coreIds.includes(s.id)) {
                 this.settings.globalStatuses[s.id] = s;
               }
            }
            
            // Extract the custom ones and copy to all projects as legacy
            const custom = this.settings.statuses.filter(s => !coreIds.includes(s.id));
            if (custom.length > 0) {
              for (const p of projects) {
                 if (!this.settings.projectStatuses[p.id]) {
                   this.settings.projectStatuses[p.id] = JSON.parse(JSON.stringify(custom));
                 }
              }
            }
            
            delete this.settings.statuses;
            await this.saveSettings();
          }

          if (this.settings.taskSchema && this.settings.taskSchema.length > 0) {
            const projects = get(projectsStore);
            if (!this.settings.projectSchemas) this.settings.projectSchemas = {};
            if (!this.settings.projectVisibleProps) this.settings.projectVisibleProps = {};
            
            for (const p of projects) {
               if (!this.settings.projectSchemas[p.id]) {
                 this.settings.projectSchemas[p.id] = JSON.parse(JSON.stringify(this.settings.taskSchema));
                 this.settings.projectVisibleProps[p.id] = this.settings.taskSchema.map(s => s.id);
                 didMigrate = true;
               }
            }
            if (didMigrate) {
               delete this.settings.taskSchema;
               await this.saveSettings();
            }
          }
          
        } catch (e) {
          console.error("Proxima: failed to initialize data", e);
          new Notice("Proxima failed to initialize: " + e.message);
        }
      });

      try {
        this.registerView(
          VIEW_TYPE,
          (leaf) => new ProximaView(leaf, this.fileManager, this)
        );
      } catch (e) {
        console.warn('View already registered:', VIEW_TYPE);
      }

      try {
        this.registerView(
          WORKSPACE_VIEW_TYPE,
          (leaf) => new ProjectWorkspaceView(leaf, this.fileManager, this)
        );
      } catch (e) {
        console.warn('View already registered:', WORKSPACE_VIEW_TYPE);
      }

      this.addRibbonIcon('layout-dashboard', 'Open Proxima', () => {
        this.activateView();
      });

      this.addCommand({
        id: 'open-proxima',
        name: 'Open Proxima Dashboard',
        callback: () => this.activateView(),
      });

      // Reactive listener for external changes
      this.registerEvent(
        this.app.metadataCache.on('changed', async (file) => {
          if (file.path.startsWith('tasks/') || file.path.startsWith('projects/')) {
            await this.fileManager.loadAll();
          }
        })
      );

      this.registerEvent(
        this.app.vault.on('create', async (file) => {
          if (file.path.startsWith('tasks/') || file.path.startsWith('projects/')) {
            await this.fileManager.loadAll();
          }
        })
      );

      this.registerEvent(
        this.app.vault.on('delete', async (file) => {
          if (file.path.startsWith('tasks/') || file.path.startsWith('projects/')) {
            await this.fileManager.loadAll();
          }
        })
      );
    } catch (e) {
      new Notice("ONLOAD CRASH: " + (e.message || e), 10000);
      throw e;
    }
  }

  async activateView() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE)[0];
    if (!leaf) {
      leaf = workspace.getRightLeaf(false) || workspace.getLeaf(false);
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
    }
    workspace.revealLeaf(leaf);
  }

  async activateWorkspaceView(projectId: string) {
    const { workspace } = this.app;
    
    // Look for existing leaf with this project ID in its state
    let leaf = workspace.getLeavesOfType(WORKSPACE_VIEW_TYPE).find(l => {
      const view = l.view as ProjectWorkspaceView;
      return view.projectId === projectId;
    });

    if (!leaf) {
      // Create new tab in the central workspace editor area
      leaf = workspace.getLeaf('tab');
      await leaf.setViewState({
        type: WORKSPACE_VIEW_TYPE,
        active: true,
        state: { projectId }
      });
    }

    workspace.revealLeaf(leaf);
  }

  async loadSettings() {
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
  }

  async saveSettings() {
    await this.saveData(this.settings);
    // Optional: trigger a re-render or event to update views
  }

  onunload() {
    console.log("Unloading Proxima...");
    this.app.workspace.detachLeavesOfType(VIEW_TYPE);
    this.app.workspace.detachLeavesOfType(WORKSPACE_VIEW_TYPE);
  }
}
