import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  ControlButton,
  DefaultEdgeOptions,
  Panel,
  useReactFlow,
  Connection,
} from 'reactflow';
import { CiSettings } from "react-icons/ci";

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
import { IoSettings } from "react-icons/io5";
import { Tooltip } from 'react-tooltip';
import CustomEdge from './edge';
import { useKBar } from 'kbar';
import { useCallback, useRef, useState } from 'react';
import { BiSolidHide } from "react-icons/bi";
import { GrBladesHorizontal, GrBladesVertical } from "react-icons/gr";
import MecchiSavedFlows from './support/saved-flows';
import { Global, css } from '@emotion/react';
import ky from 'ky';
import { getLayoutedElements } from './flow-tools/layout';
import { handleDragOver, handleDrop, handleOnReset, handleRestore, handleSave } from './flow-tools/interaction';

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
  handles: store.handles,
  setHandles: store.setHandles,
});

interface IProps {
  [k: string]: any
}

export default function MecchiFlow({ nodeTypesKV, nodeTypes }: IProps) {
  const { createNode, nodes, edges, onNodesChange, onEdgesChange, onConnect, setNodes, setEdges, handles, setHandles } = useMecchiNodeStore(selector, shallow);
  const { paletteVisible, togglePalette, toggleSavedFlows, savedFlowsVisible, showSettings } = useMecchiUIStore();
  const { query } = useKBar();
  const { success, error } = useMecchiUIStore();
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { setViewport, getEdges, getNodes } = useReactFlow();

  const onReset = useCallback(() => {
    handleOnReset(setNodes, success);
  }, []);

  const onDragOver = useCallback((event: any) => {
    handleDragOver(event);
  }, []);

  const onDrop = useCallback((event: any) => {
    handleDrop(event, reactFlowInstance, createNode);
  }, [reactFlowInstance]);

  const onSave = async () => {
    handleSave(reactFlowInstance, handles, success);
  };

  const onRestore = async () => {
    handleRestore(setNodes, setEdges, setHandles, setViewport, success, error);
  };

  const onLayout = useCallback(
    (direction: 'vertical' | 'horizontal') => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodes,
        edges,
        direction
      );

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges]
  );

  const isValidConnection = useCallback((connection: Connection) => {
    // console.log(connection);
    // console.log(getNodes());
    const source = connection.source;
    const target = connection.target;

    return true;
  }, []);

  return (
    <>
      <Tooltip id="flow-tooltip" />
      <ReactFlow
        onInit={setReactFlowInstance as any}
        onEdgeContextMenu={undefined}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        fitViewOptions={{ maxZoom: 1 }}
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        onDrop={onDrop}
        zoomOnDoubleClick={false}
        onEdgeClick={undefined}
        onDragOver={onDragOver}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypesKV}
        isValidConnection={isValidConnection}
        onEdgesChange={onEdgesChange}
        snapToGrid={true}
        snapGrid={[20, 20]}
        defaultEdgeOptions={defaultEdgeOptions}
        onConnect={onConnect}>
        <Panel position="top-center" style={{ translate: '-1000%' }}>
          <></>
        </Panel>
        <Panel position="top-center">
          <ControlButton onClick={onSave} title="quick save" data-tooltip-id="flow-tooltip" data-tooltip-content="quick save" style={{ float: 'left' }}>
            <div><FaRegSave /></div>
          </ControlButton>
          <ControlButton onClick={onRestore} title="quick load" data-tooltip-id="flow-tooltip" data-tooltip-content="quick load" style={{ marginLeft: 180 }}>
            <div><BsUpload /></div>
          </ControlButton>
        </Panel>
        <Panel position="top-center" style={{}}>
          <ControlButton onClick={onReset} title="reset" style={{ float: 'left' }} data-tooltip-id="flow-tooltip" data-tooltip-content="reset">
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
            background-color: transparent;
          }
        `}
          />
          <ControlButton onClick={togglePalette} title="toggle palette and map" data-tooltip-id="flow-tooltip" data-tooltip-content="toggle palette and map">
            <div><BiSolidHide /></div>
          </ControlButton>

          <ControlButton onClick={() => onLayout('horizontal')} title="align horizontally">
            <div><GrBladesHorizontal /></div>
          </ControlButton>
          <ControlButton onClick={() => onLayout('vertical')} title="align vertically">
            <div><GrBladesVertical /></div>
          </ControlButton>

          <ControlButton onClick={query.toggle} title="command bar">
            <div><GoCommandPalette /></div>
          </ControlButton>
          <ControlButton onClick={() => showSettings(true)} title="settings">
            <div><IoSettings /></div>
          </ControlButton>
        </Controls>

        <Panel position="top-right" style={{ boxShadow: 'none', border: '1px solid #eee', borderBottom: '1px solid transparent' }}>
          <ControlButton onClick={toggleSavedFlows} style={{
            color: savedFlowsVisible ? 'white' : 'initial',
            backgroundColor: savedFlowsVisible ? 'rgba(59,130,246)' : 'initial'
          }} title="saved workflows">
            <div><FaWindowRestore /></div>
          </ControlButton>
        </Panel>

        {paletteVisible && <MiniMap zoomable pannable position='bottom-left' />}
        <MecchiPalette nodeTypes={nodeTypes} />
        {paletteVisible && <MecchiSavedFlows />}
      </ReactFlow></>
  )
}
