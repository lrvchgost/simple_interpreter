import { MINUS, PLUS, MUL, FLOAT_DIV, INTEGER_DIV } from "./helpers.js";

export class BaseTranslator {
  GLOBAL_SCOPE = {};

  visitForBinOp(node) {
    if (node.op.type === PLUS) {
      const left = node.left.visit(this);
      const right = node.right.visit(this);

      return left + right;
    }

    if (node.op.type === MINUS) {
      const left = node.left.visit(this);
      const right = node.right.visit(this);

      return left - right;
    }

    if (node.op.type === MUL) {
      const left = node.left.visit(this);
      const right = node.right.visit(this);

      return left * right;
    }

    if (node.op.type === INTEGER_DIV) {
      const left = node.left.visit(this);
      const right = node.right.visit(this);

      return Math.trunc(left / right);
    }

    if (node.op.type === FLOAT_DIV) {
      const left = node.left.visit(this);
      const right = node.right.visit(this);

      return left / right;
    }
  }

  visitForNum(node) {
    return node.value;
  }

  visitForUnaryOp(node) {
    if (node.token.type === PLUS) {
      return +node.node.visit(this);
    }

    if (node.token.type === MINUS) {
      return -node.node.visit(this);
    }
  }

  visitCompound(node) {
    for (let child of node.children) {
      child.visit(this);
    }
  }

  visitNoOp() {
    return;
  }

  visitAssign(node) {
    const varName = node.left.value;
    const value = node.right.visit(this);

    this.GLOBAL_SCOPE[varName] = value;
  }

  visitVar(node) {
    const varName = node.value;
    const val = this.GLOBAL_SCOPE[varName];

    if (val === undefined) {
      throw "[ " + varName + " ]" + " not found in GLOBAL_SCOPE";
    }

    return val;
  }

  visitForProgramm(node) {
    return node.block.visit(this);
  }

  visitForBlock(node) {
    for (let declaration of node.declarations)  {
      declaration.visit(this);
    }

    node.compoundStatement.visit(this);
  }

  visitForValDecl(node) {
    return;
  }

  visitForType(node) {
    return;
  }
}
