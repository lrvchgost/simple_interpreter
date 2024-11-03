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
