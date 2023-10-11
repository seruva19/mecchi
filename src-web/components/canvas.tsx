/** @jsxImportSource @emotion/react */
import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';
import MecchiFlow from './flow';
import { css } from '@emotion/react';
import { useMecchiViewStore } from '../stores/view-store';
import { Flip, ToastContainer } from 'react-toastify';

export default function MecchiCanvas() {
  return (
    <>
      <div className="mecchi-canvas" css={css`
        width: 100vw;
        position: fixed;
        top: 0;
        height: 100vh;`} onContextMenu={(e) => { }}>
        <MecchiFlow />
        <ToastContainer position="bottom-center"
          autoClose={5000}
          newestOnTop={false}
          closeOnClick
          transition={Flip}
          rtl={false}
          pauseOnFocusLoss={true}
          draggable
          theme="light" />
      </div>
    </>
  )
}
