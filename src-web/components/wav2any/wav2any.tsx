import 'react-h5-audio-player/lib/styles.css';
import { MecchiKV } from "../../stores/nodes";

const MecchiWav2AnyNodeInfo = {
  type: 'wav2any',
  title: 'Wav2Any',
  group: 'convert',

  inputs: [{
    name: 'sample',
    type: 'sound',
  }],
  outputs: [{
    name: 'sample',
    type: 'sound',
  }],

  state: [{
    name: "conversion",
    title: "Conversion",
    type: "list",
    values: ['wav2mp3']
  }, {
    name: "saveMetadata",
    title: "Write flow metadata",
    type: "bool"
  }],

  data: {
    conversion: 'wav2mp3',
    saveMetadata: true
  },

  transform: function (inputs: MecchiKV, state: MecchiKV): Promise<MecchiKV> {
    const { prompt } = inputs.prompt ? { prompt: inputs.prompt } : state;

    return Promise.resolve({ prompt });
  }
}

export default MecchiWav2AnyNodeInfo;