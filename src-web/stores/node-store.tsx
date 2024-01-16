import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';

import { nanoid } from 'nanoid';
import { createWithEqualityFn } from 'zustand/traditional';
import { getMecchiNodes } from './nodes';
import { runMecchiPipeline } from '../pipelines/pipeline-builder';

export interface MecchiNodeStore {
  nodes: Node[];
  setNodes: (nodes: Node[]) => void;
  edges: Edge[];
  setEdges: (edges: Edge[]) => void;
  updateNode: (id: string, data: any) => void;
  createNode: (type: string, position?: { x: number, y: number }) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  runPipeline: (id: string, nodes: Node[], edges: Edge[]) => Promise<void>;
  busyNodes: Node[];
}

export const useMecchiNodeStore = createWithEqualityFn<MecchiNodeStore>((set, get) => ({
  nodes: [],
  setNodes: (nodes: Node[]) => set({ nodes }),
  edges: [],
  setEdges: (edges: Edge[]) => set({ edges }),
  busyNodes: [],

  updateNode: (id: string, data: any) => {
    set({
      nodes: get().nodes.map(node =>
        node.id === id
          ? { ...node, data: { ...node.data, ...data } }
          : node
      )
    });
  },

  createNode: async (type: string, position?: { x: number, y: number }) => {
    const mecchiNodes = await getMecchiNodes();
    const id = nanoid();
    const data = mecchiNodes.find(n => n.type === type)!.data;
    const defaultPosition = position || { x: 0, y: 0 };

    set({
      nodes: [...get().nodes, { id, type, data, position: defaultPosition }]
    });
  },

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  addEdge: (data: Omit<Edge, 'id'>) => {
    const id = nanoid(6);
    const edge = { id, ...data };

    set({
      edges: [edge, ...get().edges]
    });
  },

  runPipeline: async (id: string, nodes: Node[], edges: Edge[]) => {
    await runMecchiPipeline(id, nodes, edges, { get, set });
  }
}), Object.is)
