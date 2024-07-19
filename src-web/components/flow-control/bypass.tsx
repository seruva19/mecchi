import { MecchiNodeStore, useMecchiNodeStore } from "../../stores/node-store";
import { Handle, Position } from "@xyflow/react";
import MecchiNode from "../../workflow/node-base";
import { tw } from "twind";
import { MecchiEvent, MecchiKV } from "../../stores/nodes";
import ky from 'ky';
import { InputHandle, OutputHandle } from "../../stores/view-node";
import { useState } from "react";

const MecchiBypassNodeInfo = {
  type: 'bypass',
  group: 'control',
  view: MecchiBypassNode,
  data: {
    unloadAll: false,
    stopPropagation: false,
  },

  transform: function (inputs: MecchiKV, data: MecchiKV, event: MecchiEvent): Promise<MecchiKV> {
    return new Promise(async resolve => {
      if (data.unloadAll) {
        await ky.get('/mecchi/unloadAll', {
          timeout: false
        }).json();
      }

      event.halt = data.stopPropagation;
      resolve(inputs);
    });
  }
}

export default MecchiBypassNodeInfo;

const selector = (id: string) => (store: MecchiNodeStore) => ({
  setParams: (key: string, value: any) => store.updateNode(id, { [key]: value }),
});

export function MecchiBypassNode({ id, data }: { id: string, data: typeof MecchiBypassNodeInfo.data }) {
  const { setParams } = useMecchiNodeStore(selector(id));
  const [isHidden, setIsHidden] = useState(true);

  return <MecchiNode title="Bypass" id={id}>
    <div style={{ position: 'absolute', top: 8 }}>
      <InputHandle index={0} id={id} io={{ name: "in", type: 'any' }} />
    </div>

    <div style={{ position: 'absolute', top: 0, right: 0 }}>
      <OutputHandle index={0} id={id} io={{ name: "out", type: 'any' }} />
    </div>

    <button className="mecchi-btn" style={{
      position: 'absolute',
      top: '25px',
      left: 'calc(50% - 25px)',
    }} onClick={() => setIsHidden(!isHidden)}>{isHidden ? 'expand' : 'collapse'}</button>
    <div className={`${tw`flex flex-col p-2`}`} style={{ width: 200, display: isHidden ? 'none' : 'initial' }}>
      <div className={`${tw`flex`}`}>
        <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>Unload all models</label>
        <input type="checkbox" checked={data.unloadAll} onChange={(e) => setParams('unloadAll', e.target.checked)}
          className={tw('text-sm h-6 border-blue-200 border-1 rounded px-1 focus:outline-none')} />
      </div>
      <div className={`${tw`flex`}`}>
        <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>Halt</label>
        <input type="checkbox" checked={data.stopPropagation} onChange={(e) => setParams('stopPropagation', e.target.checked)}
          className={tw('text-sm h-6 border-blue-200 border-1 rounded px-1 focus:outline-none')} />
      </div>
    </div>
  </MecchiNode>
}; 