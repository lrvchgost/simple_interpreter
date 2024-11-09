class AST {
  constructor(token) {
    this.token = token;
  }

  visit() {
    throw "AST: function visit is not implemented";
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

export class NumNode extends AST {
  constructor(token) {
    super(token);
    this.value = token.value;
  }

  visit(visitor) {
    return visitor.visitForNum(this);
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

export class Compaund extends AST {
  children = [];

  constructor() {
    super();
  }

  push(nodes) {
    this.children.push(...nodes);[]
  }

  visit(visitor) {
   return  visitor.visitCompound(this);
  }
}

export class Assign extends AST {
  constructor(left, token, right) {
    super();
    this.left = left;
    this.token = token;
    this.right = right;
  }

  visit(visitor) {
    return visitor.visitAssign(this);
  }
}

export class Var extends AST {
  constructor(token) {
    super();
    this.token = token;
    this.value = token.value;
  }

  visit(visitor) {
    return visitor.visitVar(this);
  }
}

export class NoOp extends AST {
  constructor() {
    super();
  }

  visit(visitor) {
    return visitor.visitNoOp(this);
  }
}
