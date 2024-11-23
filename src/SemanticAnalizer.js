import { ProcedureSymbol, ScopedSymbolTable, VarSymbol } from "./symbols.js";

export class SemanticAnalizer {
  currentScope = null;

  constructor(isLoging) {
    if (this.isLoging) {
      console.log("> ===== Create builtin scope ");
    }
    const scope = new ScopedSymbolTable("builtin", 0, this.currentScope);
    scope.initBuilins();

    this.currentScope = scope;
    this.isLoging = isLoging;
  }

  visitForProgramm(node) {
    if (this.isLoging) {
      console.log("> ===== ENTER global scope");
    }
    this.currentScope.define(new VarSymbol(node.name));
    const scope = new ScopedSymbolTable(
      "global",
      this.currentScope.scopeLevel + 1,
      this.currentScope
    );

    this.currentScope = scope;

    node.block.visit(this);

    if (this.isLoging) {
      console.log(scope.toString());
    }
    this.currentScope = scope.enclosingScope;
    if (this.isLoging) {
      console.log("< ===== LEAVE global scope");

      console.log(this.currentScope.toString());
    }
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
      throw `Error: Duplicate identifier "${varName}" found`;
    }

    this.currentScope.define(varSymbol);
  }

  visitVar(node) {
    const varName = node.value;
    const symbol = this.currentScope.lookup(varName);

    if (symbol === undefined) {
      throw `Error: Symbol(identifier) not found "${varName}"`;
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

    if (this.isLoging) {
      console.log("> ==== ENTER proc scope ", procName);
    }

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

    if (this.isLoging) {
      console.log(procedureScope.toString());
    }
    this.currentScope = this.currentScope.enclosingScope;
    if (this.isLoging) {
      console.log(`< ===== LEAVE proc scope ${procName}`);
    }
  }

  toString() {
    return this.scope.toString();
  }
}
