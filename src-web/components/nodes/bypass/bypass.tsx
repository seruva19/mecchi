import { MecchiNodeStore, useMecchiNodeStore } from "../../../stores/node-store";
import { Handle, Position } from "reactflow";
import MecchiNode from "../../node-base";
import { tw } from "twind";
import { MecchiKV } from "../../../stores/nodes";
import ky from 'ky';
import React from "react";

const MecchiBypassNodeInfo = {
  type: 'bypass',
  view: MecchiBypassNode,
  data: {
    unloadAll: false
  },

  transform: function (inputs: MecchiKV, state: MecchiKV): Promise<MecchiKV> {
    return new Promise(async resolve => {
      if (state.unloadAll) {
        await ky.get('/mecchi/unloadAll', {
          timeout: false
        }).json();
      }

      resolve(inputs);
    });
  }
}

export default MecchiBypassNodeInfo;

const selector = (id: string) => (store: MecchiNodeStore) => ({
  setUnload: (e: any) => store.updateNode(id, { unloadAll: e.target.checked }),
});

export function MecchiBypassNode({ id, data }: { id: string, data: any }) {
  const { setUnload } = useMecchiNodeStore(selector(id));

  return <MecchiNode title="Bypass" id={id}>
    <Handle id="bypass-a" className={`${tw`w-2 h-2`}`} type="target" style={{ top: 40, bottom: 'auto', background: 'purple' }} position={Position.Left}>
      <span className={`${tw`absolute font-bold text-xs ml-2 pl-1 rounded`}`} style={{ marginTop: -7 }}>in</span>
    </Handle>

    <Handle id="bypass-b" className={`${tw`w-2 h-2`}`} type="source" style={{ top: 30, bottom: 'auto', background: 'purple' }} position={Position.Right}>
      <span className={`${tw`font-bold text-xs float-right mr-3`}`} style={{ marginTop: -7 }}>out</span>
    </Handle>

    <div className={`${tw`flex flex-col p-2`}`} style={{ width: 200 }}>
      <div className={`${tw`flex`}`}>
        <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>Unload all models</label>
        <input type="checkbox" checked={data.unloadAll} onChange={setUnload}
          className={tw('text-sm h-6 border-blue-200 border-1 rounded px-1 focus:outline-none')} />
      </div>
    </div>
  </MecchiNode>
}; 