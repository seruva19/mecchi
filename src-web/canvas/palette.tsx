import { ControlButton, Panel } from 'reactflow'
import { MecchiNodeStore, useMecchiNodeStore } from '../stores/node-store'
import { shallow } from 'zustand/shallow'
import { tw } from 'twind'
import { useMecchiViewStore } from '../stores/view-store'
import { AiOutlineControl } from "react-icons/ai";
import { GrStatusUnknown } from "react-icons/gr";
import { MdOutlineElectricalServices } from "react-icons/md";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import { SiConvertio } from "react-icons/si";

import { SlEnergy } from "react-icons/sl";
import { useState } from 'react'
import { Global, css } from '@emotion/react'
const selector = (store: MecchiNodeStore) => ({
  createNode: store.createNode,
});

interface IProps {
  [k: string]: any
}

export default function MecchiPalette({ nodeTypes }: IProps) {
  const { paletteVisible } = useMecchiViewStore();
  const [avNodes, setAvNodes] = useState<[string, string[]]>(['', []]);

  const onDragStart = (event: any, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const groups = Object.keys(nodeTypes);
  const group = (n: string) => <ControlButton style={{
    width: 100,
    fontSize: 13,
    outline: 'none',
    justifyContent: 'left',
    border: '1px solid #eee',
    borderTopColor: 'transparent',
    fontWeight: avNodes[0] == n ? 'bold' : 'initial',
    fontFamily: 'monospace'
  }} key={n} onClick={() => {
    setAvNodes(avNodes[0] == n ? ['', []] : [n, nodeTypes[n]]);
  }} title={n} className={`${tw`hover:bg-blue-500 hover:text-white`}`}>
    <div className={tw`grid grid-flow-column`}>
      <div style={{ marginTop: 5, marginRight: 10 }}>
        {n == 'control' && <div><AiOutlineControl /></div>}
        {n == 'generate' && <div><SlEnergy /></div>}
        {n == 'convert' && <div><SiConvertio /></div>}
        {n == 'io' && <div><MdOutlineElectricalServices /></div>}
        {n == undefined && <div><GrStatusUnknown /></div>}
      </div>
      {n}
    </div></ControlButton>

  const node = (nodeType: string) => (<ControlButton className={tw`grid grid-flow-column`} style={{
    width: 200,
    fontSize: 13,
    outline: 'none',
    justifyContent: 'left',
    border: '1px solid #eee',
    borderTopColor: 'transparent',
    fontFamily: 'monospace'
  }} key={nodeType} onDragStart={(event) => onDragStart(event, nodeType)} draggable>node: {nodeType}</ControlButton>)

  return (
    <>
      <Global
        styles={css`.mecchi-palette .react-flow__controls-button:first-child {
          border-top-color: #eee !important;
      `}
      />
      <Panel position="top-left" className='mecchi-palette' style={{
        'display': paletteVisible ? 'block' : 'none'
      }}>
        <div style={{ textAlign: 'left' }}>
          {groups.map(group)}
        </div>

        <div style={{
          'display': avNodes[1].length != 0 ? 'block' : 'none',
          position: 'absolute',
          top: 0,
          left: 120
        }}><div>
            {avNodes[1]!.map(node)}
          </div>
        </div>

      </Panel>
    </>
  )
}