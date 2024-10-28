import { INTEGER, MINUS, PLUS, MUL, DIV, EOF, LPAREN, RPAREN } from './helpers.js';

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
