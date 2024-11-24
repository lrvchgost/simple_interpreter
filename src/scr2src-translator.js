import { ProcedureSymbol, ScopedSymbolTable, VarSymbol } from "./symbols.js";

export class Src2srcTranslator {
  currentScope = null;

  constructor() {
    const scope = new ScopedSymbolTable("builtin", 0, this.currentScope, false);
    scope.initBuilins();

    this.currentScope = scope;
  }

  visitForProgramm(node) {
    this.currentScope.define(new VarSymbol(node.name));
    const scope = new ScopedSymbolTable(
      "global",
      this.currentScope.scopeLevel + 1,
      this.currentScope,
      false
    );

    let resultStr = `program ${node.name}0;\n`;

    this.currentScope = scope;

    const blockStr = node.block.visit(this);

    this.currentScope = scope.enclosingScope;

    resultStr += blockStr;
    resultStr += ".";
    resultStr += ` { END OF ${node.name} }`;

    return resultStr;
  }

  getLevel() {
    return Array.from({ length: this.currentScope.scopeLevel })
      .map(() => "    ")
      .join("");
  }

  visitForBlock(node) {
    const level = this.getLevel();

    const results = [];

    for (let declaration of node.declarations) {
      const declrStr = declaration.visit(this);
      results.push(declrStr);
    }

    results.push(`\n${level}begin`);

    let compoundStr = node.compoundStatement.visit(this);

    results.push(compoundStr);
    results.push(`${level}end`);

    return results.join(`\n`);
  }

  visitForBinOp(node) {
    const left = node.left.visit(this);
    const right = node.right.visit(this);

    return `${left} ${node.op.value} ${right}`;
  }

  visitForNum() {
    return;
  }

  visitForUnaryOp(node) {
    node.node.visit(this);
  }

  visitCompound(node) {
    let results = [];

    for (let child of node.children) {
      const childStr = child.visit(this);

      results.push(childStr);
    }

    return results.join("\n");
  }

  visitNoOp() {
    return;
  }

  visitForValDecl(node) {
    const typeName = node.typeNode.value;
    const typeSymbol = this.currentScope.lookup(typeName);
    const varName = node.varNode.value;
    const varSymbol = new VarSymbol(varName, typeSymbol);

    this.currentScope.define(varSymbol);

    const level = this.getLevel();

    return `${level}var ${varName}${this.currentScope.scopeLevel} : ${typeName};`;
  }

  visitVar(node) {
    const varName = node.value;
    const symbol = this.currentScope.lookup(varName);

    return `<${symbol.name}${symbol.scope.scopeLevel} : ${symbol.type}>`;
  }

  visitAssign(node) {
    const level = this.getLevel();

    const left = node.left.visit(this);
    const right = node.right.visit(this);

    return level + "    " + left + " := " + right;
  }

  visitProcedureDecl(node) {
    const procName = node.procName;
    const procSymbol = new ProcedureSymbol(procName);
    this.currentScope.define(procSymbol);

    const procedureScope = new ScopedSymbolTable(
      procName,
      this.currentScope.scopeLevel + 1,
      this.currentScope,
      false
    );

    this.currentScope = procedureScope;

    const params = [];

    for (let param of node.params) {
      const paramType = this.currentScope.lookup(param.typeNode.value);
      const paramName = param.varNode.value;
      const varSymbol = new VarSymbol(paramName, paramType);
      params.push(`${paramName}${this.currentScope.scopeLevel}: ${paramType}`);
      this.currentScope.define(varSymbol);
      procSymbol.params.push(varSymbol);
    }

    let blockStr = node.procBlock.visit(this);

    this.currentScope = this.currentScope.enclosingScope;

    const level = this.getLevel();

    const paramsStr = params.length ? `(${params.join("; ")})` : '';

    let resultStr = `\n${level}procedure ${procName}${
      this.currentScope.scopeLevel
    } ${paramsStr}\n`;
    resultStr += blockStr;
    resultStr += ` { END OF ${procName} }\n`;

    return resultStr;
  }

  toString() {
    return this.scope.toString();
  }
}
