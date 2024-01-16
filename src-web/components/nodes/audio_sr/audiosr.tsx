import { MecchiNodeStore, useMecchiNodeStore } from "../../../stores/node-store";
import { Handle, Position } from "reactflow";
import MecchiNode from "../../../canvas/node-base";
import { tw } from "twind";
import { MecchiKV } from "../../../stores/nodes";
import ky from 'ky';

const MecchiAudioSRNodeInfo = {
  type: 'audiosr',
  title: 'AudioSR',
  group: 'convert',

  inputs: [{
    name: 'sample',
    type: 'sound',
  }],
  outputs: [{
    name: 'sample',
    type: 'sound',
  }],

  units: [{
    name: "steps",
    title: "Steps",
    type: "number",
    range: { min: 10, max: 300, step: 1 }
  }, {
    name: "guidance",
    title: "Guidance scale",
    type: "number",
    range: { min: 1, max: 50, step: 1 }
  }, {
    name: "seed",
    title: "Seed",
    type: "number"
  }],

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


export default MecchiAudioSRNodeInfo;
