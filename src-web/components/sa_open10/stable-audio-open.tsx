import { MecchiKV } from "../../stores/nodes";
import ky from 'ky';

const MecchiStableAudioOpen10NodeInfo = {
  type: 'stable-audio',
  title: 'Stable Audio Open 1.0',
  group: 'generate',

  inputs: [{
    name: 'prompt',
    type: 'text',
  }, {
    name: 'negative prompt',
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
    name: "sigmaMin",
    title: "Sigma (min)",
    type: "number",
    range: { min: 0, max: 1, step: 0.1 }
  }, {
    name: "sigmaMax",
    title: "Sigma (max)",
    type: "number",
    range: { min: 100, max: 1000, step: 10 }
  }, {
    name: "sampler",
    title: "Sampler",
    type: "list",
    values: [
      "k-heun",
      "k-lms",
      "k-dpmpp-2s-ancestral",
      "k-dpm-2",
      "k-dpm-fast",
      "k-dpm-adaptive",
      "dpmpp-2m-sde",
      "dpmpp-3m-sde"
    ]
  }, {
    name: "trimSilence",
    title: "Trim silence",
    type: "bool"
  }, {
    name: "useHalfPrecision",
    title: "Half precision",
    type: "bool"
  }],
  data: {
    secondsStart: 0,
    secondsTotal: 30,
    cfgScale: 6,
    steps: 250,
    sigmaMin: 0.3,
    sigmaMax: 500,
    sampler: "dpmpp-3m-sde",
    trimSilence: true,
    useHalfPrecision: true,
    samples: []
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

      const result: any = await ky.post('/mecchi/sa-open10', {
        json: payload,
        timeout: false
      }).json();

      resolve({ samples: result.samples });
    });
  }
}

export default MecchiStableAudioOpen10NodeInfo;