import * as FS from 'fs';
import * as Path from 'path';

import {
    Command,
    Object as ClimeObject,
    Options,
    command,
    option,
    param
} from 'clime';

import { Matches } from 'clime-glob';

import {
    getExports,
    updateDocumentationFile
} from '../core';

export class DocheatOptions extends Options {
    @option({
        description: 'Glob patterns of target markdown files, defaults to `README,README.*`',
        flag: 't',
        default: 'README,README.*'
    })
    target: Matches;

    @option({
        description: 'Heading level of generated entries, defaults to 4',
        flag: 'l',
        default: 4
    })
    level: number;
}

@command({
    description: 'Update definition references in documentations'
})
export default class extends Command {
    async execute(
        @param({
            description: 'TypeScript project configuration file',
            default: 'tsconfig.json'
        })
        projectFile: ClimeObject.File,

        options: DocheatOptions
    ) {
        console.info('Processing source files...');

        let exports = await getExports(projectFile);

        console.log('Updating documentations...');

        for (let fileName of options.target) {
            await updateDocumentationFile(fileName, exports, {
                level: options.level,
                fileName
            });

            console.info(`Updated "${fileName}".`);
        }

        console.info('Done.');
    }
}
