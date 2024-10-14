const INTEGER = "INTEGER";
const MINUS = "MINUS";
const PLUS = "PLUS";
const MUL = "MUL";
const DIV = "DIV";
const SPACE = "SPACE";
const EOF = "EOF";

export { INTEGER, MINUS, PLUS, MUL, DIV, EOF, SPACE };

const mul = (a, b) => a * b;
const div = (a, b) => a / b;
const sum = (a, b) => a + b;
const sub = (a, b) => a - b;

class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}

export class Lexer {
  constructor(text) {
    this.text = text;
    this.pos = 0;
    this.currentChar = this.text[this.pos];
  }

  error(source) {
    throw "Error parsing source code: " + source;
  }

  advance() {
    this.pos++;

    if (this.pos > this.text.length - 1) {
      this.currentChar = null;
    } else {
      this.currentChar = this.text[this.pos];
    }
  }

  skipWhiteSpaces() {
    while (!this.isEOF() && this.isSpace()) {
      this.advance();
    }
  }

  isInteger() {
    return Number.isInteger(parseInt(this.currentChar));
  }

  isSpace() {
    return this.currentChar === " ";
  }

  isEOF() {
    return this.currentChar === null;
  }

  integer() {
    let result = "";

    while (!this.isEOF() && this.isInteger()) {
      result += this.currentChar;
      this.advance();
    }

    return Number(result);
  }

  getNextToken() {
    while (!this.isEOF()) {
      if (this.isSpace()) {
        this.skipWhiteSpaces();
        continue;
      }

      if (this.isInteger()) {
        return new Token(INTEGER, this.integer());
      }

      const currentChar = this.currentChar;

      if (currentChar === "+") {
        this.advance();
        return new Token(PLUS, currentChar);
      }

      if (currentChar === "-") {
        this.advance();
        return new Token(MINUS, currentChar);
      }

      if (currentChar === "*") {
        this.advance();
        return new Token(MUL, currentChar);
      }

      if (currentChar === "/") {
        this.advance();
        return new Token(DIV, currentChar);
      }

      this.error("getNextToken");
    }

    return new Token(EOF, null);
  }
}

export class Interpreter {
  constructor(lexer) {
    this.lexer = lexer;
    this.currentToken = this.lexer.getNextToken();
  }

  error(source) {
    throw "Cannot parse: " + source;
  }

  isEOF() {
    return this.currentToken.type === EOF;
  }

  isMulDiv() {
    return [MUL, DIV].includes(this.currentToken.type);
  }

  isSumSub() {
    return [PLUS, MINUS].includes(this.currentToken.type);
  }

  eat(tokeType) {
    if (this.currentToken.type === tokeType) {
      this.currentToken = this.lexer.getNextToken();
    } else {
      this.error("eat");
    }
  }

  factor() {
    const value = this.currentToken.value;

    this.eat(INTEGER);

    return value;
  }

  term() {
    let result = this.factor();

    while (this.isMulDiv()) {
      const { type } = this.currentToken;

      this.eat(type);
      const value = this.factor();

      if (type === MUL) {
        result = sum(result, value);
      }

      if (type === DIV) {
        result = div(result, value);
      }
    }

    return result;
  }

  expr() {
    let result = this.term();

    while (this.isSumSub()) {
      const { type } = this.currentToken;

      this.eat(type);

      if (type === PLUS) {
        result = sum(result, this.term());
      }

      if (type === MINUS) {
        result = sub(result, this.term());
      }
    }

    return result;
  }
}
