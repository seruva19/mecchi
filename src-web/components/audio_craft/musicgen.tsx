import { MecchiKV } from "../../stores/nodes";
import ky from 'ky';

const MecchiMusicGenNodeInfo = {
  type: 'musicgen',
  title: 'MusicGen',
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
    name: "model",
    title: "Model",
    type: "list",
    values: [
      "facebook/musicgen-small",
      "facebook/musicgen-medium",
      "facebook/musicgen-melody",
      "facebook/musicgen-large",
      "facebook/musicgen-melody-large",
      "facebook/musicgen-stereo-smal",
      "facebook/musicgen-stereo-medium",
      "facebook/musicgen-stereo-melody",
      "facebook/musicgen-stereo-large"
    ]
  }, {
    name: "useSampling",
    title: "Use sampling",
    type: "bool"
  }, {
    name: "topK",
    title: "Top tokens selection",
    type: "number",
    range: { min: 0, max: 1000, step: 1 }
  }, {
    name: "topP",
    title: "Token selection threshold",
    type: "number",
    range: { min: 0, max: 1000, step: 1 }
  }, {
    name: "temperature",
    title: "Temperature",
    type: "number",
    range: { min: 0, max: 1, step: 0.05 }
  }, {
    name: "duration",
    title: "Duration",
    type: "number",
    range: { min: 0, max: 30, step: 0.05 }
  }, {
    name: "cfgScale",
    title: "CFG scale",
    type: "number",
    range: { min: 0, max: 30, step: 1 }
  }, {
    name: "twoStepCfg",
    title: "Two step CFG",
    type: "bool"
  }, {
    name: "extendStride",
    title: "Extend stride",
    type: "number",
    range: { min: 0, max: 30, step: 0.5 }
  }],
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