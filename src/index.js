import { Interpreter } from "./interpreter.js";
import { Lexer } from "./lexer.js";
// import { BaseTranslator } from "./base-translator.js";
import { SemanticAnalizer } from "./SemanticAnalizer.js";
import { Src2srcTranslator } from './scr2src-translator.js';
import fs from "fs";
// import { InfixToPostfixTranslator } from './infix-to-postfix-translator';
// import { InfixToLispTranslator } from './infix-to-lisp-tanslator.js';
// import { NumNode, BinOpNode } from "./ast.js";
// import { INTEGER, MUL, PLUS } from "./helpers.js";
import { Parser } from "./parser.js";

const prog = fs.readFileSync("./source/scope03.pas", "utf-8").toString();

console.log(prog);

const lexer = new Lexer(prog);
const parser = new Parser(lexer);
// console.log(JSON.stringify(parser.parse(), null, 2));
const semanticAnalizer = new SemanticAnalizer();
const src2srcTranslator = new Src2srcTranslator();
// const translator = new BaseTranslator();
const interpreter = new Interpreter(parser, semanticAnalizer, src2srcTranslator);
const result = interpreter.interpret();

process.stdout.write(result + "\n");

fs.writeFileSync('./test.pas', result);

// console.log("GLOBAL_SCOPE", interpreter.translator.GLOBAL_SCOPE);
// console.log("SymbolTable", interpreter.semanticAnalizer.toString());

// 7 + 3 * 4

// const seven = new NumNode(new Token(INTEGER, 7));
// const three = new NumNode(new Token(INTEGER, 3));
// const four = new NumNode(new Token(INTEGER, 4));
// const mul = new BinOpNode(three, new Token(MUL, '*'), four);
// const add = new BinOpNode(seven, new Token(PLUS, '+'), mul);
//
// console.log(add);
