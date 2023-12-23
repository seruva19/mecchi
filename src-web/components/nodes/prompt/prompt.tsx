import { MecchiNodeStore, useMecchiNodeStore } from "../../../stores/node-store";
import { Handle, Position } from "reactflow";
import MecchiNode from "../../node-base";
import 'react-h5-audio-player/lib/styles.css';
import { tw } from "twind";
import { MecchiKV } from "../../../stores/nodes";
import React from "react";

const MecchiPromptNodeInfo = {
  type: 'prompt',
  view: MecchiPromptNode,
  data: {
    prompt: 'synthwave, 80s',
  },

  transform: function (inputs: MecchiKV, state: MecchiKV): Promise<MecchiKV> {
    const { prompt } = state;

    return Promise.resolve({ prompt });
  }
}

export default MecchiPromptNodeInfo;

const selector = (id: string) => (store: MecchiNodeStore) => ({
  setPrompt: (e: any) => store.updateNode(id, { prompt: e.target.value }),
});

export function MecchiPromptNode({ id, data }: { id: string, data: any }) {
  const { setPrompt } = useMecchiNodeStore(selector(id));

  return <MecchiNode title="Prompt" id={id}>
    <Handle id="prompt-a" className={`${tw`w-2 h-2`}`} type="source" style={{ top: 40, bottom: 'auto', background: 'blue' }} position={Position.Right}>
      <span className={`${tw`font-bold text-xs float-right mr-3`}`} style={{ marginTop: -7 }}>prompt</span>
    </Handle>

    <textarea id="message" defaultValue={data.prompt} rows={4} style={{ width: 500, resize: 'none' }} className={`${tw`block m-2 p-2 text-sm text-gray-900 focus:outline-none bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}`}
      placeholder="Prompt text" onChange={setPrompt}>
    </textarea>
  </MecchiNode>
}; 