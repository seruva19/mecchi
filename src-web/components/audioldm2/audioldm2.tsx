import ky from "ky";
import { MecchiKV } from "../../stores/nodes";
import MecchiNode from "../../workflow/node-base";
import { Handle, Position } from "reactflow";
import { tw } from "twind";
import { useMecchiNodeStore } from "../../stores/node-store";
import { css } from "@emotion/react";

const MecchiAudioLdm2NodeInfo = {
  type: 'audioldm2',
  title: 'AudioLDM2',
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
    name: "steps",
    title: "Steps",
    type: "number",
    range: { min: 0, max: 300, step: 15 }
  }, {
    name: "length",
    title: "Length",
    type: "number",
    range: { min: 0, max: 30, step: 0.05 }
  }, {
    name: "scale",
    title: "Guidance scale",
    type: "number",
    range: { min: 0, max: 30, step: 1 }
  }],

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
