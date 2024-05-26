import { ControlButton, Panel } from 'reactflow'
import { CSSProperties, tw } from 'twind'
import { useMecchiUIStore } from '../../stores/ui-store'

import { useEffect, useState } from 'react'
import { Global, css } from '@emotion/react'
import ky from 'ky'
import Scrollbars from 'react-custom-scrollbars-2'

export default function MecchiSavedFlows() {
  const { savedFlowsVisible } = useMecchiUIStore();

  const [flows, setFlows] = useState([]);
  const [selectedFlow, setSelectedFlow] = useState(null);

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
    // fontWeight: 'bold',
    display: 'block',
    position: 'sticky',
    top: 0,
    background: 'white'
  } as any;

  return (
    <>
      <Panel position="top-right" style={{
        display: savedFlowsVisible ? 'block' : 'none',
        border: '1px solid #eee',
        marginRight: 50,
        fontSize: 13,
        backgroundColor: 'white',
        maxHeight: window.innerHeight / 2,
        // overflowY: 'scroll'
      }}>
        <Scrollbars style={{ width: 300, height: window.innerHeight / 2 }}
          autoHideTimeout={1000}
          autoHideDuration={200}>
          <div style={{ display: 'flex', padding: '0 15px' }}>
            <div>
              <span style={titleStyle}>📋 flows</span>
              {flows.map((flow, i) => {
                return <div style={{
                  cursor: 'pointer',
                  padding: '0 5px',

                  backgroundColor: flow === selectedFlow ? 'rgba(59,130,246)' : 'white',
                  color: flow === selectedFlow ? 'white' : 'black',
                }} key={i} onClick={() => setSelectedFlow(flow)}>{flow}</div>
              })}
            </div>
          </div></Scrollbars>
      </Panel>
    </>
  )
}