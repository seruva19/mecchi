import ky from 'ky';
import { useCallback } from 'react';

export const handleOnReset = (setNodes: any, success: any) => {
  setNodes([]);
  success('flow cleared');
}

export const handleDragOver = (event: any) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
}

export const handleDrop = (event: any, reactFlowInstance: any, createNode: any) => {
  event.preventDefault();
  const nodeType = event.dataTransfer.getData('application/reactflow');

  if (typeof nodeType === 'undefined' || !nodeType) {
    return;
  }

  const position = (reactFlowInstance as any).project({
    x: event.clientX,
    y: event.clientY
  });

  createNode(nodeType, position);
}

const fastSaveKey = 'fast_save';

export const handleSave = async (reactFlowInstance: any, handles: any, success: any) => {
  if (reactFlowInstance) {
    const flow = (reactFlowInstance as any).toObject();
    await ky.post('/mecchi/workflow/save', {
      json: { name: fastSaveKey, flow: JSON.stringify({ ...flow, ...{ handles } }) },
      timeout: false
    }).json();

    success('flow saved');
  }
};

export const handleRestore = async (setNodes: any, setEdges: any, setHandles: any, setViewport: any, success: any, error: any) => {
  const result: any = await ky.post('/mecchi/workflow/load', {
    json: { name: fastSaveKey },
    timeout: false
  }).json();

  if (result.mecchi == '👍') {
    const flow = JSON.parse(result.flow);

    if (flow) {
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);

      flow.handles && setHandles(flow.handles);

      setViewport({ x, y, zoom });
    }

    success('flow loaded');
  } else {
    error('failed to load flow');
  }
};
