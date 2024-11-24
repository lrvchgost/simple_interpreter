export class Token {
  constructor(type, value, lineno, column) {
    this.type = type;
    this.value = value;
    this.lineno = lineno;
    this.column = column;
  }

  toString() {
    return `Token(${this.type}, ${this.value} position={${this.lineno}:${this.column}})`;
  }
}
