import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  ControlButton,
  DefaultEdgeOptions,
  Panel,
  useReactFlow,
} from 'reactflow';

import 'reactflow/dist/style.css';
import { MecchiNodeStore, useMecchiNodeStore } from '../stores/node-store';
import { shallow } from 'zustand/shallow';
import MecchiPalette from './palette';
import { BsToggles, BsUpload } from "react-icons/bs";
import { FaRegSave } from "react-icons/fa";
import { LuHardDriveUpload } from "react-icons/lu";
import { GoCommandPalette } from "react-icons/go";
import { FaWindowRestore } from "react-icons/fa6";
import { BiReset } from "react-icons/bi";

import { useMecchiUIStore } from '../stores/ui-store';

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
import ky from 'ky';
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
  setNodes: store.setNodes,
  setEdges: store.setEdges,
});

interface IProps {
  [k: string]: any
}

export default function MecchiFlow({ nodeTypesKV, nodeTypes }: IProps) {
  const { createNode, nodes, edges, onNodesChange, onEdgesChange, onConnect, setNodes, setEdges } = useMecchiNodeStore(selector, shallow);
  const { paletteVisible, togglePalette, toggleSavedFlows } = useMecchiUIStore();
  const { query } = useKBar();
  const { success, error } = useMecchiUIStore();
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { setViewport } = useReactFlow();

  const onReset = useCallback(() => {
    setNodes([]);

    success('flow cleared');
  }, []);

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

  const fastSaveKey = 'fast_save';

  const onSave = useCallback(async () => {
    if (reactFlowInstance) {
      const flow = (reactFlowInstance as any).toObject();
      const result: any = await ky.post('/mecchi/workflow/save', {
        json: { name: fastSaveKey, flow: JSON.stringify(flow) },
        timeout: false
      }).json();

      success('flow saved');
    }
  }, [reactFlowInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const result: any = await ky.post('/mecchi/workflow/load', {
        json: { name: fastSaveKey },
        timeout: false
      }).json();

      if (result.mecchi == '👍') {
        const flow = JSON.parse(result.flow);

        if (flow) {
          const { x = 0, y = 0, zoom = 1 } = flow.viewport;
          setNodes(flow.nodes || []);
          setEdges(flow.edges || []);
          setViewport({ x, y, zoom });
        }

        success('flow loaded');
      } else {
        error('failed to load flow');
      }
    };

    restoreFlow();
  }, [setNodes, setViewport]);

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
      <Panel position="top-center" style={{ translate: '-1000%' }}>
        <></>
      </Panel>
      <Panel position="top-center">
        <ControlButton onClick={onSave} title="quick save" style={{ float: 'left' }}>
          <div><FaRegSave /></div>
        </ControlButton>
        <ControlButton onClick={onRestore} title="quick load">
          <div><BsUpload /></div>
        </ControlButton>
      </Panel>
      <Panel position="top-center" style={{ translate: '1000%' }}>
        <ControlButton onClick={onReset} title="reset" style={{ float: 'left' }}>
          <div><BiReset /></div>
        </ControlButton>
      </Panel>

      <Controls position='top-right' style={{ boxShadow: 'none', border: '1px solid #eee' }}>
        <Global
          styles={css`
          .react-flow__panel .react-flow__controls-button {
            outline: none;
          }
          .react-flow__panel.react-flow__attribution {
            text-align: center;
            width: 100%;
            background-color: transparent
          }
        `}
        />
        <ControlButton onClick={togglePalette} title="toggle palette and map">
          <div><BiSolidHide /></div>
        </ControlButton>
        <ControlButton onClick={query.toggle} title="command bar">
          <div><GoCommandPalette /></div>
        </ControlButton>
      </Controls>

      <Panel position="bottom-right" style={{ boxShadow: 'none', border: '1px solid #eee' }}>
        <ControlButton onClick={toggleSavedFlows} title="saved workflows">
          <div><FaWindowRestore /></div>
        </ControlButton>
      </Panel>

      {paletteVisible && <MiniMap zoomable pannable position='bottom-left' />}
      <MecchiPalette nodeTypes={nodeTypes} />
      {paletteVisible && <MecchiSavedFlows />}
    </ReactFlow>
  )
}
