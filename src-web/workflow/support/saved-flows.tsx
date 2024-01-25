import { ControlButton, Panel } from 'reactflow'
import { tw } from 'twind'
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

  return (
    <>
      <Panel position="bottom-right" style={{
        display: savedFlowsVisible ? 'block' : 'none',
        border: '1px solid #eee',
        marginRight: 50,
        fontSize: 13,
        padding: 5,
        backgroundColor: 'white',
        maxHeight: 300,
        overflowY: 'scroll'
      }}>
        {flows.map((flow, i) => {
          return <div key={i} onClick={() => console.log(flow)}>{flow}</div>
        })}
      </Panel>
    </>
  )
}