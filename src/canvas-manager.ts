import { GameConfig } from './interfaces';
import { Population } from './types';

const FONT_SIZE = 25;
const STAT_BAR_HEIGHT = 25;
const TEXT_OFFSET= 4;

export default class CanvasManager {

  private canvas: HTMLCanvasElement;
  private config: GameConfig;
  private previousGeneration?: Population;

  private get ctx(): CanvasRenderingContext2D {
    return this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  constructor(canvasContainer: HTMLDivElement) {
    this.canvas = document.createElement('canvas');
    canvasContainer.appendChild(this.canvas);
  }

  /**
   * Sets canvas dimensions.
   * @param config Game config
   */
  public instantiateCanvas(config: GameConfig): void {
    this.config = config;
    this.canvas.width = config.cols * (config.cellSize + config.cellSpacing) + config.cellSpacing;

    let height = config.rows * (config.cellSize + config.cellSpacing) + config.cellSpacing;
    if (config.showStats) {
      height = height + STAT_BAR_HEIGHT;
    }

    this.canvas.height = height;
  }

  /**
   * Remove all the cells from the canvas and paint it black.
   */
  public clearCanvas(): void {
    delete this.previousGeneration;
    this.ctx.fillStyle = this.config.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Fills the canvas with the latest population state.
   * @param population Population to draw
   */
  public updateCanvas(population: Population): void {
    const cellDistance = this.config.cellSpacing + this.config.cellSize;

    // Drawing live cells
    this.ctx.fillStyle = this.config.cellColor;
    for (let row = 0; row < population.length; row++) {
      for (let col = 0; col < population[row].length; col++) {
        if (population[row][col]) {
          const differentOrEmpty = this.previousGeneration ? !this.previousGeneration[row][col] : true;
          if (differentOrEmpty) {
            const x = this.config.cellSpacing + col * cellDistance;
            const y = this.config.cellSpacing + row * cellDistance;
            this.ctx.fillRect(x, y, this.config.cellSize, this.config.cellSize);
          }
        }
      }
    }

    // Drawing dead cells
    this.ctx.fillStyle = this.config.deadCellColor;
    for (let row = 0; row < population.length; row++) {
      for (let col = 0; col < population[row].length; col++) {
        if (!population[row][col]) {
          const differentOrEmpty = this.previousGeneration ? this.previousGeneration[row][col] : true;
          if (differentOrEmpty) {
            const x = this.config.cellSpacing + col * cellDistance;
            const y = this.config.cellSpacing + row * cellDistance;
            this.ctx.fillRect(x, y, this.config.cellSize, this.config.cellSize);
          }
        }
      }
    }

    this.previousGeneration = population;
  }

  /**
   * Updates the bar with generation count.
   * @param generationCount Generation index
   */
  public showStats(generationCount: number): void {
    // Clear the previous count
    this.ctx.fillStyle = this.config.backgroundColor;
    this.ctx.fillRect(0, this.canvas.height - STAT_BAR_HEIGHT, this.canvas.width, STAT_BAR_HEIGHT);
    // Draw the stats
    this.ctx.textAlign = 'start';
    this.ctx.fillStyle = this.config.fontColor;
    this.ctx.font = `${ FONT_SIZE }px Arial`;
    this.ctx.fillText(`Generation: ${ generationCount}`, TEXT_OFFSET, this.canvas.height - TEXT_OFFSET);
  }

  /**
   * Draws a panel notifying that the game is over, and shows the stats.
   * @param generationCount Number of generations until extinciton is reached
   */
  public showExtinctionStats(generationCount: number): void {
    // Draw a background
    this.ctx.fillStyle = this.config.backgroundColor;
    this.ctx.fillRect(0, this.canvas.height / 2 - 50, this.canvas.width, 100);
    // Draw the information
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = this.config.fontColor;
    this.ctx.font = `${ FONT_SIZE * 2 }px Arial`;
    const notificationText = 'Extinction reached';
    this.ctx.fillText(notificationText, this.canvas.width / 2, this.canvas.height / 2, this.canvas.width);
    this.ctx.font = `${ FONT_SIZE}px Arial`;
    const statText = `Generation count: ${ generationCount}`;
    this.ctx.fillText(statText, this.canvas.width / 2, this.canvas.height / 2 + 35, this.canvas.width);
  }

}
