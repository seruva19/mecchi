import ky from "ky";
import { MecchiKV } from "../../stores/nodes";

const MecchiClapInterrogatorNodeInfo = {
  type: 'clap-interrogator',
  title: 'Clap Interrogator',
  group: 'convert',

  inputs: [{
    name: 'sample',
    type: 'sound',
  }],
  outputs: [{
    name: 'tags',
    type: 'text',
  }],

  units: [{
    name: "checkpoint",
    title: "Checkpoint",
    type: "list",
    values: ['laion/clap-htsat-unfused', 'laion/larger_clap_music']
  }, {
    name: "tagsFile",
    title: "Tags list",
    type: "list",
    values: ['tags/tags-sample.json', 'tags/tags-rym-2021.json']
  }, {
    name: "tagsCount",
    title: "Number of tags",
    type: "number"
  }],

  data: {
    checkpoint: 'laion/larger_clap_music',
    tagsFile: 'tags/tags-rym-2021.json',
    tagsCount: 10,
  },

  transform: function (inputs: MecchiKV, state: MecchiKV): Promise<MecchiKV> {
    return new Promise(async resolve => {
      const payload = {
        ...state, ...{
          sample: inputs.samples[0],
          device: inputs.device,
        }
      };

      const result: any = await ky.post('/mecchi/clap_interrogator', {
        json: payload,
        timeout: false
      }).json();

      resolve({ tags: result.tags, prompt: result.tags.join(', ') });
    });
  }
}

export default MecchiClapInterrogatorNodeInfo;