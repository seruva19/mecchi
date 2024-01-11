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

const selector = (store: MecchiNodeStore) => ({
  busyNodes: store.busyNodes,
});

const override: CSSProperties = {
  position: 'absolute',
  right: '0',
  margin: '4px 40px 0 0'
};

export default function MecchiNode({ title, id, children }: { title: string, id: string, children: ReactNode }) {
  const { busyNodes } = useMecchiNodeStore(selector, shallow);
  const MENU_ID = `menu-node${id}`;
  const { show, hideAll } = useContextMenu({
    id: MENU_ID
  });

  function displayMenu(e: any) {
    show({
      event: e
    });
  }

  const { setNodes } = useReactFlow();

  const onNodeRemove = () => {
    setNodes((nodes) => nodes.filter((nodes) => nodes.id !== id));
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
      <div className={tw('rounded-md bg-white shadow-xl')}>
        <ScaleLoader loading={!!busyNodes.find(node => node.id == id)} color={'dodgerblue'} height={10} cssOverride={override} />
        {createPortal(<>
          <Menu id={MENU_ID}>
            <Item onClick={onNodeRemove}>
              Remove
            </Item>
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

        <div className={`${tw`flex flex-col space-y-2 pb-2 pt-10`} nodrag`}>
          {children}
        </div>
      </div>
    </>
  );
};