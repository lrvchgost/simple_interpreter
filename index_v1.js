const INTEGER = "INTEGER";
const PLUS = "PLUS";
const MINUS = "MINUS";
const EOF = "EOF";
const SPACE = "SPACE";

class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }

  toString() {
    // [Symbol.toPrimitive]() {
    return `Token(${this.type}, ${this.value})`;
  }
}

class Interpreter {
  constructor(text) {
    this.text = text;
    this.pos = 0;
    this.currentToken = null;
  }

  error(source) {
    throw new Error("Error parsing input:" + source);
  }

  getNextToken() {
    // Tokenizer
    const text = this.text;

    if (this.pos > text.length - 1) {
      return new Token(EOF, null);
    }

    const currentChar = text[this.pos];

    if (this.isInteger(currentChar)) {
      const token = new Token(INTEGER, Number(currentChar));
      this.pos++;
      return token;
    }

    if (currentChar === "+") {
      const token = new Token(PLUS, currentChar);
      this.pos++;
      return token;
    }

    if (currentChar === "-") {
      const token = new Token(MINUS, currentChar);
      this.pos++;
      return token;
    }

    if (currentChar === " ") {
      const token = new Token(SPACE, currentChar);
      this.pos++;
      return token;
    }

    this.error("getNextToken");
  }

  eat(tokenType) {
    if (this.currentToken.type === tokenType) {
      this.currentToken = this.getNextToken();
    } else {
      this.error("eat");
    }
  }

  isInteger(char) {
    return Number.isInteger(parseInt(char));
  }

  isSpace(char) {
    return char === " ";
  }

  getWholeInteger() {
    let integer = '';

    while (this.isInteger(this.currentToken.value)) {
      integer += this.currentToken.value.toString();

      this.eat(INTEGER);
    }

    return new Token(INTEGER, Number(integer));
  }

  walkSpaces() {
    while (this.isSpace(this.currentToken.value)) {
      this.eat(SPACE);
    }
  }

  expr() {
    this.currentToken = this.getNextToken();

    const left = this.getWholeInteger();

    this.walkSpaces();

    const op = this.currentToken;

    if (op.value === "+") {
      this.eat(PLUS);
    }

    if (op.value === "-") {
      this.eat(MINUS);
    }

    this.walkSpaces();

    const right = this.getWholeInteger();

    if (op.value === "+") {
      return left.value + right.value;
    }

    if (op.value === "-") {
      return left.value - right.value;
    }

    this.error("expr");
  }
}

const expression = process.argv.slice(2)[0];

console.log("expression", expression);
debugger;

const interpreter = new Interpreter(expression);
// console.log(interpreter.getNextToken())
// console.log(interpreter.getNextToken())
// console.log(interpreter.getNextToken())
// console.log(interpreter.getNextToken())
// console.log(interpreter.getNextToken())
// console.log(interpreter.getNextToken())
const result = interpreter.expr();

console.log("result", result);

// process.stdout.write(result + '\n');
