import GameConfigManager from './game-config-manager';
import CanvasManager from './canvas-manager';
import { GAME_CONTAINER_ID, WORKER_SCRIPT_URL_MACRO } from './constants';
import { ActionMessage, GenerationInfo } from './interfaces';

export default class ConwaysGameOfLife extends HTMLElement {

  private configManager: GameConfigManager
  private canvasManager: CanvasManager;
  private worker?: Worker;

  constructor() {
    super();
    this.configManager = new GameConfigManager(this);
    this.initializeWebComponent();
  }

  private initializeWebComponent(): void {
    // Initializing the shadow DOM
    const template = document.createElement('template');
    const canvasContainer = document.createElement('div');
    canvasContainer.id = GAME_CONTAINER_ID;
    template.content.append(canvasContainer);
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.append(template.content);
    // Instantiate the canvas manager
    this.canvasManager = new CanvasManager(canvasContainer);
  }

  /**
   * Things that will happen on widget instantiation.
   */
  protected connectedCallback(): void {
    this.registerWidgetEvents();
    this.startGame();
  }

  /**
   * Things that will happen when a widget attribute is changed.
   * Replaces the game setting with a new one and restarts the game.
   * @param name Name of the setting that changed
   * @param oldValue Old value
   * @param newValue New value
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    this.configManager = new GameConfigManager(this);
    this.startGame();
  }

  private registerWidgetEvents(): void {
    // Register game restart event
    this.addEventListener('restart-game', () => this.startGame());
    // Register canvas double click as restart action
    this.addEventListener('dblclick', () => this.startGame());
  }

  private startGame(): void {
    // Set canvas dimensions
    const config = this.configManager.getConfig();
    this.canvasManager.instantiateCanvas(config);
    this.canvasManager.clearCanvas();

    if (this.worker) {
      this.worker.terminate();
    }

    // Instantiate a new worker
    this.worker = new Worker(WORKER_SCRIPT_URL_MACRO);

    // Listen to worker events to draw the canvas accordingly
    this.worker.addEventListener('message', event => {
      const generationInfo = event.data as GenerationInfo;
      const generationCount = generationInfo.generationCount || 0;
      const config = this.configManager.getConfig();

      this.canvasManager.updateCanvas(generationInfo.generation);

      if (config.showStats) {
        this.canvasManager.showStats(generationCount);
      }

      if (generationInfo.isExtinct) {
        // Kill the worker
        this.worker?.terminate();
        // Show extinction stats if configured so
        if (config.showExtinctionStats) {
          this.canvasManager.showExtinctionStats(generationCount);
        }
        // Restart the game after some interval if set up like so
        if (config.restartInterval !== 0) {
          setTimeout(() => this.startGame(), config.restartInterval);
        }
      }
    });

    this.worker.addEventListener('error', (error: unknown) => {
      this.worker?.terminate();
      console.warn('An error occured: ', error);
    });

    // Let the games begin!
    const message: ActionMessage = {
      action: 'new-game',
      config: this.configManager.getConfig()
    };
    this.worker.postMessage(message);
  }

}
