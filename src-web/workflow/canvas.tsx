import '@xyflow/react/dist/style.css';
import MecchiFlow from './flow';
import { useState, useEffect } from 'react';
import { getMecchiNodes } from '../stores/nodes';
import { Toaster } from 'react-hot-toast';

export default function MecchiCanvas() {
  const [nodeTypesKV, setNodeTypesKV] = useState<{ [key: string]: any }>({});
  const [nodeTypes, setNodeTypes] = useState<{ [key: string]: string[] }>({});

  const getNodes = async () => {
    const mecchiNodes = await getMecchiNodes();
    const types: { [key: string]: string[] } = mecchiNodes.reduce((collection, node) => {
      const key = node.group;
      if (!collection[key]) {
        collection[key] = [];
      }

      collection[key].push(node.type);
      return collection;
    }, {} as { [key: string]: string[] });

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
      <div style={{
        width: '100vw',
        position: "fixed",
        top: 0,
        height: '100vh',
      }} onContextMenu={(e) => { }}>
        <MecchiFlow nodeTypesKV={nodeTypesKV} nodeTypes={nodeTypes} />
        <Toaster />
      </div>
    </>
  )
}
