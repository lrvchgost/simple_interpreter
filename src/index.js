import { Interpreter } from "./interpreter.js";
import { Lexer } from "./lexer.js";
import { BaseTranslator } from "./base-translator.js";
import { SemanticAnalizer } from "./SemanticAnalizer.js";
// import { ActivationRecord } from "./ActivationRecord.js";
// import { CallStack } from "./CallStack.js";
// import { Src2srcTranslator } from './scr2src-translator.js';
import fs from "fs";
import { Parser } from "./parser.js";

const prog = fs.readFileSync("./source/part19.pas", "utf-8").toString();

console.log(prog);

const lexer = new Lexer(prog);
// while (lexer.currentChar !== null) {
//   console.log(lexer.getNextToken());
// }
const parser = new Parser(lexer);
// console.log(JSON.stringify(parser.parse(), null, 2));
const semanticAnalizer = new SemanticAnalizer();
// const src2srcTranslator = new Src2srcTranslator();
const translator = new BaseTranslator();
const interpreter = new Interpreter(parser, semanticAnalizer, translator);
const result = interpreter.interpret();

process.stdout.write(result + "\n");

// fs.writeFileSync('./test.pas', result);

// console.log("memory", interpreter.translator.callStack.toString());
// console.log("SymbolTable", interpreter.semanticAnalizer.toString());

// 7 + 3 * 4

// const seven = new NumNode(new Token(INTEGER, 7));
// const three = new NumNode(new Token(INTEGER, 3));
// const four = new NumNode(new Token(INTEGER, 4));
// const mul = new BinOpNode(three, new Token(MUL, '*'), four);
// const add = new BinOpNode(seven, new Token(PLUS, '+'), mul);
//
// console.log(add);

// const ar1 = ActivationRecord.create("main", "program", 1);
// const ar2 = ActivationRecord.create("decl", "program", 2);
// const ar1 = new ActivationRecord("main", "program", 1);
// const ar2 = new ActivationRecord("decl", "program", 2);
// const cs = new CallStack();
//
// cs.push(ar1);
// cs.push(ar2);
//
// ar1['y'] = 1;
// ar1['x'] = 2;
//
// ar1.x
//
// console.log(cs.toString());
