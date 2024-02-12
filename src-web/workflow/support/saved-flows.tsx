import { ControlButton, Panel } from 'reactflow'
import { CSSProperties, tw } from 'twind'
import { useMecchiUIStore } from '../../stores/ui-store'

import { useEffect, useState } from 'react'
import { Global, css } from '@emotion/react'
import ky from 'ky'

export default function MecchiSavedFlows() {
  const { savedFlowsVisible } = useMecchiUIStore();
  const [flows, setFlows] = useState([]);

  useEffect(() => {
    const readFlows = async () => {
      const result: any = await ky.get('/mecchi/workflows', {
        timeout: false
      }).json();

      if (result.mecchi == '👍') {
        const flowNames = result.flows;
        setFlows(flowNames);
      }
    }

    readFlows();
  }, [])

  const titleStyle = { marginBottom: 10, fontWeight: 'bold', display: 'block', position: 'sticky', top: 0, background: 'white' } as any;

  return (
    <>
      <Panel position="bottom-right" style={{
        display: savedFlowsVisible ? 'block' : 'none',
        border: '1px solid #eee',
        marginRight: 50,
        fontSize: 13,
        backgroundColor: 'white',
        maxHeight: 300,
        overflowY: 'scroll'
      }}>
        <div style={{ display: 'flex', padding: '0 5px' }}>
          <div style={{ marginRight: 10 }}>
            <span style={titleStyle}>templates</span>
            {flows.map((flow, i) => {
              return <div key={i} onClick={() => console.log(flow)}>{flow}</div>
            })}
          </div>
          <div>
            <span style={titleStyle}>saved flows</span>
            {flows.map((flow, i) => {
              return <div key={i} onClick={() => console.log(flow)}>{flow}</div>
            })}
          </div>
        </div>
      </Panel>
    </>
  )
}