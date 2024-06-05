import { MecchiKV } from "../../stores/nodes";
import ky from 'ky';

const MecchiStableAudioOpen10NodeInfo = {
  type: 'stable-audio',
  title: 'Stable Audio Open 1.0',
  group: 'generate',

  inputs: [{
    name: 'prompt',
    type: 'text',
  }],
  outputs: [{
    name: 'sample',
    type: 'sound',
  }],

  units: [{
    name: "secondsStart",
    title: "Start",
    type: "number",
    range: { min: 0, max: 30, step: 0.5 }
  }, {
    name: "secondsTotal",
    title: "Total",
    type: "number",
    range: { min: 0, max: 47, step: 0.5 }
  }, {
    name: "cfgScale",
    title: "CFG scale",
    type: "number",
    range: { min: 0, max: 30, step: 1 }
  }, {
    name: "steps",
    title: "Steps",
    type: "number",
    range: { min: 10, max: 300, step: 1 }
  }, {
    name: "token",
    title: "Token",
    type: "line"
  }],
  data: {
    secondsStart: 0,
    secondsTotal: 30,
    cfgScale: 6,
    steps: 250,
    token: "",
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

      const result: any = await ky.post('/mecchi/sa-open10', {
        json: payload,
        timeout: false
      }).json();

      resolve({ samples: result.samples });
    });
  }
}

export default MecchiStableAudioOpen10NodeInfo;