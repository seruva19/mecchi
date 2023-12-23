/** @jsxImportSource @emotion/react */
import 'reactflow/dist/style.css';
import MecchiFlow from './flow';
import { css } from '@emotion/react';
import { Flip, ToastContainer } from 'react-toastify';
import { useState, useEffect } from 'react';
import { getMecchiNodes } from '../stores/nodes';

export default function MecchiCanvas() {
  const [nodeTypesKV, setNodeTypesKV] = useState<{ [key: string]: any }>({});
  const [nodeTypes, setNodeTypes] = useState<string[]>([]);

  const getNodes = async () => {
    const mecchiNodes = await getMecchiNodes();
    const types: string[] = mecchiNodes.map(node => node.type);

    const typesKV: { [key: string]: any } = {};
    mecchiNodes.forEach(node => {
      typesKV[node.type] = node.view;
    });

    setNodeTypes(types);
    setNodeTypesKV(typesKV);
  }

  useEffect(() => {
    getNodes();
  }, []);

  return (
    <>
      <div className="mecchi-canvas" css={css`
        width: 100vw;
        position: fixed;
        top: 0;
        height: 100vh;`} onContextMenu={(e) => { }}>
        <MecchiFlow nodeTypesKV={nodeTypesKV} nodeTypes={nodeTypes} />
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
