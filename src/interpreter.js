export class Interpreter {
  constructor(parser, semanticAnalizer, translator) {
    this.parser = parser;
    this.semanticAnalizer = semanticAnalizer;
    this.translator = translator;
  }

  interpret() {
    const ast = this.parser.parse();

    this.staticAnalisys(ast);

    // return this.traslate(ast);
    return ast;
  }

  staticAnalisys(ast) {
    ast.visit(this.semanticAnalizer);
  }

  traslate(ast) {
    const result = ast.visit(this.translator);

    return result;
  }
}
