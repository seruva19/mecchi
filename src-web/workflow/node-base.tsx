import { ReactNode, useEffect, useState } from "react";
import { tw } from 'twind';
import { MecchiNodeStore, useMecchiNodeStore } from "../stores/node-store";
import { shallow } from "zustand/shallow";
import { CSSProperties } from "react";
import { ScaleLoader } from "react-spinners";
import { Global, css } from "@emotion/react";
import { Item, Menu, Separator, Submenu, useContextMenu } from "react-contexify";
import { createPortal } from "react-dom";
import { useReactFlow } from "reactflow";
import { getRectOfNodes } from 'reactflow';
import { useArrayChange } from "./hooks";
import { Tooltip } from "react-tooltip";
import { tooltipStyles } from "../styles";

const selector = (store: MecchiNodeStore) => ({
  busyNodes: store.busyNodes,
  nodes: store.nodes,
  setNodes: store.setNodes,
  edges: store.edges,
  setEdges: store.setEdges,
  ignite: (position: { x: number, y: number }) => store.createNode('environment', position)
});

const override: CSSProperties = {
  position: 'absolute',
  right: '0',
  margin: '4px 10px 0 0'
};

export default function MecchiNode({ title, id, children }: { title: string, id: string, children: ReactNode }) {
  const { busyNodes, ignite, nodes, setNodes, edges, setEdges } = useMecchiNodeStore(selector, shallow);

  const [isSelected, setIsSelected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const trigger = useArrayChange(busyNodes);

  useEffect(() => {
    const node = busyNodes.find((nodes) => nodes.id == id)!;
    setIsLoading(!!node);
  }, [busyNodes, trigger]);

  const MENU_ID = `menu-node${id}`;
  const { show, hideAll } = useContextMenu({
    id: MENU_ID
  });

  function displayMenu(e: any) {
    show({
      event: e
    });
  }

  const removeNode = () => {
    setNodes(nodes.filter((nodes) => nodes.id !== id));
  };

  const igniteNode = () => {
    const ignitedNode = nodes.find((nodes) => nodes.id == id)!;
    const rect = getRectOfNodes([ignitedNode]);

    ignite({ x: rect.x + rect.width, y: rect.y + rect.height });
  };

  return (
    <>
      <Tooltip id="node-tooltip" style={tooltipStyles as any} />
      <Global
        styles={css`
        .contexify {
          font-size: 12px;
          line-height: 12px;
        }
              
        .selected-node::before {
          content: 'selected';
          position: absolute;
          margin-top: -15px;
          font-size: 10px;
        }

        .selected-node .node-title {
          background-color: aliceblue;
        }`}
      />
      <div className={`${tw('rounded-md bg-white shadow-xl')} ${isSelected ? 'selected-node' : ''} ${isMuted ? 'muted-node' : ''}`} style={{
        minWidth: 200,
        opacity: isMuted ? '0.3' : 'initial '
      }} onDoubleClick={displayMenu}>
        <ScaleLoader loading={isLoading} color={'dodgerblue'} height={10} cssOverride={override} />
        {createPortal(<>
          <Menu id={MENU_ID} animation='flip' >
            <Item onClick={() => setIsSelected(!isSelected)}>
              {isSelected ? 'unselect' : 'select'}
            </Item>
            <Separator />
            <Item onClick={igniteNode}>ignite</Item>
            <Item onClick={removeNode}>
              remove
            </Item>
          </Menu>
        </>, document.body)}

        <div style={{
          display: isLoading ? 'none' : 'initial'
        }}>
          <button data-tooltip-id="node-tooltip" data-tooltip-content="node settings" onClick={displayMenu} css={css`
            outline: none !important;
            position: absolute;
            right: 35px;
            top: 2px;
        `}>🎚️</button>

          {/* <button data-tooltip-id="node-tooltip" data-tooltip-content={isSelected ? "unselect node" : "select node"} onClick={() => setIsSelected(!isSelected)} css={css`
            outline: none !important;
            position: absolute;
            right: 5px;
            top: 2px;
        `}>{isSelected ? '✅' : '⬜'}</button> */}

          <button data-tooltip-id="node-tooltip" data-tooltip-content={isMuted ? "unmute node" : "mute node"} onClick={() => setIsMuted(!isMuted)} css={css`
            outline: none !important;
            position: absolute;
            right: 5px;
            top: 2px;
          `}><span>{isMuted ? '🔇' : '🔉'}</span></button>
        </div>
        <p className={`${tw('rounded-t-md px-2 py-1 bg-gray-100 text-sm')} node-title`} css={css`
            &:hover { cursor: move;}
        `}>{title}</p>

        <div className={`${tw`flex flex-col space-y-2 pb-2 pt-10`}`}>
          {children}
        </div>
      </div>
    </>
  );
};