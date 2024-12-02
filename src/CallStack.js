export class CallStack{
  records = [];

  push(record) {
    this.records.push(record);
  }

  pop() {
    return this.records.pop();
  }

  peek() {
    return this.records[this.records.length - 1];
  }

  toString() {
    return `CALL STACK \n${this.records.map(record => record.toString()).join('\n')}\n`;
  }
}
