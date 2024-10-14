import { Lexer, Interpreter } from "./interpreter.js";

const expression = process.argv.slice(2)[0];

console.log("expression", expression);

debugger;

const lexer = new Lexer(expression);
const interpreter = new Interpreter(lexer);
const result = interpreter.expr();

console.log("result", result);

process.stdout.write(result + '\n');
