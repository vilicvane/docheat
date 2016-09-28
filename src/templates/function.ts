import * as Path from 'path';

import {
    FunctionEntry,
    GeneratingOptions,
    ParameterEntry,
    SignatureEntry
} from '../core';

export default function (entry: FunctionEntry, options: GeneratingOptions): string {
    let {
        fileName,
        lineNumber,
        name,
        overloads,
        documentation
    } = entry;

    let headingSharps = Array(options.level + 1).join('#');

    let overloadsPlusText = overloads ?
        `<sup>+${overloads.length}</sup>` : '';

    fileName = Path
        .relative(Path.dirname(options.fileName), fileName)
        .replace(/\\/g, '/')

    let text = `\
${headingSharps} [[+]](${fileName}#L${lineNumber}) \`${name}${signatureToString(entry)}\`${overloadsPlusText}\n\n`;

    if (documentation) {
        // TODO: check TypeScript 2.1 and see whether it handles @returns.
        documentation = documentation
            .replace(/^@.+/mg, '')
            .replace(/(?:\s*\n\s*){3,}/g, '\n\n')
            .trim();
    }

    if (documentation) {
        text += `${documentation}\n\n`;
    }

    if (overloads) {
        text += `\
${headingSharps}# Overloads:\n\n`;

        for (let overload of overloads) {
            let parameters = overload.parameters;
            text += `\
- \`${name}${signatureToString(overload)}\`\n`;
        }

        text += '\n';
    }

    return `${text}`;
}

function signatureToString(entry: SignatureEntry): string {
    let {
        typeParameters,
        parameters,
        returnType
    } = entry;

    let typeParametersListText = typeParameters ?
        `<${typeParameters.map(entry => entry.name).join(', ')}>` : '';
    let parametersListText = parameters.map(parameterToString).join(', ');

    return `${typeParametersListText}(${parametersListText}): ${returnType}`;
}

function parameterToString(entry: ParameterEntry): string {
    return [
        entry.rest ? '...' : '',
        entry.name,
        entry.optional ? '?' : '',
        `: ${entry.type}`
    ].join('');
}
