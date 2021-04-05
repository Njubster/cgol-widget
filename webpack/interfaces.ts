export interface EnvironmentOptions {
  WEBPACK_BUNDLE: boolean;
  WEBPACK_BUILD: boolean;
}

export interface Arguments {
  mode: 'development' | 'production';
  env: EnvironmentOptions
}
