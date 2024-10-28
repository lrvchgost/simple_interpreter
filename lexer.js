import { INTEGER, MINUS, PLUS, MUL, DIV, EOF, LPAREN, RPAREN } from './helpers.js';

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
