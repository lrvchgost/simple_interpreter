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

export class SymbolTable {
  _symbols = new Map();

  constructor() {
    this.initBuilins();
  }

  initBuilins() {
    this.define(new BuilinTypeSymbol(INTEGER));
    this.define(new BuilinTypeSymbol(REAL));
  }

  define(symbol) {
    this._symbols.set(symbol.name, symbol);
  }

  lookup(name) {
    return this._symbols.get(name);
  }

  toString() {
    return [...this._symbols.entries()].map(([_, symbol]) => symbol.toString())
  }
}
