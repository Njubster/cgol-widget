import webpack, { Compilation, sources } from 'webpack';
import { validate } from 'schema-utils';
import { Schema } from 'schema-utils/declarations/validate';

interface WebworkerWebpackPluginOptions {
  patterns: {
    targetAsset: string;
    sourceAsset: string;
    macro: string;
  }[];
}

const schema: Schema = {
  type: 'object',
  properties: {
    patterns: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          targetAsset: {
            type: 'string'
          },
          sourceAsset: {
            type: 'string'
          },
          macro: {
            type: 'string'
          }
        }
      }
    }
  }
};

const configuration = { name: 'WebworkerWebpackPlugin' };

export default class Base64AssetLoaderPlugin {

  private options: WebworkerWebpackPluginOptions;

  constructor(options: WebworkerWebpackPluginOptions) {
    validate(schema, options, configuration);
    this.options = options;
  }

  public apply(compiler: webpack.Compiler): void {

    compiler.hooks.thisCompilation.tap('WebworkerWebpackPlugin', compilation => {

      const tapOptions = {
        name: 'WebworkerWebpackPlugin',
        stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
      };

      compilation.hooks.processAssets.tap(tapOptions, () => {
        this.options.patterns.forEach(p => {
          // Get sources
          const sourceAsset = compilation.getAsset(p.sourceAsset)?.source.source() as string;
          const targetAsset = compilation.getAsset(p.targetAsset)?.source.source() as string;
          // Convert source asset to base64 encoded data URL
          const base64EncodedAssetDataUrl = this.convertFileToBase64DataUrl(sourceAsset);
          // Update target asset by replacing the macro with data URL
          const newTargetSource = new sources.RawSource(targetAsset.replace(p.macro, base64EncodedAssetDataUrl));
          compilation.updateAsset(p.targetAsset, newTargetSource);
        });

      });
    });

  }

  private convertFileToBase64DataUrl(rawFileContent: string): string {
    const base64EncodedString = Buffer.from(rawFileContent).toString('base64');
    return `data:application/javascript;base64,${ base64EncodedString }`;
  }

}
