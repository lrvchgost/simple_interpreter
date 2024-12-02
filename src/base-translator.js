import { TokenType } from "./helpers.js";
import { CallStack } from './CallStack.js';
import { ActivationRecord, ARType } from './ActivationRecord.js';
import { isCallStack } from './init.js';

export class BaseTranslator {
  callStack = new CallStack();

  visitForBinOp(node) {
    const left = node.left.visit(this);
    const right = node.right.visit(this);

    if (node.op.type === TokenType.PLUS) {
      return left + right;
    }

    if (node.op.type === TokenType.MINUS) {
      return left - right;
    }

    if (node.op.type === TokenType.MUL) {
      return left * right;
    }

    if (node.op.type === TokenType.INTEGER_DIV) {
      return Math.trunc(left / right);
    }

    if (node.op.type === TokenType.FLOAT_DIV) {
      return left / right;
    }
  }

  visitForNum(node) {
    return node.value;
  }

  visitForUnaryOp(node) {
    if (node.token.type === TokenType.PLUS) {
      return +node.node.visit(this);
    }

    if (node.token.type === TokenType.MINUS) {
      return -node.node.visit(this);
    }
  }

  visitCompound(node) {
    for (let child of node.children) {
      child.visit(this);
    }
  }

  visitNoOp() {
    return;
  }

  visitAssign(node) {
    const varName = node.left.value;
    const value = node.right.visit(this);

    const ar = this.callStack.peek();
    ar[varName] = value;
  }

  visitVar(node) {
    const varName = node.value;
    const ar = this.callStack.peek();
    const val = ar[varName];

    if (val === undefined) {
      throw "[ " + varName + " ]" + " not found in GLOBAL_SCOPE";
    }

    return val;
  }

  visitForProgramm(node) {
    const progName = node.name;
    this._log(`ENTER: PROGRAM ${progName}`);
    

    const ar = new ActivationRecord(progName, ARType.PROGRAM, 1);

    this.callStack.push(ar);

    const result = node.block.visit(this);

    this._log(`LEAVE: PROGRAM ${progName}`);
    this._log(String(this.callStack));
    this.callStack.pop();

    return result;
  }

  visitForBlock(node) {
    for (let declaration of node.declarations) {
      declaration.visit(this);
    }

    node.compoundStatement.visit(this);
  }

  visitForValDecl(node) {
    return;
  }

  visitForType(node) {
    return;
  }

  visitProcedure(node) {
    return;
  }

  visitProcedureDecl(node) {
    return;
  }

  visitProcCall(node) {
    return;
  }

  _log(message) {
    if (isCallStack) {
      console.log(message);
    }
  }
}
