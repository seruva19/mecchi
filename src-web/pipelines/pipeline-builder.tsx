import { Edge, Node } from '@xyflow/react'
import { MecchiEvent, MecchiKV, getMecchiNodes } from '../stores/nodes'

// TODO: current implementation is sequential-only, so even operations that could be run simultaneously
// are executed one after another. This is not optimal, and needs to be rewritten. Also DAG traversal algorithm
// most likely can be improved, I wrote it on my own, and perhaps it is not flawless.
export const runMecchiPipeline = async (ignitionId: string, nodes: Node[], edges: Edge[], flow: any): Promise<Error | undefined> => {
  try {
    const sortedNodes = topologicalSort(nodes.find(n => n.id == ignitionId)!, nodes, edges);
    const pipelineEvent = {
      halt: false
    };

    for await (const sortedNode of sortedNodes) {
      await activate(sortedNode, sortedNodes, flow, pipelineEvent);
    }

    return undefined;
  }

  catch (e: any) {
    return e;
  }
}

class TopoSortedNode {
  node!: Node;
  depends!: Array<Node>;
  processed!: boolean;
  output!: MecchiKV;
}

const topologicalSort = (startNode: Node, nodes: Node[], edges: Edge[]): TopoSortedNode[] => {
  const results: TopoSortedNode[] = [];

  function ignite(id: string, result: TopoSortedNode[], nodes: Node[], edges: Edge[]) {
    const ignitionNode = nodes.find(node => node.id == id)!;
    const ignitedNodes = edges.filter(e => e.source == ignitionNode.id).map(e => e.target).map(id => nodes.find(n => n.id == id)!);

    ignitedNodes.forEach(node => {
      const nodeId = node.id;
      const connections = edges.filter(e => e.target == nodeId);
      const sources = connections.map(connection => nodes.find(n => n.id == connection.source)!);

      result.push({ node, depends: sources, processed: false, output: {} });
      ignite(node.id, result, nodes, edges);
    })
  }

  ignite(startNode.id, results, nodes, edges);

  results.forEach(result => {
    result.depends.forEach(dependency => {
      if (!results.find(r => r.node.id == dependency.id)) {
        results.unshift({ node: dependency, depends: [], processed: false, output: {} });
      }
    });
  });

  return results;
}

const run = async (tsn: TopoSortedNode, nodes: TopoSortedNode[], flow: any, event: MecchiEvent): Promise<void> => {
  if (!tsn.processed) {
    const mecchiNodes = await getMecchiNodes();
    console.info(`activating node '${tsn.node.type}' with id '${tsn.node.id}'`)
    const prototype = mecchiNodes.find(mn => mn.type == tsn.node.type)!;

    flow.set({
      busyNodes: [tsn.node]
    });

    const inputs = Object.assign({}, ...tsn.depends.map(d => nodes.find(tsn => tsn.node.id == d.id)!.output));
    console.info('inputs: ', inputs);

    tsn.output = await prototype.transform(inputs, tsn.node.data, event);
    console.info('output: ', tsn.output);

    flow.set({
      nodes: flow.get().nodes.map((node: Node) =>
        node.id === tsn.node.id
          ? { ...node, data: { ...node.data, ...tsn.output } }
          : node
      )
    });

    tsn.processed = true;

    flow.set({
      busyNodes: []
    });
  }
}

const activate = async (tsn: TopoSortedNode, nodes: TopoSortedNode[], flow: any, event: MecchiEvent): Promise<void> => {
  const dependencies = tsn.depends.map(p => nodes.find(tsn => tsn.node.id == p.id)!).filter(_ => _);
  if (dependencies.length != 0) {
    for await (const dependency of dependencies) {
      if (!event.halt) {
        await activate(dependency, nodes, flow, event);
      }
    }
  }

  if (!event.halt) {
    await run(tsn, nodes, flow, event);
  }
}
