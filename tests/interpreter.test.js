import { Interpreter } from '../interpreter.js';
import { Lexer } from '../lexer.js';

test('It should eval 1 + 1', () => {
  const lexer = new Lexer('2 * 2 + 1');
  const interpreter = new Interpreter(lexer);

  const result = interpreter.expr();

  expect(result).toEqual(5);
});

test('It should eval 1 + 2 - 1 * 5', () => {
  const lexer = new Lexer('1 * 5 + 2 - 1 * 5');
  const interpreter = new Interpreter(lexer);

  const result = interpreter.expr();

  expect(result).toEqual(2);
});
