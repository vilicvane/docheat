import * as FS from 'fs';

import {ExpectedError} from 'clime';
import * as v from 'villa';

import {LibraryExports} from './';

import generateFunctionDocumentation from '../templates/function';

const LIST_REGEX = /^(<!--\s*docheat:(\w+)\s*-->)(?:[^]*?(^<!--\s*endcheat\s*-->))?/gm;

export interface GeneratingOptions {
  level: number;
  fileName: string;
  baseUrl: string;
}

export async function updateDocumentationFile(
  fileName: string,
  exports: LibraryExports,
  options: GeneratingOptions,
): Promise<void> {
  let content = await v.call<string>(FS.readFile, fileName, 'utf-8');

  content = content.replace(
    LIST_REGEX,
    (text: string, start: string, type: string, end: string) => {
      let parts = [start];

      switch (type) {
        case 'functions':
          let functionsText = exports.functions
            .map(entry => generateFunctionDocumentation(entry, options))
            .join('')
            .trim();
          parts.push(functionsText);
          break;
        default:
          throw new ExpectedError(`Unsupported documentation type "${type}"`);
      }

      parts.push(end || '<!-- endcheat -->');

      return parts.join('\n\n');
    },
  );

  await v.call(FS.writeFile, fileName, content);
}
