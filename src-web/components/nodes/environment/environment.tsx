import { MecchiNodeStore, useMecchiNodeStore } from "../../../stores/node-store";
import { shallow } from "zustand/shallow";
import { tw } from 'twind';
import { Handle, Position } from "reactflow";
import MecchiNode from "../../node-base";
import { ChangeEvent } from "react";
import { MecchiKV } from "../../../stores/nodes";

const MecchiEnvironmentNodeInfo = {
  type: 'environment',
  view: MecchiEnvironmentNode,
  data: {
    device: 'cuda',
  },

  transform: function (inputs: MecchiKV, state: MecchiKV): Promise<MecchiKV> {
    const { device } = state;

    return Promise.resolve({ device });
  }
}

export default MecchiEnvironmentNodeInfo;

const nodeSelector = (store: MecchiNodeStore) => ({
  nodes: store.nodes,
  edges: store.edges,
  executePipeline: store.runPipeline
});

const selector = (id: string) => (store: MecchiNodeStore) => ({
  setDevice: (e: ChangeEvent<HTMLInputElement>) => store.updateNode(id, { device: e.target.value }),
});

export function MecchiEnvironmentNode({ id, data }: { id: string, data: MecchiKV }) {
  const { setDevice } = useMecchiNodeStore(selector(id));
  const { nodes, edges, executePipeline } = useMecchiNodeStore(nodeSelector, shallow);

  return <MecchiNode title="Environment" id={id}>
    <Handle id="environment-a" className={`${tw`w-2 h-2`}`} type="source" style={{ top: 40, bottom: 'auto', background: 'orange' }} position={Position.Right}>
      <span className={`${tw`font-bold text-xs float-right mr-3`}`} style={{ marginTop: -7 }}>power</span>
    </Handle>

    <label className={tw('px-2 py-1 mb-2 gap-3 text-sm')}>Device
      <input className={tw('ml-2 border-blue-500 border-1 rounded px-1 focus:outline-none')}
        type="text" value={data.device} onChange={setDevice} />
    </label>

    <button className={`${tw`bg-blue-500 ml-1 text-white hover:bg-blue-600 text-sm py-1 px-1 rounded`}`} style={{ width: '95%' }}
      onClick={() => executePipeline(id, nodes, edges)}>
      ▶️ Run
    </button>
  </MecchiNode >
}; 