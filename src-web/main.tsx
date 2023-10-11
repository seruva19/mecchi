import React from 'react'
import ReactDOM from 'react-dom/client'
import { ReactFlowProvider } from 'reactflow'
import MecchiCanvas from './components/canvas.tsx'
import { KBarProvider } from "kbar";
import 'react-toastify/dist/ReactToastify.min.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <React.StrictMode>
      <KBarProvider>
        <ReactFlowProvider>
          <MecchiCanvas />
        </ReactFlowProvider>
      </KBarProvider>
    </React.StrictMode>,
  </>
)