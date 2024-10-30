export class Interpreter {
  constructor(parser, visitor) {
    this.parser = parser;
    this.visitor = visitor;
  }

  interpret() {
    const ast = this.parser.parse();
    return this.visit(ast);
  }

  visit(ast) {
    return ast.visit(this.visitor);
  }
}
