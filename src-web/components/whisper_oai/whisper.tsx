import ky from "ky";
import { MecchiKV } from "../../stores/nodes";

const MecchiWhisperNodeInfo = {
  type: 'whisper',
  title: 'Whisper',
  group: 'convert',

  inputs: [{
    name: 'sample',
    type: 'sound',
  }],

  outputs: [{
    name: 'transcription',
    type: 'text',
  }],

  data: {
    threshold: 2.4,
  },

  params: [{
    name: "threshold",
    title: "Threshold",
    type: "number",
    range: { min: 0, max: 10, step: 0.1 }
  }],

  transform: function (inputs: MecchiKV, state: MecchiKV): Promise<MecchiKV> {
    return new Promise(async resolve => {
      const { samples: [sample] } = inputs;

      const payload = {
        ...state, ...{
          device: inputs.device,
          threshold: state.threshold,
          sample
        }
      };

      const result: any = await ky.post('/mecchi/whisper', {
        json: payload,
        timeout: false
      }).json();

      resolve({ prompt: result.text });
    });
  }
}

export default MecchiWhisperNodeInfo;
