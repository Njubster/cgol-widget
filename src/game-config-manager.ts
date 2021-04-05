import { CONFIG_SCHEMA } from './constants';
import { GameConfig } from './interfaces';
import { GameSettingType } from './enums';
import GameConfigValidator from './game-config-validator';

export default class GameConfigManager {

  private wc: HTMLElement; // TODO: Change type?
  private config: GameConfig;

  /**
   * @param wc Web component instance
   */
  constructor(wc: HTMLElement) { // TODO: Change type?
    this.wc = wc;
    this.config = this.setInitialConfig();
  }

  /**
   * Returns the current game config.
   * @returns current game config
   */
  public getConfig(): GameConfig {
    return this.config;
  }

  private setInitialConfig(): GameConfig {
    // Getting the default config
    const config: Partial<GameConfig> = {};
    for (const setting in CONFIG_SCHEMA) {
      config[setting] = CONFIG_SCHEMA[setting].defaultValue;
    }

    // Overriding the default config with valid, provided settings
    const isProvided = (value: unknown): boolean => value !== null && typeof value !== 'undefined';

    for (const setting in CONFIG_SCHEMA) {
      const propName = CONFIG_SCHEMA[setting].propName;
      const type = CONFIG_SCHEMA[setting].type;
      const providedValue = this.wc.getAttribute(propName);

      if (isProvided(providedValue) && GameConfigValidator.isValid(type, providedValue)) {
        config[setting] = this.cast(providedValue, type);
      } else {
        this.notifyAndCorrectProvidedSetting(propName, providedValue, config[setting]);
      }
    }

    return config as unknown as GameConfig;
  }

  private cast(value: unknown, type: GameSettingType): unknown {
    switch(type) {
      case GameSettingType.Integer:
      case GameSettingType.Double:
        return Number(value);
      case GameSettingType.Boolean:
        return String(value).toLowerCase() === 'true';
      case GameSettingType.Color:
      case GameSettingType.String:
      default:
        return value;
    }
  }

  private notifyAndCorrectProvidedSetting(name: string, incorrectValue: unknown, correctValue: unknown): void {
    console.warn(`Value '${ incorrectValue }' is invalid for parameter '${ name }'!`);
    this.wc.setAttribute(name, String(correctValue));
  }

}
