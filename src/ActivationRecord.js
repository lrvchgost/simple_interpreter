export const ARType = {
  PROGRAM: "PROGRAM",
  PROCEDURE: "PROCEDURE",
};

export class ActivationRecord {
  constructor(name, type, nestingLevel) {
    this.name = name;
    this.nestingLevel = nestingLevel;
    this.type = type;
    this.members = new Map();

    return new Proxy(this, {
      set(target, prop, val) {
        target.members.set(prop, val);

        return true;
      },
      get(...rest) {
        const [target, prop] = rest;
        const value = Reflect.get(...rest);
        return typeof value == "function"
          ? value.bind(target)
          : target.members.get(prop);
      },
    });
  }

  getItem(key) {
    return this.members.get(key);
  }

  toString() {
    const lines = [`{${this.nestingLevel}}: {${this.type}} {${this.name}}`];

    for (const [key, value] of this.members.entries()) {
      lines.push(`{${key}} {${value}}`);
    }

    return lines.join("\n");
  }
}
