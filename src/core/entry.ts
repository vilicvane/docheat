export interface DeclarationLocation {
  fileName: string;
  lineNumber: number;
}

export interface SymbolEntry {
  name: string;
  documentation: string;
}

export interface ParameterEntry extends SymbolEntry {
  optional: boolean;
  rest: boolean;
  type: string;
}

export interface TypeParameterEntry {
  name: string;
}

export interface SignatureEntry {
  typeParameters: TypeParameterEntry[] | undefined;
  parameters: ParameterEntry[];
  returnType: string;
  documentation: string;
}

export interface FunctionEntry
  extends SymbolEntry,
    SignatureEntry,
    DeclarationLocation {
  overloads?: SignatureEntry[];
}

export interface ConstructorEntry extends SignatureEntry {
  overloads?: SignatureEntry[];
}

export interface PropertyEntry extends SymbolEntry {}

export interface ClassEntry extends SymbolEntry, DeclarationLocation {
  ctor: ConstructorEntry;
  properties: PropertyEntry[];
  methods: FunctionEntry[];
}
