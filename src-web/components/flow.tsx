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
import MecchiPalette from './palette';
import { BsToggles } from "react-icons/bs";
import { useMecchiViewStore } from '../stores/view-store';
import React from 'react';

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

interface IProps {
  [k: string]: any
}

export default function MecchiFlow({ nodeTypesKV, nodeTypes }: IProps) {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useMecchiNodeStore(selector, shallow);
  const { togglePalette, success } = useMecchiViewStore();

  return (
    <ReactFlow
      fitView
      fitViewOptions={{ maxZoom: 1 }}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      nodeTypes={nodeTypesKV}
      onEdgesChange={onEdgesChange}
      snapToGrid={true}
      snapGrid={[20, 20]}
      defaultEdgeOptions={defaultEdgeOptions}
      onConnect={onConnect}>
      <Controls>
        <ControlButton onClick={togglePalette} title="toggle palette">
          <div><BsToggles /></div>
        </ControlButton>
      </Controls>
      <MiniMap zoomable pannable />
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      <MecchiPalette nodeTypes={nodeTypes} />
    </ReactFlow>
  )
}
