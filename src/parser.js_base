import {
  INTEGER,
  MINUS,
  PLUS,
  MUL,
  EOF,
  LPAREN,
  RPAREN,
  ID,
  ASSIGN,
  BEGIN,
  SEMI,
  END,
  DOT,
  REAL,
  COMMA,
  COLON,
  PROGRAM,
  INTEGER_DIV, 
  FLOAT_DIV,
  VAR,
  INTEGER_CONST,
  REAL_CONST,
} from "./helpers.js";
import {
  NumNode,
  BinOpNode,
  UnaryOpNode,
  NoOp,
  Var,
  Assign,
  Compaund,
  Programm,
  Block,
  ValDecl,
  Type,
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
      this._error(
        JSON.stringify(
          {
            method: "eat",
            currentToken: this._currentToken,
            expectedToken: tokenType,
          },
          null,
          4
        )
      );
    }
  }

  _error(source) {
    throw new Error("Invalid syntax:" + source);
  }

  _isEOF() {
    return this._currentToken.type === EOF;
  }

  _isSumSub() {
    return [PLUS, MINUS].includes(this._currentToken.type);
  }

  _isMulDiv() {
    return [MUL, INTEGER_DIV, FLOAT_DIV].includes(this._currentToken.type);
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
    } else if (token.type === INTEGER_CONST) {
      this._eat(INTEGER_CONST);
      return new NumNode(token);
    } else if (token.type === REAL_CONST) {
      this._eat(REAL_CONST);
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
    this._eat(PROGRAM);

    const varNode = this._variable();
    const progName = varNode.value;

    this._eat(SEMI);

    const blockNode = this._block();
    const programNode = new Programm(progName, blockNode);

    this._eat(DOT);

    return programNode;
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

  _block() {
    const declarationsNode = this._declrations();
    const compoundStatementNode = this._compoundStatement();
    const node = new Block(declarationsNode, compoundStatementNode);

    return node;
  }

  _declrations() {
    const declarations = [];

    if (this._currentToken.type === VAR) {
      this._eat(VAR);

      while(this._currentToken.type === ID) {
        const valDecl = this._variableDeclaration();
        declarations.push(...valDecl);
        this._eat(SEMI);
      }
    }

    return declarations;
  }

  _variableDeclaration() {
    const varNodes = [new Var(this._currentToken)];

    this._eat(ID);

    while (this._currentToken.type === COMMA) {
      this._eat(COMMA);

      varNodes.push(new Var(this._currentToken));

      this._eat(ID);
    }

    this._eat(COLON);

    const typeNode = this._typeSpec();

    const declarations = varNodes.map((node) => new ValDecl(node, typeNode));

    return declarations;
  }

  _typeSpec() {
    const token = this._currentToken;

    if (token.type === INTEGER) {
      this._eat(INTEGER);
    } else {
      this._eat(REAL);
    }

    const node = new Type(token);

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
