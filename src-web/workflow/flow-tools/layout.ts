import { Edge, Node } from "reactflow";
import dagre from '@dagrejs/dagre';

const alignToDagre = {
  'horizontal': 'LR',
  'vertical': 'TB'
}

export const getLayoutedElements = (nodes: Node[], edges: Edge[], direction: 'vertical' | 'horizontal' = 'horizontal') => {
  const isHorizontal = direction === 'horizontal';
  const dagreGraph = new dagre.graphlib.Graph();

  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: alignToDagre[direction] });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: node.width!, height: node.height! });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node: Node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    (node as any).targetPosition = isHorizontal ? 'left' : 'top';
    (node as any).sourcePosition = isHorizontal ? 'right' : 'bottom';

    node.position = {
      x: nodeWithPosition.x - node.width! / 2,
      y: nodeWithPosition.y - node.height! / 2,
    };

    return node;
  });

  return { nodes, edges };
};