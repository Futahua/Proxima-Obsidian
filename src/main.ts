import { Plugin, ItemView, WorkspaceLeaf, Notice } from 'obsidian';
import { FileManager } from './data/FileManager';
import App from './ui/App.svelte';

const VIEW_TYPE = 'project-os-view';

class ProjectOSView extends ItemView {
  component: App | null = null;
  fileManager: FileManager;

  constructor(leaf: WorkspaceLeaf, fileManager: FileManager) {
    super(leaf);
    this.fileManager = fileManager;
  }

  getViewType() { return VIEW_TYPE; }
  getDisplayText() { return 'Project OS'; }
  getIcon() { return 'layout-dashboard'; }

  async onOpen() {
    this.component = new App({
      target: this.contentEl,
      props: {
        app: this.app,
        fileManager: this.fileManager
      }
    });
  }

  async onClose() {
    if (this.component) {
      this.component.$destroy();
    }
  }
}

export default class ProjectOSPlugin extends Plugin {
  fileManager!: FileManager;

  async onload() {
    console.log("Initializing Project OS...");
    new Notice("Initializing Project OS...");
    
    this.fileManager = new FileManager(this.app);

    this.app.workspace.onLayoutReady(async () => {
      try {
        await this.fileManager.initialize();
        console.log("Project OS: data initialized successfully!");
      } catch (e) {
        console.error("Project OS: failed to initialize data", e);
        new Notice("Project OS failed to initialize: " + e.message);
      }
    });

    this.registerView(
      VIEW_TYPE,
      (leaf) => new ProjectOSView(leaf, this.fileManager)
    );

    this.addRibbonIcon('layout-dashboard', 'Open Project OS', () => {
      this.activateView();
    });

    this.addCommand({
      id: 'open-project-os',
      name: 'Open Project OS Dashboard',
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
}
