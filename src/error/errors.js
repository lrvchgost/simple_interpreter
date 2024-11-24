export class Error {
  constructor(errorCode, token, message) {
    this.errorCode = errorCode;
    this.token = token;
    this.message = message;
  }
}

export class LexerError extends Error {
  constructor(...args) {
    super(...args);
  }
}

export class ParserError extends Error {
  constructor(...args) {
    super(...args);
  }
}

export class SemanticError extends Error {
  constructor(...args) {
    super(...args);
  }
}
