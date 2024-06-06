import React from 'react'
import ReactDOM from 'react-dom/client'
import { ReactFlowProvider } from 'reactflow'
import MecchiCanvas from './workflow/canvas'
import { KBarAnimator, KBarPortal, KBarPositioner, KBarProvider, KBarResults, KBarSearch, useMatches } from "kbar";
import { RenderResults } from './workflow/command-bar/results';
import { actions } from './workflow/command-bar/kbar';
import { Global, css } from '@emotion/react';
import { globalStyles } from './styles';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <Global styles={globalStyles}></Global>
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