import fs from 'fs';
import webpack from 'webpack';
import { validate } from 'schema-utils';
import { Schema } from 'schema-utils/declarations/validate';

interface RemoveAssetsPluginOptions {
  assetPaths: string[];
}

const schema: Schema = {
  type: 'object',
  properties: {
    assetPaths: {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  }
};

const configuration = { name: 'RemoveAssetsPlugin' };

export default class RemoveAssetsPlugin {

  private options: RemoveAssetsPluginOptions;

  constructor(options: RemoveAssetsPluginOptions) {
    validate(schema, options, configuration);
    this.options = options;
  }

  public apply(compiler: webpack.Compiler): void {

    compiler.hooks.afterEmit.tap('RemoveAssetsPlugin', () => {

      this.options.assetPaths.forEach(ap => {
        if (fs.existsSync(ap)) {
          this.removeAsset(ap);
        }
      });
    });

  }

  private removeAsset(filePath: string): void {
    fs.unlinkSync(filePath);
  }

}
