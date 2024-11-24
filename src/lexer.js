import { TokenType, RESERVED_KEYWORDS, SingleCharByValue, SingleChar } from "./helpers.js";
import { Token } from './token.js';
import { LexerError } from "./error/errors.js";

export class Lexer {
  constructor(text) {
    this.text = text;
    this.pos = 0;
    this.currentChar = text[this.pos];
    this.lineno = 1;
    this.column = 1;
  }

  _error() {
    const message = `Lexer error on ${this.currentChar} line: ${this.lineno} column: ${this.column}`;

    throw new LexerError(message);
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

    const token = RESERVED_KEYWORDS[result.toUpperCase()] ?? new Token(TokenType.ID, result, this.lineno, this.column);

    token.lineno = this.lineno;
    token.column = this.column;

    return token;
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
    if (this.currentChar === "\n") {
      this.lineno += 1;
      this.column = 0;
    }
    this.pos++;

    if (this.pos > this.text.length - 1) {
      this.currentChar = null;
    } else {
      this.currentChar = this.text[this.pos];
      this.column += 1;
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

      while (!this._isEOF() && this._isInteger()) {
        result += this.currentChar;
        this._advance();
      }

      return new Token(TokenType.REAL_CONST, Number(result));
    } else {
      return new Token(TokenType.INTEGER_CONST, Number(result));
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
        return new Token(TokenType.ASSIGN, ":=");
      }

      const type = SingleCharByValue[this.currentChar];
      
      if (type === undefined) {
        this._error();
      } else {
        this._advance();
        return new Token(type, SingleChar[type], this.lineno, this.column);
      }

      this._error();
    }

    return new Token(TokenType.EOF, null, this.lineno, this.column);
  }
}
