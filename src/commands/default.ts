import * as FS from 'fs';
import * as Path from 'path';

import {
  Command,
  Object as ClimeObject,
  Options,
  command,
  option,
  param,
} from 'clime';

import {Matches} from 'clime-glob';

import {getExports, updateDocumentationFile} from '../core';

export class DocheatOptions extends Options {
  @option({
    description:
      'Glob patterns of target markdown files, defaults to `README,README.*`',
    flag: 't',
    default: 'README,README.*',
  })
  target: Matches;

  @option({
    description: 'Heading level of generated entries, defaults to 4',
    flag: 'l',
    default: 4,
  })
  level: number;

  @option({
    description: 'Base url of source code links',
    flag: 'b',
    default: '',
    placeholder: 'url',
  })
  baseUrl: string;
}

@command({
  description: `\
Generates brief API references for your TypeScript library.
   _         _           _
 _| |___ ___| |_ ___ ___| |_
| . | . |  _|   | -_| .'|  _|
|___|___|___|_|_|___|__,|_|

https://github.com/vilic/docheat`,
})
export default class extends Command {
  async execute(
    @param({
      description: 'TypeScript project configuration file',
      default: 'tsconfig.json',
    })
    projectFile: ClimeObject.File,
    options: DocheatOptions,
  ) {
    console.info('Processing source files...');

    let exports = await getExports(projectFile);

    console.info('Updating documentations...');

    for (let fileName of options.target) {
      await updateDocumentationFile(fileName, exports, {
        level: options.level,
        fileName,
        baseUrl: options.baseUrl,
      });

      console.info(`Updated "${fileName}".`);
    }

    console.info('Done.');
  }
}
