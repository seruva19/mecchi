import ky from 'ky';
import { useCallback } from 'react';

export const resetFlow = (setNodes: any, success: any) => {
  setNodes([]);
  success('flow cleared');
}

export const dragOverFlow = (event: any) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
}

export const dropFlow = (event: any, screenToFlowPosition: any, createNode: any) => {
  event.preventDefault();
  const nodeType = event.dataTransfer.getData('application/reactflow');

  if (typeof nodeType === 'undefined' || !nodeType) {
    return;
  }

  const position = screenToFlowPosition({
    x: event.clientX,
    y: event.clientY
  });

  createNode(nodeType, position);
}

export const FAST_SAVE_KEY = 'fast_save';

export const saveFlow = async (name: string, rfInstance: any, handles: any, success: any) => {
  if (rfInstance) {
    const flow = rfInstance.toObject();
    await ky.post('/mecchi/workflow/save', {
      json: { name, flow: JSON.stringify({ ...flow, ...{ handles } }) },
      timeout: false
    }).json();

    success('template quick saved');
  }
};

export const loadFlow = async (
  name: string,
  setNodes: any,
  setEdges: any,
  setHandles: any,
  setViewport: any,
  onSuccess: Function,
  onError: Function
) => {
  const result: any = await ky.post('/mecchi/workflow/load', {
    json: { name },
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

    onSuccess();
  } else {
    onError();
  }
};
