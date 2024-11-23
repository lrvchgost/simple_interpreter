import {
  Assign,
  BinOpNode,
  Block,
  Compaund,
  NoOp,
  NumNode,
  ProcedureDecl,
  Programm,
  Type,
  UnaryOpNode,
  ValDecl,
  Var,
} from "./ast.js";
import {
  INTEGER_CONST,
  REAL_CONST,
  INTEGER,
  REAL,
  ID,
  EOF,
  FLOAT_DIV,
  INTEGER_DIV,
  MINUS,
  MUL,
  PLUS,
  PROGRAM,
  SEMI,
  DOT,
  VAR,
  COMMA,
  COLON,
  BEGIN,
  END,
  ASSIGN,
  LPAREN,
  RPAREN,
  PROCEDURE,
} from "./helpers.js";

export class Parser {
  constructor(lexer) {
    this.lexer = lexer;

    this._currentToken = this.lexer.getNextToken();
  }

  _error(source) {
    throw `[Parser]: Invalid syntax ${source}`;
  }

  _eat(tokenType) {
    if (this._currentToken.type === tokenType) {
      this._currentToken = this.lexer.getNextToken();
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

  _isEOF() {
    return this._currentToken === EOF;
  }

  _isMulDiv() {
    return [MUL, INTEGER_DIV, FLOAT_DIV].includes(this._currentToken.type);
  }

  _isSumSub() {
    return [PLUS, MINUS].includes(this._currentToken.type);
  }

  _programm() {
    this._eat(PROGRAM);

    const varNode = this._variable();
    const progName = varNode.value;

    this._eat(SEMI);

    const blockNode = this._block();
    const progNode = new Programm(progName, blockNode);

    this._eat(DOT);

    return progNode;
  }

  _block() {
    const declarations = this._declrations();
    const compoundStatement = this._compoundStatement();
    const block = new Block(declarations, compoundStatement);

    return block;
  }

  _declrations() {
    const declarations = [];

    while (true) {
      if (this._currentToken.type === VAR) {
        this._eat(VAR);

        while (this._currentToken.type === ID) {
          const varDecl = this._variableDeclaration();
          declarations.push(...varDecl);
          this._eat(SEMI);
        }
      } else if (this._currentToken.type === PROCEDURE) {
        this._eat(PROCEDURE);

        const procName = this._currentToken.value;

        this._eat(ID);

        let params = [];

        if (this._currentToken.type === LPAREN) {
          this._eat(LPAREN);
          params = this._formalParametrsList();
          this._eat(RPAREN);
        }

        this._eat(SEMI);

        const procBlock = this._block();
        const procNode = new ProcedureDecl(procName, params, procBlock);
        declarations.push(procNode);
        this._eat(SEMI);
      } else {
        break;
      }
    }

    return declarations;
  }

  _variableDeclaration() {
    const varNodes = [this._variable()];

    while (this._currentToken.type === COMMA) {
      this._eat(COMMA);
      varNodes.push(this._variable());
    }

    this._eat(COLON);

    const typeNode = this._typeSpec();

    const declarations = varNodes.map((node) => new ValDecl(node, typeNode));

    return declarations;
  }

  _formalParametrsList() {
    const params = [...this._formalParametrs()];

    if (this._currentToken.type === SEMI) {
      this._eat(SEMI);
      params.push(...this._formalParametrs());
    }

    return params;
  }

  _formalParametrs() {
    const paramsNodes = [this._variable()];

    while (this._currentToken.type === COMMA) {
      this._eat(COMMA);
      paramsNodes.push(this._variable());
    }

    this._eat(COLON);

    const typeNode = this._typeSpec();

    const params = paramsNodes.map((node) => new ValDecl(node, typeNode));

    return params;
  }

  _typeSpec() {
    const token = this._currentToken;
    const node = new Type(token);

    if (token.type === INTEGER) {
      this._eat(INTEGER);
    } else {
      this._eat(REAL);
    }

    return node;
  }

  _variable() {
    const node = new Var(this._currentToken);
    this._eat(ID);

    return node;
  }

  _compoundStatement() {
    this._eat(BEGIN);

    const statements = this._statementsList();

    this._eat(END);

    const compound = new Compaund();

    compound.push(statements);

    return compound;
  }

  _statementsList() {
    const result = [this._statement()];

    while (this._currentToken.type === SEMI) {
      this._eat(SEMI);
      result.push(this._statement());
    }

    if (this._currentToken.type === ID) {
      this._error("_statementsList");
    }

    return result;
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
    let left = this._variable();
    const assignToken = this._currentToken;
    this._eat(ASSIGN);
    const right = this._expr();
    const node = new Assign(left, assignToken, right);
    return node;
  }

  _empty() {
    return new NoOp();
  }

  _expr() {
    let node = this._term();

    while (!this._isEOF() && this._isSumSub()) {
      const token = this._currentToken;

      this._eat(token.type);

      node = new BinOpNode(node, token, this._term());
    }

    return node;
  }

  _term() {
    let node = this._factor();

    while (!this._isEOF() && this._isMulDiv()) {
      const token = this._currentToken;

      this._eat(token.type);

      node = new BinOpNode(node, token, this._factor());
    }

    return node;
  }

  _factor() {
    const token = this._currentToken;

    if (token.type === PLUS) {
      this._eat(PLUS);
      return new UnaryOpNode(token, this._factor());
    } else if (token.type === MINUS) {
      this._eat(MINUS);
      return new UnaryOpNode(token, this._factor());
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

  parse() {
    const node = this._programm();

    // console.log(this._stringify(node));

    if (this._currentToken.type !== EOF) {
      this.error("[Parser:parse]: invalid parse result");
    }

    return node;
  }

  _error(message) {
    throw message;
  }

  _stringify(node) {
    return JSON.stringify(node, null, 4);
  }
}
