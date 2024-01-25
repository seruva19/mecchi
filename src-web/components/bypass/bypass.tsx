import { MecchiNodeStore, useMecchiNodeStore } from "../../stores/node-store";
import { Handle, Position } from "reactflow";
import MecchiNode from "../../workflow/node-base";
import { tw } from "twind";
import { MecchiKV } from "../../stores/nodes";
import ky from 'ky';
import { InputHandle, OutputHandle } from "../../stores/view-node";

const MecchiBypassNodeInfo = {
  type: 'bypass',
  group: 'control',
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
    <div style={{ position: 'absolute', top: 8 }}>
      <InputHandle index={0} id={id} io={{ name: "in", type: 'any' }} />
    </div>

    <div style={{ position: 'absolute', top: 0, right: 0 }}>
      <OutputHandle index={0} id={id} io={{ name: "out", type: 'any' }} />
    </div>

    <div className={`${tw`flex flex-col p-2`}`} style={{ width: 200 }}>
      <div className={`${tw`flex`}`}>
        <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>Unload all models</label>
        <input type="checkbox" checked={data.unloadAll} onChange={setUnload}
          className={tw('text-sm h-6 border-blue-200 border-1 rounded px-1 focus:outline-none')} />
      </div>
    </div>
  </MecchiNode>
}; 