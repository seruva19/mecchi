import { useMecchiNodeStore } from "../../../stores/node-store";
import { Handle, Position } from "reactflow";
import MecchiNode from "../../node-base";
import { tw } from "twind";
import { MecchiKV } from "../../../stores/nodes";
import ky from 'ky';

const MecchiMusicGenNodeInfo = {
  type: 'musicgen',
  view: MecchiMusicGenNode,
  data: {
    model: 'facebook/musicgen-melody',
    useSampling: true,
    topK: 250,
    topP: 0,
    temperature: 1,
    duration: 10,
    cfgScale: 3,
    twoStepCfg: false,
    extendStride: 18,
    samples: []
  },

  transform: function (inputs: MecchiKV, state: MecchiKV): Promise<MecchiKV> {
    return new Promise(async resolve => {
      const payload = {
        ...state, ...{
          device: inputs.device,
          prompt: inputs.prompt
        }
      };

      const result: any = await ky.post('/mecchi/musicgen', {
        json: payload,
        timeout: false
      }).json();

      resolve({ samples: result.samples });
    });
  }
}

export default MecchiMusicGenNodeInfo;

const selector = (id: string) => (store: any) => ({
  setParams: (key: string, value: any) => store.updateNode(id, { [key]: value }),
});

export function MecchiMusicGenNode({ id, data }: { id: string, data: MecchiKV }) {
  const { setParams } = useMecchiNodeStore(selector(id));

  return <MecchiNode title="MusicGen" id={id}>
    <Handle id="musicgen-a" className={`${tw`w-2 h-2`}`} type="target" style={{ top: 40, bottom: 'auto', background: 'orange' }} position={Position.Left}>
      <span className={`${tw`absolute font-bold text-xs ml-2 pr-1 pl-1 rounded`}`} style={{ marginTop: -7 }}>power</span>
    </Handle>
    <Handle id="musicgen-b" className={`${tw`w-2 h-2`}`} type="target" style={{ top: 50, bottom: 'auto', background: 'blue' }} position={Position.Left}>
      <span className={`${tw`absolute font-bold text-xs ml-2 pl-1 rounded`}`} style={{ marginTop: -7 }}>prompt</span>
    </Handle>

    <Handle id="musicgen-c" className={`${tw`w-2 h-2`}`} type="source" style={{ top: 30, bottom: 'auto', background: 'blue' }} position={Position.Right}>
      <span className={`${tw`font-bold text-xs float-right mr-3`}`} style={{ marginTop: -7 }}>sample</span>
    </Handle>

    <div className={`${tw`flex flex-col p-2`}`}>
      <div className={`${tw`flex`}`}>
        <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>Model</label>
        <select value={data['model']} onChange={e => setParams('model', e.target.value)}
          className={tw('text-sm h-6 flex-1 border-blue-200 border-1 rounded px-1 focus:outline-none')}>
          <option value="facebook/musicgen-small">facebook/musicgen-small</option>
          <option value="facebook/musicgen-medium">facebook/musicgen-medium</option>
          <option value="facebook/musicgen-melody">facebook/musicgen-melody</option>
          <option value="facebook/musicgen-large">facebook/musicgen-large</option>
        </select>
      </div>

      <div className={`${tw`flex`}`}>
        <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>Use sampling</label>
        <input type="checkbox" checked={data['useSampling']} onChange={e => setParams('useSampling', e.target.checked)}
          className={tw('text-sm h-6 border-blue-200 border-1 rounded px-1 focus:outline-none')} />
      </div>

      <div className={`${tw`flex`}`}>
        <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>Top tokens selection</label>
        <input className={tw('text-sm h-6 flex-1 border-blue-200 border-1 rounded px-1 focus:outline-none')}
          type="number" min="0" max="1000" step="1" value={data['topK']} onChange={e => setParams('topK', e.target.value)} />
      </div>

      <div className={`${tw`flex`}`}>
        <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>Token selection threshold</label>
        <input className={tw('text-sm h-6 flex-1 border-blue-200 border-1 rounded px-1 focus:outline-none')}
          type="number" min="0" max="1000" step="1" value={data['topP']} onChange={e => setParams('topP', e.target.value)} />
      </div>

      <div className={`${tw`flex`}`}>
        <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>Temperature</label>
        <input className={tw('text-sm h-6 flex-1 border-blue-200 border-1 rounded px-1 focus:outline-none')}
          type="number" step="0.05" min="0" max="1" value={data['temperature']} onChange={e => setParams('temperature', e.target.value)} />
      </div>

      <div className={`${tw`flex`}`}>
        <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>Duration</label>
        <input className={tw('text-sm h-6 flex-1 border-blue-200 border-1 rounded px-1 focus:outline-none')}
          type="number" step="0.05" min="0" max="30" value={data['duration']} onChange={e => setParams('duration', e.target.value)} />
      </div>

      <div className={`${tw`flex`}`}>
        <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>CFG scale</label>
        <input className={tw('text-sm h-6 flex-1 border-blue-200 border-1 rounded px-1 focus:outline-none')}
          type="number" step="1" min="0" max="30" value={data['cfgScale']} onChange={e => setParams('cfgScale', e.target.value)} />
      </div>

      <div className={`${tw`flex`}`}>
        <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>Two step CFG</label>
        <input type="checkbox" checked={data['twoStepCfg']} onChange={e => setParams('twoStepCfg', e.target.checked)}
          className={tw('text-sm h-6 border-blue-200 border-1 rounded px-1 focus:outline-none')} />
      </div>

      <div className={`${tw`flex`}`}>
        <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>Extend stride</label>
        <input className={tw('text-sm h-6 flex-1 border-blue-200 border-1 rounded px-1 focus:outline-none')}
          type="number" step="0.5" min="0" max="30" value={data['extendStride']} onChange={e => setParams('extendStride', e.target.value)} />
      </div>
    </div>
  </MecchiNode>
};