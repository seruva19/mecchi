import { CSSProperties, tw } from 'twind'
import { useMecchiUIStore } from '../../stores/ui-store'

import { useEffect, useState } from 'react'
import { Global, css } from '@emotion/react'
import ky from 'ky'
import Scrollbars from 'react-custom-scrollbars-2'
import { getNodesBounds, Panel, useReactFlow } from '@xyflow/react'
import { MecchiNodeStore, useMecchiNodeStore } from '../../stores/node-store'
import { shallow } from 'zustand/shallow'
import { loadFlow, resetFlow } from '../flow-tools/interaction'

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

export default function MecchiSavedFlows({ instance }: any) {
  const { createNode, nodes, edges, onNodesChange, onEdgesChange, onConnect, setNodes, setEdges, handles, setHandles } = useMecchiNodeStore(selector, shallow);
  const { savedFlowsVisible } = useMecchiUIStore();
  const { setViewport, getEdges, getNodes } = useReactFlow();
  const { success, error } = useMecchiUIStore();

  const [flows, setFlows] = useState<Array<string>>([]);
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [removeConfirmShown, setRemoveConfirmShown] = useState(false);
  const [newFlowName, setNewFlowName] = useState('new template');

  const addFlow = async () => {
    // const rect = getNodesBounds(nodes);
    // resetFlow(setNodes, success);

    const result: any = await ky.post('/mecchi/workflow/load', {
      json: { name: selectedFlow },
      timeout: false
    }).json();

    if (result.mecchi == '👍') {
      const flow = JSON.parse(result.flow);

      if (flow) {
        setNodes(nodes.concat(flow.nodes));
        setEdges(edges.concat(flow.edges));

        flow.handles && setHandles(handles.concat(flow.handles));
        // setViewport({ x: rect.x, y: rect.y + rect.height, zoom: 1 });
      }

      success('template loaded');
    } else {
      error('failed to load template');
    }
  }

  const readFlow = async () => {
    loadFlow(selectedFlow!, setNodes, setEdges, setHandles, setViewport, () => success('template loaded'), () => error('failed to load template'))
  }

  const saveFlow = async () => {
    const flow = instance.toObject();
    await ky.post('/mecchi/workflow/save', {
      json: { name: newFlowName, flow: JSON.stringify({ ...flow, ...{ handles } }) },
      timeout: false
    }).json();

    setFlows([...[newFlowName], ...flows]);
    success('template saved');
  }

  const deleteFlow = async () => {
    const result: any = await ky.post('/mecchi/workflow/delete', {
      json: { name: selectedFlow },
      timeout: false
    }).json();

    if (result.mecchi == '👍') {
      success('template removed');

      setFlows(flows.filter(f => f !== selectedFlow));
      setSelectedFlow(null);
      setRemoveConfirmShown(false)
    } else {
      error('failed to remove template');
    }
  }

  useEffect(() => {
    const readFlows = async () => {
      const result: any = await ky.get('/mecchi/workflows', {
        timeout: false
      }).json();

      if (result.mecchi == '👍') {
        const { flows: flowNames } = result;
        setFlows(flowNames);
      }
    }

    readFlows();
  }, [])

  const titleStyle = {
    marginBottom: 10,
    fontWeight: 'normal',
    width: '100%',
    display: 'block',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    background: 'white'
  } as any;

  return (
    <>
      <Panel position="top-right" style={{
        display: savedFlowsVisible ? 'block' : 'none',
        border: '1px solid #eee',
        marginRight: 95,
        fontSize: 13,
        backgroundColor: 'white',
        maxHeight: window.innerHeight / 2,
        // overflowY: 'scroll'
      }}>
        <Scrollbars style={{ width: 300, height: window.innerHeight / 2 }}
          autoHideTimeout={1000}
          autoHideDuration={200}>
          <div style={titleStyle}>
            <div style={{
              visibility: !!selectedFlow ? 'visible' : 'hidden',
              height: 22,
              position: 'absolute',
              background: 'white',
              width: 'calc(100% - 15px)',
              marginLeft: 3,
              display: 'flex'
            }}>
              <button className='mecchi-btn' onClick={readFlow} style={{ margin: '5px 0px 0px 7px', height: 20 }}>load</button>
              <button className='mecchi-btn' onClick={() => setRemoveConfirmShown(true)} style={{ margin: '5px 0 0 20px', height: 20 }}>remove</button>
              {
                removeConfirmShown && <div className='conform-remove-flow' style={{ margin: '5px 0 0 5px' }}>
                  <button onClick={deleteFlow} title='confirm removal'>👍</button>
                  <button onClick={() => setRemoveConfirmShown(false)} title='cancel removal'>❌</button>
                </div>
              }
            </div>
          </div>
          <div style={{
            marginTop: 30,
            padding: '0 15px 0 5px',

          }}>
            <span style={{
              display: 'block',
              margin: '0 0 5px 5px'
            }}>total templates: {flows.length}</span>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              width: '100%'
            }}>
              {flows.map((flow, i) => {
                return <div className='flow-item' style={{
                  cursor: 'pointer',
                  padding: '0 5px',
                  borderRadius: 5,
                  width: '95%',
                  flex: '1 1 45%',
                  height: 20,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'pre',
                  // fontWeight: flow === selectedFlow ? 'bold' : 'normal',
                  background: flow === selectedFlow ? '#3b82f6' : 'whitesmoke',
                  color: flow === selectedFlow ? 'white' : 'black',
                  marginRight: 5,
                  marginBottom: 5
                }} key={i} onClick={() => setSelectedFlow(flow)}>{flow}</div>
              })}
            </div>
          </div>
        </Scrollbars >

        <div style={{
          display: 'block',
          position: 'sticky',
          bottom: 0,
          marginTop: 3,
          background: 'white',
          border: '1px solid #eeeeee'
        }}>
          <input type='text' style={{
            background: 'whitesmoke',
            borderRadius: 5,
            margin: '5px 5px 0 5px',
            width: '50%',
            outline: 'none',
            // border: '1px solid silver',
            display: 'block',
            paddingLeft: 5
          }} onChange={e => setNewFlowName(e.target.value)} value={newFlowName}></input>
          {/* <button className='mecchi-btn' disabled={true} style={{ marginLeft: 5 }}>save selected</button> */}
          <button className='mecchi-btn' onClick={saveFlow} style={{ margin: '5px 5px 5px 5px' }}>save</button>
        </div>
      </Panel >
    </>
  )
}