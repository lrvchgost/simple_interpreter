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
  VAR,
  REAL,
  PROGRAM,
  INTEGER_DIV,
  INTEGER_CONST,
  REAL_CONST,
  COLON,
  COMMA,
  FLOAT_DIV,
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
  [PROGRAM]: new Token(PROGRAM, PROGRAM),
  [VAR]: new Token(VAR, VAR),
  [DIV]: new Token(INTEGER_DIV, DIV),
  [INTEGER]: new Token(INTEGER, INTEGER),
  [REAL]: new Token(REAL, REAL),
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

    while (!this._isEOF() && this._isAlfaNum()) {
      result += this.currentChar;
      this._advance();
    }

    return RESERVED_KEYWORDS[result.toUpperCase()] ?? new Token(ID, result);
  }

  _isInteger() {
    return Number.isInteger(parseInt(this.currentChar));
  }

  _isSpace() {
    return this.currentChar === " " || this.currentChar === "\n";
  }

  _skipComment() {
    while (!this._isEOF() && this.currentChar !== "}") {
      this._advance();
    }

    this._advance();
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
    while (!this._isEOF() && this._isSpace()) {
      this._advance();
    }
  }

  _number() {
    let result = "";

    while (!this._isEOF() && this._isInteger()) {
      result += this.currentChar;
      this._advance();
    }

    if (this.currentChar === ".") {
      result += this.currentChar;

      this._advance();

      while (!this._isEOF() && this._isInteger(this.currentChar)) {
        result += this.currentChar;
        this._advance();
      }

      return new Token(REAL_CONST, Number(result));
    } else {
      return new Token(INTEGER_CONST, Number(result));
    }
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

      if (this.currentChar === "{") {
        debugger;
        this._advance();
        this._skipComment();
        continue;
      }

      if (this._isInteger()) {
        return this._number();
      }

      if (this._isAlphaChar()) {
        return this._id();
      }

      let currentChar = this.currentChar;

      if (currentChar === ":" && this._peek() === "=") {
        this._advance();
        this._advance();
        return new Token(ASSIGN, ":=");
      }

      if (currentChar === ":") {
        this._advance();
        return new Token(COLON, currentChar);
      }

      if (currentChar === ",") {
        this._advance();
        return new Token(COMMA, currentChar);
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

      if (currentChar === "/") {
        this._advance();
        return new Token(FLOAT_DIV, currentChar);
      }

      if (currentChar === "(") {
        this._advance();
        return new Token(LPAREN, currentChar);
      }

      if (currentChar === ")") {
        this._advance();
        return new Token(RPAREN, currentChar);
      }

      this._error("cannot recognize symbol " +  this.currentChar);
    }

    return new Token(EOF, null);
  }
}
