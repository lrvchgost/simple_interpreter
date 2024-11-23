import { INTEGER, REAL } from './helpers.js';

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
  }

  toString() {
    return `<${this.name}: ${this.params.map(param => param.toString())}>`;
  }
}

export class ScopedSymbolTable {
  _symbols = new Map();

  constructor(scopeName, scopeLevel, enclosingScope = null) {
    this.scopeName = scopeName;
    this.scopeLevel = scopeLevel;
    this.enclosingScope = enclosingScope;
  }

  initBuilins() {
    this.define(new BuilinTypeSymbol(INTEGER));
    this.define(new BuilinTypeSymbol(REAL));
  }

  define(symbol) {
    // console.log(`Define: ${symbol.name}. (Scope name: ${this.scopeName})`);
    this._symbols.set(symbol.name, symbol);
    symbol.scope = this;
  }

  lookup(name, currentScopeOnly) {
    // console.log(`Lookup: ${name}. (Scope name: ${this.scopeName})`);
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

  toString() {
//     return `--------------------------------------------------------
// SCOPE (SCOPED SYMBOL TABLE)
// Scope name: ${this.scopeName}
// Scope level: ${this.scopeLevel}
// Enclosing scope: ${this.enclosingScope?.scopeName ?? null}
// ${[...this._symbols.entries()].map(([_, symbol]) => symbol.toString())}
// `;
  }
}
