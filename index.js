import { Interpreter } from "./interpreter.js";
import { Lexer } from "./lexer.js";
import { BaseTranslator } from './base-translator.js';
// import { InfixToPostfixTranslator } from './infix-to-postfix-translator';
// import { InfixToLispTranslator } from './infix-to-lisp-tanslator.js';
// import { NumNode, BinOpNode } from "./ast.js";
// import { INTEGER, MUL, PLUS } from "./helpers.js";
import { Parser } from './parser.js';

const expression = process.argv.slice(2)[0];

console.log("expression", expression);

// debugger;

const lexer = new Lexer(expression);
const parser = new Parser(lexer);
const translator = new BaseTranslator();
const interpreter = new Interpreter(parser, translator);
const result = interpreter.interpret();

// console.log('count', interpreter.visitor.count);

process.stdout.write(result + "\n");

// 7 + 3 * 4

// const seven = new NumNode(new Token(INTEGER, 7));
// const three = new NumNode(new Token(INTEGER, 3));
// const four = new NumNode(new Token(INTEGER, 4));
// const mul = new BinOpNode(three, new Token(MUL, '*'), four);
// const add = new BinOpNode(seven, new Token(PLUS, '+'), mul);
//
// console.log(add);

