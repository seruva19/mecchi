import { MecchiKV } from "../../stores/nodes";
import ky from 'ky';

const MecchiTokenizerNodeInfo = {
  type: 'tokenizer',
  title: 'Tokenizer',
  group: 'generate',

  inputs: [],
  outputs: [{
    name: 'tokenizer',
    type: 'any',
  }],

  params: [{
    name: "model",
    title: "Model",
    type: "list",
    values: [
      "dac_44khz",
      "dac_24khz",
      "facebook/encodec_24khz",
      "facebook/encodec_32khz"
    ]
  }],
  data: {
    model: 'EnCodec',
  },

  transform: function (inputs: MecchiKV, data: MecchiKV): Promise<MecchiKV> {
    return new Promise(async resolve => {
      resolve({ tokenizer: data.model });
    });
  }
}

export default MecchiTokenizerNodeInfo;