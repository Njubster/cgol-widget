import { GameSettingType } from './enums';

export default class GameConfigValidator {

  /**
   * Validates a config value based on the expected type.
   * @param type Expected setting type
   * @param value Config value
   */
  public static isValid(type: GameSettingType, value: unknown): boolean {
    switch(type) {
      case GameSettingType.Integer:
        return this.isValidInteger(value);
      case GameSettingType.Double:
        return this.isValidDouble(value);
      case GameSettingType.Boolean:
        return this.isValidBoolean(value);
      case GameSettingType.Color:
        return this.isValidColor(value);
      case GameSettingType.String:
      default:
        return true;
    }
  }

  private static isValidInteger(value: unknown): boolean {
    return this.isNumber(value) && this.isInteger(value as number);
  }

  private static isValidDouble(value: unknown): boolean {
    return this.isNumber(value);
  }

  private static isValidBoolean(value: unknown): boolean {
    return ['true', 'false'].includes(String(value).toLowerCase());
  }

  private static isValidColor(value: unknown): boolean {
    const style = new Option().style;
    style.color = String(value);
    return style.color === value;
  }

  private static isNumber(value: unknown): boolean {
    return value !== '' && !isNaN(Number(value));
  }

  private static isInteger(value: number): boolean {
    return value % 1 === 0;
  }

}
