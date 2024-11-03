import { MINUS, PLUS, MUL, DIV } from "./helpers.js";

export class BaseTranslator {
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

    if (node.op.type === DIV) {
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
}
