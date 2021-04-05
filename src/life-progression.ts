
import { GameConfig, GenerationInfo } from './interfaces';
import { Population } from './types';

type OnNewGenerationCallback = (generationInfo: GenerationInfo) => void;

export default class LifeProgression {

  private config: GameConfig;
  private onGeneration: OnNewGenerationCallback;
  private initialPopulation: Population;
  private generationCounter: number;
  private nextGeneration: Population;
  private nextGenerationTimeoutHandle?: ReturnType<typeof setTimeout>;
  private gamePaused: boolean;

  /**
   * @param config Game configuration
   * @param onGeneration Callback when new generation is ready
   */
  constructor(config: GameConfig, onGeneration: OnNewGenerationCallback) {
    this.config = config;
    this.onGeneration = onGeneration;
    this.startGame();
  }

  /**
   * Restarts the game with the same initial population.
   */
  public restartGame(): void {
    this.generationCounter = 0;
    this.clearNextGenerationTimeoutHandle();
    this.progressLife(this.initialPopulation);
  }

  /**
   * Pauses or resumes the game.
   */
  public togglePauseResume(): void {
    if (this.gamePaused) {
      this.gamePaused = false;
      this.progressLife(this.nextGeneration);
    } else {
      this.gamePaused = true;
      this.clearNextGenerationTimeoutHandle();
    }
  }

  /**
   * Prints the initial state of the current game.
   */
  public saveGame(): void {
    if (!this.initialPopulation) {
      console.warn('Nothing to save!');
      return;
    }

    console.log(
      'The initial state of the game: ',
      JSON.stringify({
        cols: this.config.cols,
        rows: this.config.rows,
        initialPopulation: this.initialPopulation
      })
    );
  }

  /**
   * Starts the game with provided settings.
   */
  private startGame(): void {
    this.generationCounter = 0;
    this.clearNextGenerationTimeoutHandle();
    this.initialPopulation = this.getInitialPopulation();
    this.progressLife(this.initialPopulation);
  }

  /**
   * Creates a randomly populated distribution based on game settings.
   * @returns A matrix containing the state of cells (dead or alive)
   */
  private getInitialPopulation(): Population {
    const numberOfCells = this.config.cols * this.config.rows;
    const populatedCellsCount = this.config.populationPercentage / 100 * numberOfCells;

    const cellDistributionArray = Array.from(Array(numberOfCells), (_, index) => index < populatedCellsCount);

    // Shuffling the population array
    let currentIndex = numberOfCells, tempValue, randomIndex;

    while (currentIndex !== 0) {
      // Pick one of the remaining elements
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // Swap it with the current element
      tempValue = cellDistributionArray[currentIndex];
      cellDistributionArray[currentIndex] = cellDistributionArray[randomIndex];
      cellDistributionArray[randomIndex] = tempValue;
    }

    const cellDistribution: Population = [];

    for (let i = 0; i < numberOfCells; i += this.config.cols) {
      cellDistribution.push(cellDistributionArray.slice(i, i + this.config.cols));
    }

    return cellDistribution;
  }

  /**
   * Calculates the next generation of cells based on Conway's Game of Life rules.
   * @param previousGeneration Previous generation of cells
   * @returns The next generation of cells
   */
  private getNextGeneration(previousGeneration: Population): Population {
    const nextGeneration: Population = [];

    /**
     * Any live cell with two or three live neighbours survives;
     * Any dead cell with three live neighbours becomes a live cell;
     * All other live cells die in the next generation. Similarly, all other dead cells stay dead.
     */

    for (let row = 0; row < previousGeneration.length; row++) {
      nextGeneration.push([]);
      for (let col = 0; col < previousGeneration[row].length; col++) {
        const hasPreviousRow = !!previousGeneration[row - 1];
        const hasNextRow = previousGeneration[row + 1];

        const neighborCells = [
          previousGeneration[row][col + 1],
          previousGeneration[row][col - 1]
        ];

        if (hasPreviousRow) {
          neighborCells.push(
            previousGeneration[row - 1][col - 1],
            previousGeneration[row - 1][col],
            previousGeneration[row - 1][col + 1]
          );
        }

        if(hasNextRow) {
          neighborCells.push(
            previousGeneration[row + 1][col + 1],
            previousGeneration[row + 1][col],
            previousGeneration[row + 1][col - 1]
          );
        }

        const aliveCellCount = neighborCells.filter(c => c).length;

        if (previousGeneration[row][col]) {
          nextGeneration[row][col] = [2, 3].includes(aliveCellCount);
        } else {
          nextGeneration[row][col] = aliveCellCount === 3;
        }
      }
    }

    return nextGeneration;
  }

  /**
   * Emits the latest generation, calculates the next generation and schedules it's emission.
   * @param generation Current cell population
   */
  private progressLife(generation: Population): void {
    // Check extinction state
    const isExtinct = !generation.find(c => c.includes(true));

    this.generationCounter = (this.generationCounter || 0) + 1;

    const generationInfo: GenerationInfo = {
      generation: generation,
      isExtinct: isExtinct,
      generationCount: this.generationCounter
    };

    // Emit the latest population
    this.onGeneration(generationInfo);

    // Stop progressing if extinct
    if (isExtinct) {
      this.clearNextGenerationTimeoutHandle();
      return;
    }

    // Schedule the display of the next population
    const interval = this.config.generationLifespan;
    this.nextGeneration = this.getNextGeneration(generation);

    this.nextGenerationTimeoutHandle = setTimeout(() => {
      this.progressLife(this.nextGeneration);
    }, interval);
  }

  private clearNextGenerationTimeoutHandle(): void {
    clearTimeout(this.nextGenerationTimeoutHandle as unknown as number);
    delete this.nextGenerationTimeoutHandle;
  }

}
