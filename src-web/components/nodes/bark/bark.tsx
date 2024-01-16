import ky from "ky";
import { MecchiKV } from "../../../stores/nodes";

const MecchiBarkNodeInfo = {
  type: 'bark',
  title: 'Bark',
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
      "suno/bark",
      "suno/bark-small",
    ]
  }, {
    name: "preset",
    title: "Voice preset",
    type: "line"
  }],

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