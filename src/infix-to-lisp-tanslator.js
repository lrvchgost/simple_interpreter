export class InfixToLispTranslator {
  visitForBinOp(node) {
    const left = node.left.visit(this);
    const right = node.right.visit(this);
      return `(${node.op.value} ${left} ${right})`;
  }

  visitForNum(node) {
    return node.value;
  }
}
