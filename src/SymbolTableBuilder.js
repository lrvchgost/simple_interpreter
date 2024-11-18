import { SymbolTable, VarSymbol } from "./symbols.js";

export class SymbolTableBuilder {
  symbolTable = new SymbolTable();

  visitForProgramm(node) {
    return node.block.visit(this);
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
    const typeSymbol = this.symbolTable.lookup(typeName);
    const varName = node.varNode.value;
    const varSymbol = new VarSymbol(varName, typeSymbol);

    this.symbolTable.define(varSymbol);
  }

  visitVar(node) {
    const varName = node.value;
    const symbol = this.symbolTable.lookup(varName);

    if (symbol === undefined) {
      throw `Error: Symbol(identifier) not found ${varName}`;
    }
  }

  visitAssign(node) {
    const varName = node.left.value;
    const symbol = this.symbolTable.lookup(varName);

    if (symbol === undefined) {
      throw `Error: Symbol(identifier) not found ${varName}`;
    }

    node.right.visit(this);
  }

  visitProcedure(node) {
    return;
  }

  toString() {
    return this.symbolTable.toString();
  }
}
