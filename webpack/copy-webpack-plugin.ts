import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import { validate } from 'schema-utils';
import { Schema } from 'schema-utils/declarations/validate';

interface CopyWebpackPluginOptions {
  patterns?: {
    from: string,
    to: string,
    override?: boolean
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
          to: {
            type: 'string'
          },
          from: {
            type: 'string'
          },
          override: {
            type: 'boolean',
            default: false
          }
        }
      }
    }
  }
};

const configuration = { name: 'Copy Webpack Plugin' };

export default class CopyWebpackPlugin {

  private options: CopyWebpackPluginOptions;

  constructor(options: CopyWebpackPluginOptions = {}) {
    validate(schema, options, configuration);
    this.options = options;
  }

  public apply(compiler: webpack.Compiler): void {
    compiler.hooks.beforeCompile.tapAsync('CopyWebpackPlugin', (_, callback) => {
      this.options.patterns?.forEach(p => {
        if (!fs.existsSync(p.from)) {
          throw new Error('Specified path does not exist: ' + p.from);
        }
      });

      this.options.patterns?.forEach(p => {
        // Create the output directory if it does not exist
        const outputDirectory = path.dirname(p.to);
        if (!fs.existsSync(outputDirectory)) {
          fs.mkdirSync(outputDirectory);
        }

        if (p.override) {
          fs.copyFileSync(p.from, p.to);
        } else {
          try {
            fs.copyFileSync(p.from, p.to, fs.constants.COPYFILE_EXCL);
          // eslint-disable-next-line no-empty
          } catch { }
        }
      });

      callback();
    });
  }

}
