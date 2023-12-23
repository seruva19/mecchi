/** @jsxImportSource @emotion/react */
import { ReactNode } from "react";
import { tw } from 'twind';
import { css } from "@emotion/react";
import { MecchiNodeStore, useMecchiNodeStore } from "../stores/node-store";
import { shallow } from "zustand/shallow";
import { CSSProperties } from "react";
import { ScaleLoader } from "react-spinners";

const selector = (store: MecchiNodeStore) => ({
  busyNodes: store.busyNodes,
});

const override: CSSProperties = {
  position: 'absolute',
  right: '0',
  margin: '5px 10px 0 0'
};

export default function MecchiNode({ title, id, children }: { title: string, id: string, children: ReactNode }) {
  const { busyNodes } = useMecchiNodeStore(selector, shallow);

  return (
    <>
      <div className={tw('rounded-md bg-white shadow-xl')}>
        <ScaleLoader loading={!!busyNodes.find(node => node.id == id)} color={'dodgerblue'} height={10} cssOverride={override} />
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