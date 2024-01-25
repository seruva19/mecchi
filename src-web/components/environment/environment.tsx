import { MecchiNodeStore, useMecchiNodeStore } from "../../stores/node-store";
import { shallow } from "zustand/shallow";
import { tw } from 'twind';
import { Handle, Position } from "reactflow";
import MecchiNode from "../../workflow/node-base";
import { ChangeEvent } from "react";
import { MecchiKV } from "../../stores/nodes";
import { css } from "@emotion/react";
import { OutputHandle, PowerHandle } from "../../stores/view-node";

const MecchiEnvironmentNodeInfo = {
  type: 'environment',
  group: 'control',
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
  handles: store.handles,
  executePipeline: store.runPipeline
});

const selector = (id: string) => (store: MecchiNodeStore) => ({
  setDevice: (e: ChangeEvent<HTMLInputElement>) => store.updateNode(id, { device: e.target.value }),
});

export function MecchiEnvironmentNode({ id, data }: { id: string, data: MecchiKV }) {
  const { setDevice } = useMecchiNodeStore(selector(id));
  const { nodes, edges, executePipeline } = useMecchiNodeStore(nodeSelector, shallow);

  return <MecchiNode title="Environment" id={id}>
    <div style={{ position: 'absolute', top: 8, right: 0 }}>
      <OutputHandle index={0} id="environment" io={{ name: 'power', type: 'ignition' }} />
    </div>

    <div className={`${tw`flex flex-col p-2`} nodrag`}>
      <div className={`${tw`flex`}`}>
        <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>Device</label>
        <input className={tw('text-sm h-6 flex-1 border-blue-200 border-1 rounded px-1 focus:outline-none')}
          type="text" value={data.device} onChange={setDevice} />
      </div>

      <button className={`${tw`bg-blue-500 text-white hover:bg-blue-600 text-sm py-1 rounded`}`} style={{ width: '100%' }}
        onClick={() => executePipeline(id, nodes, edges)}>
        ▶️ Run
      </button>
    </div>
  </MecchiNode >
}; 