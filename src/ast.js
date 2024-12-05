class AST {
  constructor(token) {
    this.token = token;
  }

  visit() {
    throw ("[AST]: method visit is not implemented for", this.token.type);
  }
}

export class Programm extends AST {
  constructor(name, block) {
    super();

    this.name = name;
    this.block = block;
  }

  visit(visitor) {
    return visitor.visitForProgramm(this);
  }
}

export class Block extends AST {
  constructor(declarations, compoundStatement) {
    super();

    this.declarations = declarations;
    this.compoundStatement = compoundStatement;
  }

  visit(visitor) {
    return visitor.visitForBlock(this);
  }
}

export class ValDecl extends AST {
  constructor(varNode, typeNode) {
    super();

    this.varNode = varNode;
    this.typeNode = typeNode;
  }

  visit(visitor) {
    return visitor.visitForValDecl(this);
  }
}

export class ProcedureDecl extends AST {
  constructor(procName, params, procBlock) {
    super();

    this.procName = procName;
    this.params = params;
    this.procBlock = procBlock;
  }

  visit(visitor) {
    return visitor.visitProcedureDecl(this);
  }
}

export class Type extends AST {
  constructor(token) {
    super(token);

    this.value = token.value;
  }

  visit(visitor) {
    return visitor.visitForType(this);
  }
}

export class Var extends AST {
  constructor(token) {
    super(token);

    this.value = token.value;
  }

  visit(visitor) {
    return visitor.visitVar(this);
  }
}

export class NoOp extends AST {
  constructor(token) {
    super(token);
  }

  visit(visitor) {
    return visitor.visitNoOp(this);
  }
}

export class Assign extends AST {
  constructor(left, token, right) {
    super(token);
    this.left = left;
    this.right = right;
  }

  visit(visitor) {
    return visitor.visitAssign(this);
  }
}

export class Compaund extends AST {
  children = [];

  constructor() {
    super();
  }

  push(nodes) {
    this.children.push(...nodes);
  }

  visit(visitor) {
    return visitor.visitCompound(this);
  }
}

export class UnaryOpNode extends AST {
  constructor(token, node) {
    super(token);

    this.node = node;
  }

  visit(visitor) {
    return visitor.visitForUnaryOp(this);
  }
}

export class NumNode extends AST {
  constructor(token) {
    super(token);

    this.value = token.value;
  }

  visit(visitor) {
    return visitor.visitForNum(this);
  }
}

export class BinOpNode extends AST {
  constructor(left, token, right) {
    super(token);

    this.left = left;
    this.right = right;
    this.op = token;
  }

  visit(visitor) {
    return visitor.visitForBinOp(this);
  }
}

export class Param extends AST {
  constructor(varNode, typeNode) {
    super();

    this.varNode = varNode;
    this.typeNode = typeNode;
  }

  visit(visitor) {
    visitor.visitParam(this);
  }
}

export class ProcCall extends AST {
  constructor(procName, actualParams, token) {
    super(token);
    this.procName = procName;
    this.actualParams = actualParams;
    this.procSymbol = null;
  }

  visit(visitor) {
    visitor.visitProcCall(this);
  }
}
