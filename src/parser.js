import {
  INTEGER,
  MINUS,
  PLUS,
  MUL,
  DIV,
  EOF,
  LPAREN,
  RPAREN,
} from "./helpers.js";
import { NumNode, BinOpNode, UnaryOpNode } from "./ast.js";

export class Parser {
  constructor(lexer) {
    this._lexer = lexer;
    this._currentToken = this._lexer.getNextToken();
  }

  _eat(tokenType) {
    if (this._currentToken.type === tokenType) {
      this._currentToken = this._lexer.getNextToken();
    } else {
      this._error("eat");
    }
  }

  _error(source) {
    throw new Error("Invalid syntax:" + source);
  }

  _isEOF() {
    return this._currentToken.type === EOF;
  }

  _factor() {
    const token = this._currentToken;

    if (token.type === PLUS) {
      this._eat(PLUS);
      const node = new UnaryOpNode(token, this._factor());
      return node;
    } else if (token.type === MINUS) {
      this._eat(MINUS);
      const node = new UnaryOpNode(token, this._factor());
      return node;
    } else if (token.type === INTEGER) {
      this._eat(INTEGER);
      return new NumNode(token);
    } else if (token.type === LPAREN) {
      this._eat(LPAREN);
      const node = this._expr();
      this._eat(RPAREN);
      return node;
    }

    return value;
  }

  _isSumSub() {
    return [PLUS, MINUS].includes(this._currentToken.type);
  }

  _isMulDiv() {
    return [MUL, DIV].includes(this._currentToken.type);
  }

  _term() {
    let node = this._factor();

    while (this._isMulDiv()) {
      const token = this._currentToken;

      this._eat(token.type);

      node = new BinOpNode(node, token, this._factor());
    }

    return node;
  }

  _expr() {
    let node = this._term();

    while (this._isSumSub()) {
      const token = this._currentToken;

      this._eat(token.type);

      node = new BinOpNode(node, token, this._term());
    }

    return node;
  }

  parse() {
    return this._expr();
  }
}
