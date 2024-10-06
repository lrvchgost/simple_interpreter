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

class Interpreter {
  constructor(text) {
    this.text = text;
    this.pos = 0;
    this.currentToken = null;
    this.currentChar = text[this.pos];
    this.sequence = text.split(/\d/).filter((v) => v.trim()).length;
  }

  error(source) {
    throw new Error("Error parsing input:" + source);
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

  expr() {
    this.currentToken = this.getNextToken();

    let result = this.currentToken.value;

    this.eat(INTEGER);

    return Array.from({ length: this.sequence }).reduce((acc) => {
      const op = this.currentToken;

      this.eat(op.type);

      const operand = this.currentToken.value;

      this.eat(INTEGER);

      if (op.type === PLUS) {
        return sum(acc, operand);
      }

      if (op.type === MINUS) {
        return sub(acc, operand);
      }

      if (op.type === MUL) {
        return mul(acc, operand);
      }

      if (op.type === DIV) {
        return div(acc, operand);
      }

      return acc;
    }, result);
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
