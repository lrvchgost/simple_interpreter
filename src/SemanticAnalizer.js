import { ErrorCodeEnum, ErrorCode } from "./error/codes.js";
import { SemanticError } from "./error/errors.js";
import { ProcedureSymbol, ScopedSymbolTable, VarSymbol } from "./symbols.js";
import { isScope } from './init.js';

export class SemanticAnalizer {
  currentScope = null;

  constructor() {
    this._log("> ===== Create builtin scope ");
    const scope = new ScopedSymbolTable("builtin", 0, this.currentScope);
    scope.initBuilins();

    this.currentScope = scope;
  }

  visitForProgramm(node) {
    this._log("> ===== ENTER global scope");
    this.currentScope.define(new VarSymbol(node.name));
    const scope = new ScopedSymbolTable(
      "global",
      this.currentScope.scopeLevel + 1,
      this.currentScope
    );

    this.currentScope = scope;

    node.block.visit(this);

    this._log(scope.toString());
    this.currentScope = scope.enclosingScope;
    this._log("< ===== LEAVE global scope");
    this._log(this.currentScope.toString());
  }

  visitForBlock(node) {
    for (let declaration of node.declarations) {
      declaration.visit(this);
    }

    node.compoundStatement.visit(this);
  }

  visitForBinOp(node) {
    node.left.visit(this);
    node.right.visit(this);
  }

  visitForNum() {
    return;
  }

  visitForUnaryOp(node) {
    node.node.visit(this);
  }

  visitCompound(node) {
    for (let child of node.children) {
      child.visit(this);
    }
  }

  visitNoOp() {
    return;
  }

  visitForValDecl(node) {
    const typeName = node.typeNode.value;
    const typeSymbol = this.currentScope.lookup(typeName);
    const varName = node.varNode.value;
    const varSymbol = new VarSymbol(varName, typeSymbol);

    const defined = this.currentScope.lookup(varName, true);

    if (defined) {
      this._error(ErrorCodeEnum.DUPLICATE_ID, node.varNode.token);
    }

    this.currentScope.define(varSymbol);
  }

  visitVar(node) {
    const varName = node.value;
    const symbol = this.currentScope.lookup(varName);

    if (symbol === undefined) {
      this._error(ErrorCodeEnum.ID_NOT_FOUND, node.token);
    }
  }

  visitAssign(node) {
    const varName = node.left.value;
    const symbol = this.currentScope.lookup(varName);

    if (symbol === undefined) {
      throw `Error: Symbol(identifier) not found "${varName}"`;
    }

    node.right.visit(this);
  }

  visitProcedureDecl(node) {
    const procName = node.procName;
    const procSymbol = new ProcedureSymbol(procName);
    this.currentScope.define(procSymbol);

    procSymbol.blockAst = node.procBlock;

    this._log("> ==== ENTER proc scope ", procName);

    const procedureScope = new ScopedSymbolTable(
      procName,
      this.currentScope.scopeLevel + 1,
      this.currentScope
    );

    this.currentScope = procedureScope;

    for (let param of node.params) {
      const paramType = this.currentScope.lookup(param.typeNode.value);
      const paramName = param.varNode.value;
      const varSymbol = new VarSymbol(paramName, paramType);
      this.currentScope.define(varSymbol);
      procSymbol.params.push(varSymbol);
    }

    node.procBlock.visit(this);

    this._log(procedureScope.toString());
    this.currentScope = this.currentScope.enclosingScope;
    this._log(`< ===== LEAVE proc scope ${procName}`);
  }

  visitProcCall(node) {
    const symbol = this.currentScope.lookup(node.procName);
    const paramsLength = symbol.getParamsLength();

    if (paramsLength !== node.actualParams.length) {
      this._error(ErrorCodeEnum.WRONG_PARAMS_NUM, node.token);
    }

    for (const param of node.actualParams) {
      param.visit(this);
    }

    node.procSymbol = symbol;
  }

  toString() {
    return this.scope.toString();
  }

  _error(errorCode, token) {
    const error = new ErrorCode(errorCode);
    throw new SemanticError(errorCode, token, `${error.value} -> ${token}`);
  }

  _log(message) {
    if (isScope) {
      console.log(message);
    }
  }
}
