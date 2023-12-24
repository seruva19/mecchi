import ky from "ky";
import { MecchiKV } from "../../../stores/nodes";
import MecchiNode from "../../node-base";
import { Handle, Position } from "reactflow";
import { tw } from "twind";
import { useMecchiNodeStore } from "../../../stores/node-store";
import { css } from "@emotion/react";

const MecchiAudioLdm2NodeInfo = {
  type: 'audioldm2',
  view: MecchiAudioLdm2Node,
  data: {
    steps: 200,
    length: 10,
    scale: 3.5,
  },

  transform: function (inputs: MecchiKV, state: MecchiKV): Promise<MecchiKV> {
    return new Promise(async resolve => {
      const payload = {
        ...state, ...{
          device: inputs.device,
          prompt: inputs.prompt,
          negative_prompt: inputs.negativePrompt
        }
      };

      const result: any = await ky.post('/mecchi/audioldm2', {
        json: payload,
        timeout: false
      }).json();

      resolve({ samples: result.samples });
    });
  }
}

export default MecchiAudioLdm2NodeInfo;

const selector = (id: string) => (store: any) => ({
  setParams: (key: string, value: any) => store.updateNode(id, { [key]: value }),
});

export function MecchiAudioLdm2Node({ id, data }: { id: string, data: MecchiKV }) {
  const { setParams } = useMecchiNodeStore(selector(id));

  return <MecchiNode title="AudioLDM2" id={id}>
    <Handle id="audioldm2-a" className={`${tw`w-2 h-2`}`} type="target" style={{ top: 40, bottom: 'auto', background: 'orange' }} position={Position.Left}>
      <span className={`${tw`absolute font-bold text-xs ml-2 pr-1 pl-1 rounded`}`} style={{ marginTop: -7 }}>power</span>
    </Handle>
    <Handle id="audioldm2-b" className={`${tw`w-2 h-2`}`} type="target" style={{ top: 50, bottom: 'auto', background: 'blue' }} position={Position.Left}>
      <span className={`${tw`absolute font-bold text-xs ml-2 pl-1 rounded`}`} style={{ marginTop: -7 }}>prompt</span>
    </Handle>

    <Handle id="audioldm2-c" className={`${tw`w-2 h-2`}`} type="target" style={{ top: 68, bottom: 'auto', background: 'blue' }} position={Position.Left}>
      <span className={`${tw`absolute font-bold text-xs ml-2 pl-1 rounded`}`} style={{ marginTop: -7 }}>negative_prompt</span>
    </Handle>

    <Handle id="audioldm2-d" className={`${tw`w-2 h-2`}`} type="source" style={{ top: 30, bottom: 'auto', background: 'blue' }} position={Position.Right}>
      <span className={`${tw`font-bold text-xs float-right mr-3`}`} style={{ marginTop: -7 }}>sample</span>
    </Handle>

    <div className={`${tw`flex flex-col p-2`}`} style={{ marginTop: 20, width: 200 }}>
      <div className={`${tw`flex`}`}>
        <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>Steps</label>
        <input className={tw('text-sm h-6 flex-1 border-blue-200 border-1 rounded px-1 focus:outline-none')}
          type="number" step="15" min="0" max="300" value={data['steps']} onChange={e => setParams('steps', e.target.value)} />
      </div>

      <div className={`${tw`flex`}`}>
        <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>Length</label>
        <input className={tw('text-sm h-6 flex-1 border-blue-200 border-1 rounded px-1 focus:outline-none')}
          type="number" step="0.05" min="0" max="30" value={data['length']} onChange={e => setParams('length', e.target.value)} />
      </div>

      <div className={`${tw`flex`}`}>
        <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>Scale</label>
        <input className={tw('text-sm h-6 flex-1 border-blue-200 border-1 rounded px-1 focus:outline-none')}
          type="number" step="0.05" min="0" max="30" value={data['scale']} onChange={e => setParams('scale', e.target.value)} />
      </div>
    </div>
  </MecchiNode>
};