import { MINUS, PLUS, MUL, DIV } from "./helpers.js";

export class BaseTranslator {
  visitForBinOp(node) {
    if (node.op.type === PLUS) {
      return node.left.visit(this) + node.right.visit(this);
    }

    if (node.op.type === MINUS) {
      return node.left.visit(this) - node.right.visit(this);
    }

    if (node.op.type === MUL) {
      return node.left.visit(this) * node.right.visit(this);
    }

    if (node.op.type === DIV) {
      return node.left.visit(this) / node.right.visit(this);
    }
  }

  visitForNum(node) {
    return node.value;
  }
}
