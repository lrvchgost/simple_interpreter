const INTEGER = "INTEGER";
const PLUS = "PLUS";
const MINUS = "MINUS";
const MUL = "MUL";
const DIV = "DIV";
const EOF = "EOF";
const SPACE = "SPACE";
const LPAREN = "(";
const RPAREN = ")";

export { INTEGER, MINUS, PLUS, MUL, DIV, EOF, SPACE };

const sum = (a, b) => {
  return a + b;
};

const sub = (a, b) => {
  return a - b;
};

const mul = (a, b) => {
  return a * b;
};

const div = (a, b) => {
  return a / b;
};

class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }

  toString() {
    // [Symbol.toPrimitive]() {
    return `Token(${this.type}, ${this.value})`;
  }
}

export class Lexer {
  constructor(text) {
    this.text = text;
    this.pos = 0;
    this.currentChar = text[this.pos];
  }

  error(source) {
    throw new Error("Error parsing input:" + source);
  }

  isInteger() {
    return Number.isInteger(parseInt(this.currentChar));
  }

  isSpace() {
    return this.currentChar === " ";
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
    while (!this.isEOF() && this.isSpace(this.currentChar)) {
      this.advance();
    }
  }

  integer() {
    let result = "";

    while (!this.isEOF() && this.isInteger(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }

    return Number(result);
  }

  isEOF() {
    return this.currentChar === null;
  }

  // Tokenizer
  getNextToken() {
    while (!this.isEOF()) {
      if (this.isSpace()) {
        this.skipWhiteSpaces();
        continue;
      }

      if (this.isInteger()) {
        return new Token(INTEGER, this.integer());
      }

      let currentChar = this.currentChar;

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

      if (currentChar === "(") {
        this.advance();
        return new Token(LPAREN, currentChar);
      }

      if (currentChar === ")") {
        this.advance();
        return new Token(RPAREN, currentChar);
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

  eat(tokenType) {
    if (this.currentToken.type === tokenType) {
      this.currentToken = this.lexer.getNextToken();
    } else {
      this.error("eat");
    }
  }

  error(source) {
    throw new Error("Invalid syntax:" + source);
  }

  isEOF() {
    return this.currentToken.type === EOF;
  }

  factor() {
    const token = this.currentToken;

    if (token.type === INTEGER) {
      this.eat(INTEGER);
      return token.value;
    } else if (token.type === LPAREN) {
      this.eat(LPAREN);
      const result = this.expr();
      this.eat(RPAREN);
      return result;
    }

    return value;
  }

  isSumSub(type) {
    return [PLUS, MINUS].includes(type);
  }

  isMulDiv(type) {
    return [MUL, DIV].includes(type);
  }

  term() {
    let result = this.factor();

    while (this.isMulDiv(this.currentToken.type)) {
      const token = this.currentToken;
      const type = token.type;

      this.eat(type);

      const value = this.factor();

      if (type === MUL) {
        result = mul(result, value);
      }

      if (type === DIV) {
        result = div(result, value);
      }
    }

    return result;
  }

  expr() {
    let result = this.term();

    while (this.isSumSub(this.currentToken.type)) {
      const token = this.currentToken;
      const type = token.type;

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
