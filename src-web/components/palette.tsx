/** @jsxImportSource @emotion/react */
import { Panel } from 'reactflow'
import { MecchiNodeStore, useMecchiNodeStore } from '../stores/node-store'
import { shallow } from 'zustand/shallow'
import { tw } from 'twind'
import { css } from '@emotion/react';
import { useMecchiViewStore } from '../stores/view-store'

const selector = (store: MecchiNodeStore) => ({
  createNode: store.createNode,
});

interface IProps {
  [k: string]: any
}

export default function MecchiPalette({ nodeTypes }: IProps) {
  const { createNode } = useMecchiNodeStore(selector, shallow);
  const { paletteVisible } = useMecchiViewStore();

  return (
    <Panel position="top-center" css={css`
        display: ${paletteVisible ? 'block' : 'none'};
    `}>
      <div className={tw`grid grid-flow-column gap-2`}>
        {nodeTypes.map((n: string) => {
          return <button key={n} className={tw`bg-gray-200 hover:bg-blue-200 text-sm gap-y-0 py-1 px-3 rounded`} onClick={() => createNode(n)}>{n}</button>
        })}
      </div>
    </Panel>
  )
}