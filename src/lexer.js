import { INTEGER, MINUS, PLUS, MUL, DIV, EOF, LPAREN, RPAREN } from './helpers.js';

export class Token {
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

  _error(source) {
    throw new Error("Error parsing input:" + source);
  }

  _isInteger() {
    return Number.isInteger(parseInt(this.currentChar));
  }

  _isSpace() {
    return this.currentChar === " ";
  }

  _advance() {
    this.pos++;

    if (this.pos > this.text.length - 1) {
      this.currentChar = null;
    } else {
      this.currentChar = this.text[this.pos];
    }
  }

  _skipWhiteSpaces() {
    while (!this._isEOF() && this._isSpace(this.currentChar)) {
      this._advance();
    }
  }

  _integer() {
    let result = "";

    while (!this._isEOF() && this._isInteger(this.currentChar)) {
      result += this.currentChar;
      this._advance();
    }

    return Number(result);
  }

  _isEOF() {
    return this.currentChar === null;
  }

  // Tokenizer
  getNextToken() {
    while (!this._isEOF()) {
      if (this._isSpace()) {
        this._skipWhiteSpaces();
        continue;
      }

      if (this._isInteger()) {
        return new Token(INTEGER, this._integer());
      }

      let currentChar = this.currentChar;

      if (currentChar === "+") {
        this._advance();
        return new Token(PLUS, currentChar);
      }

      if (currentChar === "-") {
        this._advance();
        return new Token(MINUS, currentChar);
      }

      if (currentChar === "*") {
        this._advance();
        return new Token(MUL, currentChar);
      }

      if (currentChar === "/") {
        this._advance();
        return new Token(DIV, currentChar);
      }

      if (currentChar === "(") {
        this._advance();
        return new Token(LPAREN, currentChar);
      }

      if (currentChar === ")") {
        this._advance();
        return new Token(RPAREN, currentChar);
      }

      this._error("getNextToken");
    }

    return new Token(EOF, null);
  }
}
