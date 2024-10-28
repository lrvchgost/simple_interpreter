import { INTEGER, MINUS, PLUS, MUL, DIV, EOF, LPAREN, RPAREN } from './helpers.js';
import { NumNode, BinOpNode } from "./ast.js";

export class Parser {
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
      return new NumNode(token);
    } else if (token.type === LPAREN) {
      this.eat(LPAREN);
      const node = this.expr();
      this.eat(RPAREN);
      return node;
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
    let node = this.factor();

    while (this.isMulDiv(this.currentToken.type)) {
      const token = this.currentToken;

      this.eat(token.type);

      node = new BinOpNode(node, token, this.factor());
    }

    return node;
  }

  expr() {
    let node = this.term();

    while (this.isSumSub(this.currentToken.type)) {
      const token = this.currentToken;

      this.eat(token.type);

      node = new BinOpNode(node, token, this.term());
    }

    return node;
  }

  parse() {
    return this.expr();
  }
}
