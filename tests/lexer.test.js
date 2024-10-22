import { Lexer, INTEGER, PLUS, MUL, DIV, MINUS } from "../interpreter.js";

test("It validate integer", () => {
  expect(new Lexer("1").isInteger()).toBeTruthy();
  expect(new Lexer("-").isInteger()).toBeFalsy();
});

test("It validates space", () => {
  const lexer = new Lexer("1 + 1");
  expect(lexer.isInteger()).toBeTruthy();

  lexer.getNextToken();

  expect(lexer.isSpace()).toBeTruthy();

  lexer.getNextToken();
});

test("It gather integer", () => {
  expect(new Lexer("122-").integer()).toBe(122);
  expect(new Lexer("1-22-").integer()).toBe(1);
  expect(new Lexer("1").integer()).toBe(1);
});

describe('It should walk through "1+22-1*3*5/3"', () => {
  const lexer = new Lexer("1   + 22   -1*3*5/3");

  test('It evals "1"', () => {
    expect(lexer.currentChar).toEqual("1");
    expect(lexer.getNextToken()).toEqual({ value: 1, type: INTEGER });
  });

  test('It evals spaces', () => {
    expect(lexer.currentChar).toEqual(" ");
    expect(lexer.getNextToken()).toEqual({ value: "+", type: PLUS });
  });

  test('It evals "22"', () => {
    expect(lexer.currentChar).toEqual(" ");
    expect(lexer.getNextToken()).toEqual({ value: 22, type: INTEGER });
  });

  test('It evals "-"', () => {
    expect(lexer.currentChar).toEqual(" ");
    expect(lexer.getNextToken()).toEqual({ value: "-", type: MINUS });
  });

  test('It evals "1"', () => {
    expect(lexer.currentChar).toEqual("1");
    expect(lexer.getNextToken()).toEqual({ value: 1, type: INTEGER });
  });

  test('It evals "*"', () => {
    expect(lexer.currentChar).toEqual("*");
    expect(lexer.getNextToken()).toEqual({ value: "*", type: MUL });
  });

  test('It evals "3"', () => {
    expect(lexer.currentChar).toEqual("3");
    expect(lexer.getNextToken()).toEqual({ value: 3, type: INTEGER });
  });

  test('It evals "*"', () => {
    expect(lexer.currentChar).toEqual("*");
    expect(lexer.getNextToken()).toEqual({ value: "*", type: MUL });
  });

  test('It evals "5"', () => {
    expect(lexer.currentChar).toEqual("5");
    expect(lexer.getNextToken()).toEqual({ value: 5, type: INTEGER });
  });

  test('It evals "/"', () => {
    expect(lexer.currentChar).toEqual("/");
    expect(lexer.getNextToken()).toEqual({ value: "/", type: DIV });
  });

  test('It evals "3"', () => {
    expect(lexer.currentChar).toEqual("3");
    expect(lexer.getNextToken()).toEqual({ value: 3, type: INTEGER });
  });
});
