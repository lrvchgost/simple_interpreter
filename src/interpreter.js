export class Interpreter {
  constructor(parser, symbolBuilder, translator) {
    this.parser = parser;
    this.symbolBuilder = symbolBuilder;
    this.translator = translator;
  }

  interpret() {
    const ast = this.parser.parse();

    this.staticAnalisys(ast);

    return this.traslate(ast);
  }

  staticAnalisys(ast) {
    ast.visit(this.symbolBuilder);
  }

  traslate(ast) {
    const result = ast.visit(this.translator);

    return result;
  }
}
