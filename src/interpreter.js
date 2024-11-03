export class Interpreter {
  constructor(parser, visitor) {
    this.parser = parser;
    this.visitor = visitor;
  }

  interpret() {
    const ast = this.parser.parse();
    console.log(ast)
    return this.visit(ast);
  }

  visit(ast) {
    const result =  ast.visit(this.visitor);

    return result;
  }
}
