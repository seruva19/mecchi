import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  ControlButton,
  DefaultEdgeOptions,
} from 'reactflow';

import 'reactflow/dist/style.css';
import { MecchiNodeStore, useMecchiNodeStore } from '../stores/node-store';
import { shallow } from 'zustand/shallow';
import { mecchiNodes } from '../stores/nodes';
import MecchiPalette from './palette';
import { BsToggles } from "react-icons/bs";
import { useMecchiViewStore } from '../stores/view-store';
const nodeTypes: { [key: string]: any } = {};

mecchiNodes.forEach(node => {
  nodeTypes[node.type] = node.view;
});

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: false,
  deletable: true
};

const selector = (state: MecchiNodeStore) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export default function MecchiFlow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useMecchiNodeStore(selector, shallow);
  const { togglePalette, success } = useMecchiViewStore();

  return (
    <ReactFlow
      fitView
      fitViewOptions={{ maxZoom: 1 }}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      nodeTypes={nodeTypes}
      onEdgesChange={onEdgesChange}
      snapToGrid={true}
      snapGrid={[20, 20]}
      defaultEdgeOptions={defaultEdgeOptions}
      onConnect={onConnect}>
      <Controls>
        <ControlButton onClick={() => success('Some success message')} title="toggle palette">
          <div><BsToggles /></div>
        </ControlButton>
      </Controls>
      <MiniMap zoomable pannable />
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      <MecchiPalette />
    </ReactFlow>
  )
}
