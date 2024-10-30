export class InfixToPostfixTranslator {
  visitForBinOp(node) {
    const left = node.left.visit(this);
    const right = node.right.visit(this);
      return `${left} ${right} ${node.op.value}`;
  }

  visitForNum(node) {
    return node.value;
  }
}
