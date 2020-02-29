// tsc  IndexableReduce.ts --lib es2018,dom
/** @docalias 'float32'|'int32'|'bool'|'complex64'|'string' */
export type DataType = 'number'|'string';
/** Properties of a NodeDef. */
export declare interface INodeDef {
  /** NodeDef name */
  name?: (string|null);
  /** NodeDef op */
  op?: (string|null);
  /** NodeDef input */
  input?: (string[]|null);
}

export declare interface Node {
  signatureKey?: string;
  name: string;
  op: string;
}
/** Properties of a GraphDef. */
export declare interface IGraphDef {
  /** GraphDef node */
  node?: (INodeDef[]|null);
}

const graphDef: IGraphDef = {
  node: [
    {name: 'input', op: 'Placeholder'},
    {name: 'intermediate', op: 'Add', input: ['input', 'input']},
    {name: 'output', op: 'Square', input: ['intermediate']},
    {name: 'input2', op: 'Const'},
    {name: 'output2', op: 'Sqrt', input: ['input2']}
  ],
};

const tfNodes = graphDef.node;
const placeholders: Node[] = [];
const weights: Node[] = [];
// Use reduce instead of foreach:
// https://medium.com/front-end-weekly/stop-array-foreach-and-start-using-filter-map-some-reduce-functions-298b4dabfa09
// node is of type INodeDef.
const nodes = tfNodes.reduce<{[key: string]: Node}>((map, node) => {
  console.log('map:' + map + ', node:' + node.name);
  map[node.name] = mapNode(node);
  if (node.op.startsWith('Placeholder')) {
    placeholders.push(map[node.name]);
  }
  if (node.op === 'Const') {
    weights.push(map[node.name]);
  }
  return map;
}, {});

function mapNode(node: INodeDef): Node {
  const newNode: Node = {
    name: node.name + '**',
    op: node.op + '__',
  };
  return newNode;
}

console.log('nodes:');
console.log(nodes);
console.log('weights:');
console.log(weights);
console.log('placeholders:');
console.log(placeholders);
/*
map:[object Object], node:input
map:[object Object], node:intermediate
map:[object Object], node:output
map:[object Object], node:input2
map:[object Object], node:output2
nodes:
{
  input: { name: 'input**', op: 'Placeholder__' },
  intermediate: { name: 'intermediate**', op: 'Add__' },
  output: { name: 'output**', op: 'Square__' },
  input2: { name: 'input2**', op: 'Const__' },
  output2: { name: 'output2**', op: 'Sqrt__' }
}
weights:
[ { name: 'input2**', op: 'Const__' } ]
placeholders:
[ { name: 'input**', op: 'Placeholder__' } ]
*/