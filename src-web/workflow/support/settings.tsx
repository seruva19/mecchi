import { ControlButton, Panel } from 'reactflow'
import { tw } from 'twind'
import { useMecchiUIStore } from '../../stores/ui-store'

import { useEffect, useState } from 'react'
import { Global, css } from '@emotion/react'
import ky from 'ky'

export default function MecchiSettings() {
  const { showSettings } = useMecchiUIStore();

  return (
    <>
      <button onClick={() => showSettings(false)}>x</button>
    </>
  )
}