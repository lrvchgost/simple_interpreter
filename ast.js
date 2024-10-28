class AST {}

export class BinOpNode extends AST {
  constructor(left, op, right) {
    super();
    this.left = left;
    this.right = right;
    this.op = op;
    this.token = op;
  }

  visit(visitor) {
    return visitor.visitForBinOp(this);
  }
}

export class NumNode extends AST {
  constructor(token) {
    super();
    this.token = token;
    this.value = token.value;
  }

  visit(visitor) {
    return visitor.visitForNum(this);
  }
}
