import { MecchiNodeStore, useMecchiNodeStore } from "../../../stores/node-store";
import { Handle, Position } from "reactflow";
import MecchiNode from "../../node-base";
import { tw } from "twind";
import { MecchiKV } from "../../../stores/nodes";
import ky from 'ky';

const MecchiUpsamplerNodeInfo = {
  type: 'upsampler',
  view: MecchiUpsamplerNode,
  data: {
    steps: 100,
    guidance: 5,
    seed: -1,
    sample: undefined
  },

  transform: function (inputs: MecchiKV, state: MecchiKV): Promise<MecchiKV> {
    return new Promise(async resolve => {
      const { samples: [sample] } = inputs;

      const payload = {
        ...state, ...{
          sample
        }
      };

      const result: any = await ky.post('/mecchi/audiosr', {
        json: payload,
        timeout: false
      }).json();

      resolve({ samples: result.samples });
    });
  }
}


export default MecchiUpsamplerNodeInfo;

const selector = (id: string) => (store: MecchiNodeStore) => ({
  setSteps: (e: any) => store.updateNode(id, { steps: +e.target.value }),
  setGuidance: (e: any) => store.updateNode(id, { guidance: +e.target.value }),
  setSeed: (e: any) => store.updateNode(id, { seed: e.target.value }),
});

export function MecchiUpsamplerNode({ id, data }: { id: string, data: any }) {
  const { setSteps, setGuidance, setSeed } = useMecchiNodeStore(selector(id));

  return <MecchiNode title="Upsampler" id={id}>
    <Handle id="upsampler-a" className={`${tw`w-2 h-2 `}`} type="target" style={{ top: 40, bottom: 'auto', background: 'blue' }} position={Position.Left}>
      <span className={`${tw`absolute font-bold text-xs ml-2 pl-1 rounded`}`} style={{ marginTop: -7 }}>sample</span>
    </Handle>
    <Handle id="upsampler-b" className={`${tw`w-2 h-2`}`} type="source" style={{ top: 30, bottom: 'auto', background: 'blue' }} position={Position.Right}>
      <span className={`${tw`font-bold text-xs float-right mr-3`}`} style={{ marginTop: -7 }}>sample</span>
    </Handle>

    <div className={`${tw`flex flex-col p-2`}`}>
      <div className={`${tw`flex`}`}>
        <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>Steps</label>
        <input type="range" min="10" step="1" max="300" value={data.steps} onChange={setSteps}
          className={tw('text-sm h-6 border-blue-200 border-1 rounded px-1 focus:outline-none')} />
        <span className={`${tw`text-xs w-3 ml-1 mt-1 rounded`}`}>{data.steps}</span>
      </div>

      <div className={`${tw`flex`}`}>
        <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>Guidance scale</label>
        <input type="range" min="1" step="1" max="50" value={data.guidance} onChange={setGuidance}
          className={tw('text-sm h-6 border-blue-200 border-1 rounded px-1 focus:outline-none')} />
        <span className={`${tw`text-xs w-3 ml-1 mt-1 rounded`}`}>{data.guidance}</span>
      </div>

      <div className={`${tw`flex`}`}>
        <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>Seed</label>
        <input className={tw('text-sm h-6 flex-1 border-blue-200 border-1 rounded px-1 focus:outline-none')}
          type="number" step="1" value={data.seed} onChange={setSeed} />
      </div>
    </div>
  </MecchiNode>
}; 