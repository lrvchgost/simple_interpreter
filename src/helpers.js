import { Token } from "./token.js";

export const ReservedKeyWords = {
  PROGRAM: "PROGRAM",
  INTEGER: "INTEGER",
  REAL: "REAL",
  DIV: "INTEGER_DIV",
  VAR: "VAR",
  PROCEDURE: "PROCEDURE",
  BEGIN: "BEGIN",
  END: "END",
};

export const SingleCharType = {
  MINUS: "MINUS",
  PLUS: "PLUS",
  MUL: "MUL",
  SPACE: "SPACE",
  LPAREN: "LPAREN",
  RPAREN: "RPAREN",
  DOT: "DOT",
  SEMI: "SEMI",
  COLON: "COLON",
  COMMA: "COMMA",
  FLOAT_DIV: "FLOAT_DIV",
};

export const SingleChar = {
  [SingleCharType.MINUS]: "-",
  [SingleCharType.PLUS]: "+",
  [SingleCharType.MUL]: "*",
  [SingleCharType.SPACE]: " ",
  [SingleCharType.LPAREN]: "(",
  [SingleCharType.RPAREN]: ")",
  [SingleCharType.DOT]: ".",
  [SingleCharType.SEMI]: ";",
  [SingleCharType.COLON]: ":",
  [SingleCharType.COMMA]: ",",
  [SingleCharType.FLOAT_DIV]: "/",
};

export const SingleCharByValue = Object.entries(SingleChar).reduce(
  (acc, [key, value]) => {
    return {
      ...acc,
      [value]: key,
    };
  },
  {}
);

export const TokenType = {
  ID: "ID",
  INTEGER_CONST: "INTEGER_CONST",
  REAL_CONST: "REAL_CONST",
  ASSIGN: "ASSIGN",
  EOF: "EOF",
  ...SingleCharType,
  ...ReservedKeyWords,
};

const buildReservedKeywords = () => {
  return Object.entries(ReservedKeyWords).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: new Token(key, value),
    };
  }, {});
};

export const RESERVED_KEYWORDS = buildReservedKeywords();
