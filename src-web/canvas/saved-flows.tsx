import { ControlButton, Panel } from 'reactflow'
import { tw } from 'twind'
import { useMecchiViewStore } from '../stores/view-store'

import { useState } from 'react'
import { Global, css } from '@emotion/react'

export default function MecchiSavedFlows() {
  const { savedFlowsVisible } = useMecchiViewStore();

  return (
    <>
      <Panel position="top-right" style={{
        display: savedFlowsVisible ? 'block' : 'none',
        border: '1px solid #eee',
        marginRight: 50
      }}>

        <>hello1</>
      </Panel>
    </>
  )
}