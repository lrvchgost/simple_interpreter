import {
  INTEGER,
  MINUS,
  PLUS,
  MUL,
  DIV,
  EOF,
  LPAREN,
  RPAREN,
  BEGIN,
  END,
  ID,
  ASSIGN,
  SEMI,
  DOT,
} from "./helpers.js";

export class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }

  toString() {
    return `Token(${this.type}, ${this.value})`;
  }
}

const RESERVED_KEYWORDS = {
  [BEGIN]: new Token(BEGIN, BEGIN),
  [END]: new Token(END, END),
};

export class Lexer {
  constructor(text) {
    this.text = text;
    this.pos = 0;
    this.currentChar = text[this.pos];
  }

  _error(source) {
    throw new Error("Error parsing input:" + source);
  }

  _peek() {
    const pos = this.pos + 1;
    if (pos > this.text.length - 1) {
      return null;
    } else {
      return this.text[pos];
    }
  }

  _isUnderscore() {
    return this.currentChar === "_";
  }

  _isAlphaChar() {
    const code = this.currentChar.charCodeAt(0);

    if ((code > 64 && code < 91) || (code > 96 && code < 123)) {
      return true;
    }

    return false;
  }

  _isAlfaNum() {
    return this._isInteger() || this._isAlphaChar();
  }

  _id() {
    let result = "";

    while (!this._isEOF() && (this._isAlfaNum() || this._isUnderscore())) {
      result += this.currentChar;
      this._advance();
    }

    return RESERVED_KEYWORDS[result.toUpperCase()] ?? new Token(ID, result);
  }

  _isDiv() {
    const d = this.text[this.pos];
    if (d !== "d") {
      return false;
    }
    const i = this.text[this.pos + 1];
    if (i !== "i") {
      return false;
    }
    const v = this.text[this.pos + 2];
    if (v !== "v") {
      return false;
    }
    const s = this.text[this.pos + 3];
    if (s !== " ") {
      return false;
    }

    return true;
  }

  _isInteger() {
    return Number.isInteger(parseInt(this.currentChar));
  }

  _isSpace() {
    return this.currentChar === " " || this.currentChar === '\n';
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

  _getDiv() {
    let result = "";
    debugger;

    for (let i = 0; i < 3; i++) {
      result += this.currentChar;
      this._advance();
    }

    return result;
  }

  // Tokenizer
  getNextToken() {
    while (!this._isEOF()) {
      debugger;
      if (this._isSpace()) {
        this._skipWhiteSpaces();
        continue;
      }

      if (this._isInteger()) {
        return new Token(INTEGER, this._integer());
      }

      if ((this._isAlphaChar() || this._isUnderscore()) && !this._isDiv()) {
        return this._id();
      }

      let currentChar = this.currentChar;

      if (currentChar === ":" && this._peek() === "=") {
        this._advance();
        this._advance();
        return new Token(ASSIGN, ":=");
      }

      if (currentChar === ";") {
        this._advance();
        return new Token(SEMI, currentChar);
      }

      if (currentChar === ".") {
        this._advance();
        return new Token(DOT, currentChar);
      }

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

      if (this._isDiv()) {
        return new Token(DIV, this._getDiv());
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
