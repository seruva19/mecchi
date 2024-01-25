import { ControlButton, Panel } from 'reactflow'
import { MecchiNodeStore, useMecchiNodeStore } from '../stores/node-store'
import { shallow } from 'zustand/shallow'
import { tw } from 'twind'
import { useMecchiUIStore } from '../stores/ui-store'
import { AiOutlineControl } from "react-icons/ai";
import { GrStatusUnknown } from "react-icons/gr";
import { MdOutlineElectricalServices } from "react-icons/md";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import { SiConvertio } from "react-icons/si";
import { MdOutlineAllInclusive } from "react-icons/md";

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
  const { paletteVisible } = useMecchiUIStore();
  const [avNodes, setAvNodes] = useState<{ group: string, types: string[] }>({ group: '', types: [] });

  const onDragStart = (event: any, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const groups = ['all'].concat(Object.keys(nodeTypes));
  const group = (n: string) => <ControlButton style={{
    width: 100,
    fontSize: 13,
    outline: 'none',
    justifyContent: 'left',
    border: '1px solid #eee',
    borderTopColor: 'transparent',
    fontWeight: avNodes.group == n ? 'bold' : 'initial',
    fontFamily: 'monospace'
  }} key={n} onClick={() => {
    if (n == 'all') {
      setAvNodes(avNodes.group == 'all' ? { group: '', types: [] } : { group: 'all', types: (Object.values(nodeTypes) as string[][]).reduce((a, b) => a.concat(b)) });
    } else {
      setAvNodes(avNodes.group == n ? { group: '', types: [] } : { group: n, types: nodeTypes[n] });
    }
  }} title={n} className={`${tw`hover:bg-blue-500 hover:text-white`}`}>
    <div className={tw`grid grid-flow-column`}>
      <div style={{ marginTop: 5, marginRight: 10 }}>
        {n == 'control' && <div><AiOutlineControl /></div>}
        {n == 'generate' && <div><SlEnergy /></div>}
        {n == 'convert' && <div><SiConvertio /></div>}
        {n == 'io' && <div><MdOutlineElectricalServices /></div>}
        {n == 'all' && <div><MdOutlineAllInclusive /></div>}
      </div>
      {n}
    </div></ControlButton>

  const node = (nodeGroup: string, nodeType: string) => (<ControlButton className={tw`grid grid-flow-column`} style={{
    width: 200,
    fontSize: 13,
    outline: 'none',
    justifyContent: 'left',
    border: '1px solid #eee',
    borderTopColor: 'transparent',
    fontFamily: 'monospace'
  }} key={nodeType} onDragStart={(event) => onDragStart(event, nodeType)} draggable>{nodeType}</ControlButton>)

  return (
    <>
      <Global
        styles={css`.mecchi-palette .react-flow__controls-button:first-of-type {
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
          'display': avNodes.types.length != 0 ? 'block' : 'none',
          position: 'absolute',
          top: 0,
          left: 120
        }}><div style={{
          maxHeight: 'calc(100% - 30px)',
          position: 'fixed',
          overflowY: 'auto'
        }}>
            {avNodes.types.map(t => node(avNodes.group, t))}
          </div>
        </div>

      </Panel>
    </>
  )
}