import {
  INTEGER,
  MINUS,
  PLUS,
  MUL,
  DIV,
  EOF,
  LPAREN,
  RPAREN,
  ID,
  ASSIGN,
  BEGIN,
  SEMI,
  END,
  DOT,
} from "./helpers.js";
import {
  NumNode,
  BinOpNode,
  UnaryOpNode,
  NoOp,
  Var,
  Assign,
  Compaund,
} from "./ast.js";

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
    } else {
      return this._variable();
    }
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

  _programm() {
    debugger;
    const node = this._compoundStatement();
    this._eat(DOT);

    return node;
  }

  _compoundStatement() {
    this._eat(BEGIN);
    const nodes = this._statementsList();
    this._eat(END);

    const root = new Compaund();

    root.push(nodes);

    return root;
  }

  _statementsList() {
    const node = this._statement();

    const results = [node];

    while (this._currentToken.type === SEMI) {
      this._eat(SEMI);
      results.push(this._statement());
    }

    if (this._currentToken.type === ID) {
      this.error("_statementsList");
    }

    return results;
  }

  _statement() {
    let node;

    if (this._currentToken.type === BEGIN) {
      node = this._compoundStatement();
    } else if (this._currentToken.type === ID) {
      node = this._assignmentStatment();
    } else {
      node = this._empty();
    }

    return node;
  }

  _assignmentStatment() {
    const left = this._variable();
    const token = this._currentToken;
    this._eat(ASSIGN);
    const right = this._expr();
    const node = new Assign(left, token, right);
    return node;
  }

  _variable() {
    const node = new Var(this._currentToken);
    this._eat(ID);
    return node;
  }

  _empty() {
    return new NoOp();
  }

  parse() {
    const node = this._programm();

    if (!this._currentToken.type === EOF) {
      return this.error("[parse]: invalid parse result");
    }

    return node;
  }

  error(error) {
    throw error;
  }
}
