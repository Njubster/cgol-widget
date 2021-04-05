import { GameAction, Population } from './types';
import { GameSettingType } from './enums';

export interface GameConfig {
  [key: string]: unknown;
  cols: number;                           // Number of columns
  rows: number;                           // Number of rows
  populationPercentage: number;           // Percentage of populated cells at start
  generationLifespan: number;             // Time between generations (ms)
  cellSize: number;                       // Cell width and height in pixels
  cellSpacing: number;                    // Spacing between cells in pixels
  backgroundColor: string;                // Background color (CSS color)
  cellColor: string;                      // Cell color (CSS color)
  deadCellColor: string;                  // Dead cell color (CSS color)
  restartInterval: number;                // Time before a new game after extinction (ms) ('0' means no restart)
  fontColor: string;                      // Font color for stat display (CSS color)
  showStats: boolean;                     // Whether or not the stats should appear at the bottom of the canvas
  showExtinctionStats: boolean;           // Whether or not the 'Game over' screen should be displayed
}
export interface ActionMessage {
  action: GameAction;
  config?: GameConfig;
}

export interface GenerationInfo {
  generation: Population;
  isExtinct: boolean;
  generationCount: number | undefined;
}

export interface GameConfigSchema {
  [key: string]: GameSettingSchema;
  cols: GameSettingSchema;
  rows: GameSettingSchema;
  populationPercentage: GameSettingSchema;
  generationLifespan: GameSettingSchema;
  cellSize: GameSettingSchema;
  cellSpacing: GameSettingSchema;
  backgroundColor: GameSettingSchema;
  cellColor: GameSettingSchema;
  deadCellColor: GameSettingSchema;
  restartInterval: GameSettingSchema;
  fontColor: GameSettingSchema;
  showStats: GameSettingSchema;
  showExtinctionStats: GameSettingSchema;
}

export interface GameSettingSchema {
  defaultValue: unknown;
  propName: string;
  type: GameSettingType;
}
