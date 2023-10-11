/** @jsxImportSource @emotion/react */
import { MecchiNodeStore, useMecchiNodeStore } from "../../stores/node-store";
import { Handle, Position } from "reactflow";
import MecchiNode from "../node-base";
import { css } from "@emotion/react";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { tw } from "twind";
import { MecchiKV } from "../../stores/nodes";

export const MecchiPlaybackNodeInfo = {
  type: 'playback',
  view: MecchiPlaybackNode,
  data: {
    sample: undefined
  },

  transform: function (inputs: MecchiKV, state: MecchiKV): Promise<MecchiKV> {
    return new Promise(resolve => {
      const { samples } = inputs;

      resolve({ sample: samples[0] });
    });
  }
}

const selector = (id: string) => (store: MecchiNodeStore) => ({

});

const customStyles = css`
  .rhap_container {
    box-shadow: none !important;
  }
`;

export default function MecchiPlaybackNode({ id, data }: { id: string, data: any }) {
  const { } = useMecchiNodeStore(selector(id));

  return <MecchiNode title="Playback" id={id}>
    <Handle id="playback-a" className={`${tw`w-2 h-2 `}`} type="target" style={{ top: 40, bottom: 'auto', background: 'blue' }} position={Position.Left}>
      <span className={`${tw`absolute font-bold text-xs ml-2 pl-1 rounded`}`} style={{ marginTop: -7 }}>sample</span>
    </Handle>
    <Handle id="playback-b" className={`${tw`w-2 h-2`}`} type="source" style={{ top: 30, bottom: 'auto', background: 'blue' }} position={Position.Right}>
      <span className={`${tw`font-bold text-xs float-right mr-3`}`} style={{ marginTop: -7 }}>sample</span>
    </Handle>

    <AudioPlayer css={css`
      width: 500px;
      box-shadow: none;
      
    `}
      layout="stacked-reverse"
      src={`out_data/${data.sample}`}
      autoPlay={false}
      autoPlayAfterSrcChange={true}
      onPlay={e => { }}
    />

  </MecchiNode>
}; 