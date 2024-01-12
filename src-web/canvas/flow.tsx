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
import { FaRegSave } from "react-icons/fa";
import { LuHardDriveUpload } from "react-icons/lu";
import { GoCommandPalette } from "react-icons/go";

import { useMecchiViewStore } from '../stores/view-store';

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: false,
  deletable: true,
  type: 'customEdge',
};

import CustomEdge from './edge';
import { useKBar } from 'kbar';
import { useCallback, useRef, useState } from 'react';
import { BiSolidHide } from "react-icons/bi";

import MecchiSavedFlows from './saved-flows';
import { Global, css } from '@emotion/react';
const edgeTypes = {
  customEdge: CustomEdge,
};

const selector = (store: MecchiNodeStore) => ({
  nodes: store.nodes,
  edges: store.edges,
  onNodesChange: store.onNodesChange,
  onEdgesChange: store.onEdgesChange,
  onConnect: store.onConnect,
  createNode: store.createNode,
});

interface IProps {
  [k: string]: any
}

export default function MecchiFlow({ nodeTypesKV, nodeTypes }: IProps) {
  const { createNode, nodes, edges, onNodesChange, onEdgesChange, onConnect } = useMecchiNodeStore(selector, shallow);
  const { paletteVisible, togglePalette, toggleSavedFlows } = useMecchiViewStore();
  const { query } = useKBar();

  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData('application/reactflow');

      if (typeof nodeType === 'undefined' || !nodeType) {
        return;
      }

      const position = (reactFlowInstance as any).project({
        x: event.clientX,
        y: event.clientY
      });

      createNode(nodeType, position);
    }, [reactFlowInstance],
  );

  return (
    <ReactFlow
      onInit={setReactFlowInstance as any}
      onEdgeContextMenu={undefined}
      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      fitViewOptions={{ maxZoom: 1 }}
      nodes={nodes}
      edges={edges}
      edgeTypes={edgeTypes}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onNodesChange={onNodesChange}
      nodeTypes={nodeTypesKV}
      onEdgesChange={onEdgesChange}
      snapToGrid={true}
      snapGrid={[20, 20]}
      defaultEdgeOptions={defaultEdgeOptions}
      onConnect={onConnect}>
      <Controls position='top-right' style={{ boxShadow: 'none', border: '1px solid #eee' }}>
        <Global
          styles={css`
          .react-flow__panel .react-flow__controls-button {
              outline: none;
            }
        `}
        />
        <ControlButton onClick={togglePalette} title="toggle palette and map">
          <div><BiSolidHide /></div>
        </ControlButton>
        <ControlButton onClick={query.toggle} title="command bar">
          <div><GoCommandPalette /></div>
        </ControlButton>
        <ControlButton onClick={toggleSavedFlows} title="saved workflows">
          <div><FaRegSave /></div>
        </ControlButton>
      </Controls>
      {paletteVisible && <MiniMap zoomable pannable position='bottom-left' />}
      <MecchiPalette nodeTypes={nodeTypes} />
      <MecchiSavedFlows />
    </ReactFlow>
  )
}
