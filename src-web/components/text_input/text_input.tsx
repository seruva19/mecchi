import 'react-h5-audio-player/lib/styles.css';
import { MecchiKV } from "../../stores/nodes";

const MecchiTextInputNodeInfo = {
  type: 'text-input',
  title: 'Text input',
  group: 'io',

  inputs: [{
    name: 'prompt',
    type: 'text',
  }],
  outputs: [{
    name: 'prompt',
    type: 'text',
  }],

  units: [{
    name: "prompt",
    title: "Prompt text",
    type: "multiline",
  }],

  data: {
    prompt: '',
  },

  transform: function (inputs: MecchiKV, state: MecchiKV): Promise<MecchiKV> {
    const { prompt } = inputs.prompt ? { prompt: inputs.prompt } : state;

    return Promise.resolve({ prompt });
  }
}

export default MecchiTextInputNodeInfo;