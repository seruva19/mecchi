import React from 'react'
import ReactDOM from 'react-dom/client'
import { ReactFlowProvider } from 'reactflow'
import MecchiCanvas from './canvas/canvas'
import { KBarAnimator, KBarPortal, KBarPositioner, KBarProvider, KBarResults, KBarSearch, useMatches } from "kbar";
import { RenderResults } from './command-bar/results';
import { actions } from './command-bar/kbar';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <React.StrictMode>
      <KBarProvider actions={actions}>
        <KBarPortal>
          <KBarPositioner>
            <KBarAnimator>
              <KBarSearch />
              <RenderResults />
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