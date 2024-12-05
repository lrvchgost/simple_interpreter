import { TokenType } from "./helpers.js";
import { CallStack } from "./CallStack.js";
import { ActivationRecord, ARType } from "./ActivationRecord.js";
import { isCallStack } from "./init.js";

function zip(arrays) {
  return arrays[0].map(function (_, i) {
    return arrays.map(function (array) {
      return array[i];
    });
  });
}

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
      throw "[ " + varName + " ]" + " not found in " + ar.name;
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
    const procName = node.procName;

    const ar = new ActivationRecord(procName, ARType.PROCEDURE, 2);

    const symbol = node.procSymbol;
    const formalParametrs = symbol.params;
    const actualParams = node.actualParams;

    for (const [paramSymbol, argumentNode] of zip([
      formalParametrs,
      actualParams,
    ])) {
      ar[paramSymbol.name] = argumentNode.visit(this);
    }

    this.callStack.push(ar);

    this._log('ENTER PROCEDURE ' + procName);
    this._log(String(this.callStack));

    symbol.blockAst.visit(this);

    this._log('LEAVE PROCEDURE ' + procName);
    this._log(String(this.callStack));

    this.callStack.pop();
  }

  _log(message) {
    if (isCallStack) {
      console.log(message);
    }
  }
}
