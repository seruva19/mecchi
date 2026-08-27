import { MecchiKV } from "../../stores/nodes";
import ky from 'ky';

const MecchiMultibandNodeInfo = {
  type: 'multiband',
  title: 'Multiband diffusion',
  group: 'generate',

  inputs: [],
  outputs: [{
    name: 'diffusion',
    type: 'any',
  }],

  params: [{
    name: "mbd",
    title: "Model",
    type: "list",
    values: [
      "facebook/multiband-diffusion"
    ]
  }],
  data: {
    model: 'facebook/multiband-diffusion',
  },

  transform: function (inputs: MecchiKV, data: MecchiKV): Promise<MecchiKV> {
    return new Promise(async resolve => {
      resolve({ mbd: data.model });
    });
  }
}

export default MecchiMultibandNodeInfo;