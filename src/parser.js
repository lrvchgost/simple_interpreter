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
import { ErrorCode, ErrorCodeEnum } from "./error/codes.js";
import { ParserError } from "./error/errors.js";
import { TokenType } from "./helpers.js";

export class Parser {
  constructor(lexer) {
    this.lexer = lexer;

    this._currentToken = this.lexer.getNextToken();
  }

  _error(errorCode, token) {
    const error = new ErrorCode(errorCode);
    throw new ParserError(errorCode, token, `${error.value} -> ${token}`);
  }

  _eat(tokenType) {
    if (this._currentToken.type === tokenType) {
      this._currentToken = this.lexer.getNextToken();
    } else {
      this._error(ErrorCodeEnum.UNEXPECTED_ERROR, this._currentToken);
      // this._error(
      //   JSON.stringify(
      //     {
      //       method: "eat",
      //       currentToken: this._currentToken,
      //       expectedToken: tokenType,
      //     },
      //     null,
      //     4
      //   )
      // );
    }
  }

  _isEOF() {
    return this._currentToken === TokenType.EOF;
  }

  _isMulDiv() {
    return [TokenType.MUL, TokenType.INTEGER_DIV, TokenType.FLOAT_DIV].includes(this._currentToken.type);
  }

  _isSumSub() {
    return [TokenType.PLUS, TokenType.MINUS].includes(this._currentToken.type);
  }

  _programm() {
    this._eat(TokenType.PROGRAM);

    const varNode = this._variable();
    const progName = varNode.value;

    this._eat(TokenType.SEMI);

    const blockNode = this._block();
    const progNode = new Programm(progName, blockNode);

    this._eat(TokenType.DOT);

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
      if (this._currentToken.type === TokenType.VAR) {
        this._eat(TokenType.VAR);

        while (this._currentToken.type === TokenType.ID) {
          const varDecl = this._variableDeclaration();
          declarations.push(...varDecl);
          this._eat(TokenType.SEMI);
        }
      } else if (this._currentToken.type === TokenType.PROCEDURE) {
        const procNode = this._procedureDeclarations();
        declarations.push(procNode);
        this._eat(TokenType.SEMI);
      } else {
        break;
      }
    }

    return declarations;
  }

  _procedureDeclarations() {
    this._eat(TokenType.PROCEDURE);

    const procName = this._currentToken.value;

    this._eat(TokenType.ID);

    let params = [];

    if (this._currentToken.type === TokenType.LPAREN) {
      this._eat(TokenType.LPAREN);
      params = this._formalParametrsList();
      this._eat(TokenType.RPAREN);
    }

    this._eat(TokenType.SEMI);

    const procBlock = this._block();
    const procNode = new ProcedureDecl(procName, params, procBlock);

    return procNode;
  }

  _variableDeclaration() {
    const varNodes = [this._variable()];

    while (this._currentToken.type === TokenType.COMMA) {
      this._eat(TokenType.COMMA);
      varNodes.push(this._variable());
    }

    this._eat(TokenType.COLON);

    const typeNode = this._typeSpec();

    const declarations = varNodes.map((node) => new ValDecl(node, typeNode));

    return declarations;
  }

  _formalParametrsList() {
    const params = [...this._formalParametrs()];

    if (this._currentToken.type === TokenType.SEMI) {
      this._eat(TokenType.SEMI);
      params.push(...this._formalParametrs());
    }

    return params;
  }

  _formalParametrs() {
    const paramsNodes = [this._variable()];

    while (this._currentToken.type === TokenType.COMMA) {
      this._eat(TokenType.COMMA);
      paramsNodes.push(this._variable());
    }

    this._eat(TokenType.COLON);

    const typeNode = this._typeSpec();

    const params = paramsNodes.map((node) => new ValDecl(node, typeNode));

    return params;
  }

  _typeSpec() {
    const token = this._currentToken;
    const node = new Type(token);

    if (token.type === TokenType.INTEGER) {
      this._eat(TokenType.INTEGER);
    } else {
      this._eat(TokenType.REAL);
    }

    return node;
  }

  _variable() {
    const node = new Var(this._currentToken);
    this._eat(TokenType.ID);

    return node;
  }

  _compoundStatement() {
    this._eat(TokenType.BEGIN);

    const statements = this._statementsList();

    this._eat(TokenType.END);

    const compound = new Compaund();

    compound.push(statements);

    return compound;
  }

  _statementsList() {
    const result = [this._statement()];

    while (this._currentToken.type === TokenType.SEMI) {
      this._eat(TokenType.SEMI);
      result.push(this._statement());
    }

    if (this._currentToken.type === TokenType.ID) {
      this._error(ErrorCodeEnum.UNEXPECTED_ERROR, this._currentToken);
    }

    return result;
  }

  _statement() {
    let node;

    if (this._currentToken.type === TokenType.BEGIN) {
      node = this._compoundStatement();
    } else if (this._currentToken.type === TokenType.ID) {
      node = this._assignmentStatment();
    } else {
      node = this._empty();
    }

    return node;
  }

  _assignmentStatment() {
    let left = this._variable();
    const assignToken = this._currentToken;
    this._eat(TokenType.ASSIGN);
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

    if (token.type === TokenType.PLUS) {
      this._eat(TokenType.PLUS);
      return new UnaryOpNode(token, this._factor());
    } else if (token.type === TokenType.MINUS) {
      this._eat(TokenType.MINUS);
      return new UnaryOpNode(token, this._factor());
    } else if (token.type === TokenType.INTEGER_CONST) {
      this._eat(TokenType.INTEGER_CONST);
      return new NumNode(token);
    } else if (token.type === TokenType.REAL_CONST) {
      this._eat(TokenType.REAL_CONST);
      return new NumNode(token);
    } else if (token.type === TokenType.LPAREN) {
      this._eat(TokenType.LPAREN);
      const node = this._expr();
      this._eat(TokenType.RPAREN);
      return node;
    } else {
      return this._variable();
    }
  }

  parse() {
    const node = this._programm();

    // console.log(this._stringify(node));

    if (this._currentToken.type !== TokenType.EOF) {
      this.error("[Parser:parse]: invalid parse result");
    }

    return node;
  }

  _stringify(node) {
    return JSON.stringify(node, null, 4);
  }
}
