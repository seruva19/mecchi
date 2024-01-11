import React from 'react'
import ReactDOM from 'react-dom/client'
import { ReactFlowProvider } from 'reactflow'
import MecchiCanvas from './canvas/canvas'
import { KBarAnimator, KBarPortal, KBarPositioner, KBarProvider, KBarSearch } from "kbar";
import { actions } from './command-bar/actions';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <React.StrictMode>
      <KBarProvider actions={actions}>
        <KBarPortal>
          <KBarPositioner>
            <KBarAnimator>
              <KBarSearch />
            </KBarAnimator>
          </KBarPositioner>
        </KBarPortal>
        <ReactFlowProvider>
          <MecchiCanvas />
        </ReactFlowProvider>
      </KBarProvider>
    </React.StrictMode>,
  </>
)