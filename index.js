const INTEGER = "INTEGER";
const PLUS = "PLUS";
const MINUS = "MINUS";
const MUL = "MUL";
const DIV = "DIV";
const EOF = "EOF";
const SPACE = "SPACE";

const sum = (a, b) => {
  return a + b;
};

const sub = (a, b) => {
  return a - b;
};

const mul = (a, b) => {
  return a * b;
};

const div = (a, b) => {
  return a / b;
};

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

class Lexer {
  constructor(text) {
    this.text = text;
    this.pos = 0;
    this.currentChar = text[this.pos];
  }

  error(source) {
    throw new Error("Error parsing input:" + source);
  }

  isInteger(char) {
    return Number.isInteger(parseInt(char));
  }

  isSpace(char) {
    return char === " ";
  }

  advance() {
    this.pos += 1;

    if (this.pos > this.text.length - 1) {
      this.currentChar = null;
    } else {
      this.currentChar = this.text[this.pos];
    }
  }

  skipWhiteSpaces() {
    while (!this.isEOF() && this.isSpace(this.currentChar)) {
      this.advance();
    }
  }

  integer() {
    let result = "";

    while (!this.isEOF() && this.isInteger(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }

    return Number(result);
  }

  isEOF() {
    return this.currentChar === null;
  }

  // Tokenizer
  getNextToken() {
    while (!this.isEOF()) {
      let currentChar = this.currentChar;

      if (this.isSpace(currentChar)) {
        this.skipWhiteSpaces();
        continue;
      }

      if (this.isInteger(currentChar)) {
        return new Token(INTEGER, this.integer());
      }

      if (currentChar === "+") {
        this.advance();
        return new Token(PLUS, currentChar);
      }

      if (currentChar === "-") {
        this.advance();
        return new Token(MINUS, currentChar);
      }

      if (currentChar === "*") {
        this.advance();
        return new Token(MUL, currentChar);
      }

      if (currentChar === "/") {
        this.advance();
        return new Token(DIV, currentChar);
      }

      this.error("getNextToken");
    }

    return new Token(EOF, null);
  }
}

class Interpreter {
  constructor(lexer) {
    this.lexer = lexer;
    this.currentToken = this.lexer.getNextToken();
  }


  eat(tokenType) {
    if (this.currentToken.type === tokenType) {
      this.currentToken = this.lexer.getNextToken();
    } else {
      this.error("eat");
    }
  }

  error(source) {
    throw new Error("Invalid syntax:" + source);
  }

  isEOF() {
    return this.currentToken.type === EOF;
  }

  factor() {
    const value = this.currentToken.value;

    this.eat(INTEGER);

    return value;
  }

  expr() {
    let result = this.factor();

    while (!this.isEOF()) {
      const op = this.currentToken;

      this.eat(op.type);

      const value = this.factor();

      if (op.type === PLUS) {
        result = sum(result, value);
      }

      if (op.type === MINUS) {
        result = sub(result, value);
      }

      if (op.type === MUL) {
        result = mul(result, value);
      }

      if (op.type === DIV) {
        result = div(result, value);
      }
    }

    return result
  }
}

const expression = process.argv.slice(2)[0];

console.log("expression", expression);
debugger;

const lexer = new Lexer(expression);
const interpreter = new Interpreter(lexer);
// console.log(interpreter.getNextToken())
// console.log(interpreter.getNextToken())
// console.log(interpreter.getNextToken())
// console.log(interpreter.getNextToken())
// console.log(interpreter.getNextToken())
// console.log(interpreter.getNextToken())
const result = interpreter.expr();

console.log("result", result);

// process.stdout.write(result + '\n');
