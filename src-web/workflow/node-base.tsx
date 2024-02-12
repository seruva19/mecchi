import { ReactNode } from "react";
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
  margin: '4px 40px 0 0'
};

export default function MecchiNode({ title, id, children }: { title: string, id: string, children: ReactNode }) {
  const { busyNodes, ignite, nodes, setNodes, edges, setEdges } = useMecchiNodeStore(selector, shallow);

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

    console.log(nodes, edges)
    ignite({ x: rect.x + rect.width, y: rect.y + rect.height });
  };

  return (
    <>
      <Global
        styles={css`
        .contexify {
          font-size: 12px;
          line-height: 12px;
        `}
      />
      <div className={tw('rounded-md bg-white shadow-xl')} style={{ minWidth: 200 }}>
        <ScaleLoader loading={!!busyNodes.find(node => node.id == id)} color={'dodgerblue'} height={10} cssOverride={override} />
        {createPortal(<>
          <Menu id={MENU_ID}>
            <Item onClick={removeNode}>
              Remove
            </Item>
            <Separator />
            <Item onClick={igniteNode}>Ignite</Item>
          </Menu>
        </>, document.body)}

        <button onClick={displayMenu} css={css`
            outline: none !important;
            position: absolute;
            right: 5px;
            top: 2px;
        `}>⚙️</button>
        <p className={tw('rounded-t-md px-2 py-1 bg-gray-100 text-sm')} css={css`
            &:hover { cursor: move;}
        `}>{title}</p>

        <div className={`${tw`flex flex-col space-y-2 pb-2 pt-10`}`}>
          {children}
        </div>
      </div>
    </>
  );
};