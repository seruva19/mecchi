import ky from "ky";
import { MecchiKV } from "../../../stores/nodes";
import MecchiNode from "../../../canvas/node-base";
import { Handle, Position } from "reactflow";
import { tw } from "twind";
import { useMecchiNodeStore } from "../../../stores/node-store";
import { css } from "@emotion/react";

const MecchiBarkNodeInfo = {
  type: 'bark',
  group: 'generate',
  view: MecchiBarkNode,
  data: {
    model: 'suno/bark',
    preset: 'v2/en_speaker_6',
  },

  transform: function (inputs: MecchiKV, state: MecchiKV): Promise<MecchiKV> {
    return new Promise(async resolve => {
      const payload = {
        ...state, ...{
          device: inputs.device,
          prompt: inputs.prompt
        }
      };

      const result: any = await ky.post('/mecchi/bark', {
        json: payload,
        timeout: false
      }).json();

      resolve({ samples: result.samples });
    });
  }
}

export default MecchiBarkNodeInfo;

const selector = (id: string) => (store: any) => ({
  setParams: (key: string, value: any) => store.updateNode(id, { [key]: value }),
});

export function MecchiBarkNode({ id, data }: { id: string, data: MecchiKV }) {
  const { setParams } = useMecchiNodeStore(selector(id));

  return <MecchiNode title="Bark" id={id}>
    <Handle id="bark-a" className={`${tw`w-2 h-2`}`} type="target" style={{ top: 40, bottom: 'auto', background: 'orange' }} position={Position.Left}>
      <span className={`${tw`absolute font-bold text-xs ml-2 pr-1 pl-1 rounded`}`} style={{ marginTop: -7 }}>power</span>
    </Handle>
    <Handle id="bark-b" className={`${tw`w-2 h-2`}`} type="target" style={{ top: 50, bottom: 'auto', background: 'blue' }} position={Position.Left}>
      <span className={`${tw`absolute font-bold text-xs ml-2 pl-1 rounded`}`} style={{ marginTop: -7 }}>prompt</span>
    </Handle>

    <Handle id="bark-d" className={`${tw`w-2 h-2`}`} type="source" style={{ top: 30, bottom: 'auto', background: 'blue' }} position={Position.Right}>
      <span className={`${tw`font-bold text-xs float-right mr-3`}`} style={{ marginTop: -7 }}>sample</span>
    </Handle>

    <div className={`${tw`flex flex-col p-2`}`} style={{ marginTop: 20 }}>
      <div className={`${tw`flex`}`}>
        <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>Model</label>
        <select value={data['model']} onChange={e => setParams('model', e.target.value)}
          className={tw('text-sm h-6 flex-1 border-blue-200 border-1 rounded px-1 focus:outline-none')}>
          <option value="suno/bark">suno/bark</option>
          <option value="suno/bark-small">suno/bark-small</option>
        </select>
      </div>

      <div className={`${tw`flex`}`}>
        <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>Voice preset</label>
        <input className={tw('text-sm h-6 flex-1 border-blue-200 border-1 rounded px-1 focus:outline-none')}
          type="text" step="15" min="0" max="300" value={data['preset']} onChange={e => setParams('preset', e.target.value)} />
      </div>
    </div>
  </MecchiNode>
};