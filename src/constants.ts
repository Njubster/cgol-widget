import { GameConfigSchema } from './interfaces';
import { GameSettingType } from './enums';

export const GAME_CONTAINER_ID = 'cgol-canvas-container';

export const WORKER_SCRIPT_URL_MACRO = '<% WORKER DATA URL %>';

export const CONFIG_SCHEMA: GameConfigSchema = {
  cols: {
    type: GameSettingType.Integer,
    propName: 'cols',
    defaultValue: 480
  },
  rows: {
    type: GameSettingType.Integer,
    propName: 'rows',
    defaultValue: 360
  },
  populationPercentage: {
    type: GameSettingType.Integer,
    propName: 'population-percentage',
    defaultValue: 50
  },
  generationLifespan: {
    type: GameSettingType.Integer,
    propName: 'generation-lifespan',
    defaultValue: 1000
  },
  cellSize: {
    type: GameSettingType.Integer,
    propName: 'cell-size',
    defaultValue: 2
  },
  cellSpacing: {
    type: GameSettingType.Integer,
    propName: 'cell-spacing',
    defaultValue: 0
  },
  backgroundColor: {
    type: GameSettingType.Color,
    propName: 'bg-color',
    defaultValue: '#fff'
  },
  cellColor: {
    type: GameSettingType.Color,
    propName: 'cell-color',
    defaultValue: '#FFFF00'
  },
  deadCellColor: {
    type: GameSettingType.Color,
    propName: 'dead-cell-color',
    defaultValue: '#C0C0C0'
  },
  restartInterval: {
    type: GameSettingType.Integer,
    propName: 'restart-interval',
    defaultValue: 1000
  },
  fontColor: {
    type: GameSettingType.Color,
    propName: 'font-color',
    defaultValue: 'red'
  },
  showStats: {
    type: GameSettingType.Boolean,
    propName: 'show-stats',
    defaultValue: false
  },
  showExtinctionStats: {
    type: GameSettingType.Boolean,
    propName: 'show-extinction-stats',
    defaultValue: false
  }
};
