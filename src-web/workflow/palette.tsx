import { ControlButton, Panel } from 'reactflow'
import { tw } from 'twind'
import { useMecchiUIStore } from '../stores/ui-store'
import { AiOutlineControl } from "react-icons/ai";
import { MdOutlineElectricalServices } from "react-icons/md";
import { SiConvertio } from "react-icons/si";
import { MdOutlineAllInclusive } from "react-icons/md";
import { SlEnergy } from "react-icons/sl";
import { useState } from 'react'
import { Global, css } from '@emotion/react'
import { Scrollbars } from 'react-custom-scrollbars-2';

export default function MecchiPalette({ nodeTypes }: { [k: string]: any }) {
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
    backgroundColor: avNodes.group == n ? 'rgba(59,130,246)' : 'white',
    color: avNodes.group == n ? 'white' : 'initial',
    fontFamily: 'monospace'
  }} key={n} onClick={() => {
    if (n == 'all') {
      setAvNodes(avNodes.group == 'all' ? { group: '', types: [] } : { group: 'all', types: (Object.values(nodeTypes) as string[][]).reduce((a, b) => a.concat(b)) });
    } else {
      setAvNodes(avNodes.group == n ? { group: '', types: [] } : { group: n, types: nodeTypes[n] });
    }
  }} title={n}>
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
    width: 100,
    fontSize: 13,
    outline: 'none',
    justifyContent: 'left',
    border: '1px solid #eee',
    borderTopColor: 'transparent',
    fontFamily: 'monospace'
  }} key={nodeType} onDragStart={(event) => onDragStart(event, nodeType)} draggable><span style={{
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'pre'
  }} >
      {nodeType}
    </span></ControlButton>)

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
          top: groups.length * 30,
        }}>
          <Scrollbars style={{ width: 123, height: window.innerHeight - 340 }}
            autoHideTimeout={1000}
            autoHideDuration={200}>
            <div style={{
              // maxHeight: 'calc(100% - 340px)',
              // position: 'fixed',
              // overflowY: 'auto',
            }}>
              {avNodes.types.map(t => node(avNodes.group, t))}
            </div>
          </Scrollbars>
        </div>

      </Panel>
    </>
  )
}