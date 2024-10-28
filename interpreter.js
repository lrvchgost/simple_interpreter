import { NodeVisitor } from './visitor.js';

export class Interpreter {
  constructor(parser) {
    this.parser = parser;
    this.visitor = new NodeVisitor();
  }

  interpret() {
    const ast = this.parser.parse();
    return this.visit(ast);
  }

  visit(ast) {
    return ast.visit(this.visitor);
  }
}
