import { TokenType } from "./helpers.js";
import { isScope } from './init.js';

export class Symbol {
  constructor(name, type) {
    this.name = name;
    this.type = type;
  }
}

export class BuilinTypeSymbol extends Symbol {
  constructor(name) {
    super(name);
  }

  toString() {
    return this.name;
  }
}

export class VarSymbol extends Symbol {
  constructor(name, type) {
    super(name, type);
  }

  toString() {
    return `<${this.name}: ${this.type}>`;
  }
}

export class ProcedureSymbol extends Symbol {
  constructor(name, params = []) {
    super(name);

    this.params = params ?? [];
    this.blockAst = null;
  }

  getParamsLength() {
    return this.params.length;
  }

  toString() {
    return `<${this.name}: ${this.params.map((param) => param.toString())}>`;
  }
}

export class ScopedSymbolTable {
  _symbols = new Map();

  constructor(scopeName, scopeLevel, enclosingScope = null, isLoging) {
    this.scopeName = scopeName;
    this.scopeLevel = scopeLevel;
    this.enclosingScope = enclosingScope;
    this.isLoging = isLoging !== undefined ? isLoging : isScope;
  }

  initBuilins() {
    this.define(new BuilinTypeSymbol(TokenType.INTEGER));
    this.define(new BuilinTypeSymbol(TokenType.REAL));
  }

  define(symbol) {
    this._log(`Define: ${symbol.name}. (Scope name: ${this.scopeName})`);
    this._symbols.set(symbol.name, symbol);
    symbol.scope = this;
  }

  lookup(name, currentScopeOnly) {
    this._log(`Lookup: ${name}. (Scope name: ${this.scopeName})`);
    const symbol = this._symbols.get(name);

    if (symbol) {
      return symbol;
    }

    if (currentScopeOnly) {
      return undefined;
    }

    if (this.enclosingScope) {
      return this.enclosingScope.lookup(name);
    }
  }

  _log(message) {
    if (this.isLoging) {
      console.log(message);
    }
  }

  toString() {
    return `--------------------------------------------------------
SCOPE (SCOPED SYMBOL TABLE)
Scope name: ${this.scopeName}
Scope level: ${this.scopeLevel}
Enclosing scope: ${this.enclosingScope?.scopeName ?? null}
${[...this._symbols.entries()].map(([_, symbol]) => symbol.toString())}
`;
  }
}
