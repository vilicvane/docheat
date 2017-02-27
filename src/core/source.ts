import * as Path from 'path';

import {
    Object as ClimeObject
} from 'clime';

import {
    ClassDeclaration,
    Declaration,
    FunctionDeclaration,
    ModifierFlags,
    Node,
    ParameterDeclaration,
    Signature,
    TypeParameter,
    Symbol,
    SyntaxKind,
    createProgram,
    displayPartsToString,
    forEachChild,
    getCombinedModifierFlags,
    parseJsonConfigFileContent,
    sys
} from 'typescript';

import {
    FunctionEntry,
    ClassEntry,
    DeclarationLocation,
    ParameterEntry,
    SignatureEntry,
    SymbolEntry,
    TypeParameterEntry
} from './';

export interface LibraryExports {
    functions: FunctionEntry[];
    classes: ClassEntry[];
}

export async function getExports(projectFile: ClimeObject.File): Promise<LibraryExports> {
    let projectDir = Path.dirname(projectFile.fullName);
    let projectConfigJson = await projectFile.text();

    let parsedCommandLine = parseJsonConfigFileContent(
        JSON.parse(projectConfigJson),
        sys,
        projectDir
    );

    let program = createProgram(
        parsedCommandLine.fileNames,
        parsedCommandLine.options
    );

    let checker = program.getTypeChecker();

    let symbolSet = new Set<Symbol>();
    let functionEntries: FunctionEntry[] = [];
    let classEntries: ClassEntry[] = [];

    for (let sourceFile of program.getSourceFiles()) {
        if (!sourceFile.isDeclarationFile) {
            forEachChild(sourceFile, visit);
        }
    }

    return {
        functions: functionEntries,
        classes: classEntries
    };

    function visit(node: Node) {
        if (!node.modifiers || !(getCombinedModifierFlags(node) & ModifierFlags.Export)) {
            return;
        }

        if (node.kind === SyntaxKind.ModuleDeclaration) {
            forEachChild(node, visit);
        } else if (node.kind === SyntaxKind.ClassDeclaration) {
            let name = (node as ClassDeclaration).name;

            if (name) {
                let symbol = checker.getSymbolAtLocation(name);

                if (symbolSet.has(symbol)) {
                    return;
                }

                symbolSet.add(symbol);

                classEntries.push(serializeClass(symbol));
            }
        } else if (node.kind === SyntaxKind.FunctionDeclaration) {
            let name = (node as FunctionDeclaration).name;

            if (name) {
                let symbol = checker.getSymbolAtLocation(name);

                if (symbolSet.has(symbol)) {
                    return;
                }

                symbolSet.add(symbol);

                functionEntries.push(serializeFunction(symbol));
            }
        }
    }

    function serializeSymbol(symbol: Symbol): SymbolEntry {
        return {
            name: symbol.name,
            documentation: displayPartsToString(symbol.getDocumentationComment()),
        };
    }

    function serializeClass(symbol: Symbol): ClassEntry {
        let declaration = symbol.valueDeclaration!;

        let signatureEntries = checker
            .getTypeOfSymbolAtLocation(symbol, declaration)
            .getConstructSignatures()
            .map(signature => serializeSignature(signature));

        let signatureEntry = signatureEntries.shift()!;

        return Object.assign(
            serializeSymbol(symbol),
            {
                ctor: Object.assign(signatureEntry, {
                    overloads: signatureEntries.length ? signatureEntries : undefined
                }),
                properties: [],
                methods: []
            },
            serializeDeclarationLocation(declaration)
        );
    }

    function serializeFunction(symbol: Symbol): FunctionEntry {
        let declaration = symbol.valueDeclaration!;

        let signatureEntries = checker
            .getTypeOfSymbolAtLocation(symbol, declaration)
            .getCallSignatures()
            .map(signature => serializeSignature(signature));

        let location = serializeDeclarationLocation(declaration);

        return Object.assign(
            serializeSymbol(symbol),
            signatureEntries.shift()!,
            { overloads: signatureEntries.length ? signatureEntries : undefined },
            serializeDeclarationLocation(declaration)
        );
    }

    function serializeSignature(signature: Signature): SignatureEntry {
        return {
            typeParameters: signature.typeParameters &&
                signature.typeParameters.map(serializeTypeParameter),
            parameters: signature.parameters.map(serializeParameter),
            returnType: checker.typeToString(signature.getReturnType()),
            documentation: displayPartsToString(signature.getDocumentationComment())
        };
    }

    function serializeTypeParameter(typeParameter: TypeParameter): TypeParameterEntry {
        return {
            name: checker.typeToString(typeParameter)
        };
    }

    function serializeParameter(symbol: Symbol): ParameterEntry {
        let declaration = symbol.valueDeclaration as ParameterDeclaration;

        let optional = !!(declaration.initializer || declaration.questionToken);
        let rest = !!declaration.dotDotDotToken;
        let type = checker
            .typeToString(checker.getTypeOfSymbolAtLocation(symbol, declaration));

        if (optional) {
            type = type.replace(/\s*\|\s*undefined(?=$|\s*\|)/, '');
        }

        return Object.assign(
            serializeSymbol(symbol),
            {
                optional,
                rest,
                type
            }
        );
    }

    function serializeDeclarationLocation(declaration: Declaration): DeclarationLocation {
        let sourceFile = declaration.getSourceFile();

        return {
            fileName: sourceFile.fileName,
            lineNumber: sourceFile
                .getLineAndCharacterOfPosition(declaration.getStart())
                .line + 1
        }
    }
}
