import { Interpreter } from "./interpreter.js";
import { Lexer } from "./lexer.js";
import { BaseTranslator } from "./base-translator.js";
import { SymbolTableBuilder } from "./SymbolTableBuilder.js";
import fs from "fs";
// import { InfixToPostfixTranslator } from './infix-to-postfix-translator';
// import { InfixToLispTranslator } from './infix-to-lisp-tanslator.js';
// import { NumNode, BinOpNode } from "./ast.js";
// import { INTEGER, MUL, PLUS } from "./helpers.js";
import { Parser } from "./parser.js";

const prog = fs.readFileSync("./source/Part12.pas", "utf-8").toString();

console.log(prog);

const lexer = new Lexer(prog);
const parser = new Parser(lexer);
// console.log(JSON.stringify(parser.parse(), null, 2));
const symbolBuilder = new SymbolTableBuilder();
const translator = new BaseTranslator();
const interpreter = new Interpreter(parser, symbolBuilder, translator);
const result = interpreter.interpret();

process.stdout.write(result + "\n");

console.log("GLOBAL_SCOPE", interpreter.translator.GLOBAL_SCOPE);
console.log("SymbolTable", interpreter.symbolBuilder.toString());

// 7 + 3 * 4

// const seven = new NumNode(new Token(INTEGER, 7));
// const three = new NumNode(new Token(INTEGER, 3));
// const four = new NumNode(new Token(INTEGER, 4));
// const mul = new BinOpNode(three, new Token(MUL, '*'), four);
// const add = new BinOpNode(seven, new Token(PLUS, '+'), mul);
//
// console.log(add);
