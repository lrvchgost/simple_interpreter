class Wrapper {
  path = [];

  constructor(elem) {
    this.elem = elem;
  }

  getElement() {
    return this.elem;
  }

  push(...path) {
    this.path.push(...path);
  }

  getPath() {
    return this.path;
  }
  getPathString() {
    return this.path.join('-');
  }
}

const search = (graph, id) => {
  if (graph.id === id) {
    return graph.id;
  }

  const queue = [];

  graph.children.forEach((elem, index) => {
    const child = new Wrapper(elem);
    child.push(index);
    queue.push(child);
  });

  while (queue.length) {
    const elem = queue.shift();

    console.log('elem', elem)

    if (elem.getElement().id === id) {
      return elem;
    }

    elem.getElement().children.forEach((childElem, index) => {
      const child = new Wrapper(childElem);
      child.push(...[...elem.getPath(), index]);

      queue.push(child);
    });
  }
};

const graph = {
  id: 1,
  children: [
    {
      id: 2,
      children: [],
    },
    {
      id: 3,
      children: [
        {
          id: 4,
          children: [],
        },
      ],
    },
  ],
};

console.log(search(graph, 4).getPathString());
