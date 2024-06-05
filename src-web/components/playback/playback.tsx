import { MecchiNodeStore, useMecchiNodeStore } from "../../stores/node-store";
import { Handle, Position } from "reactflow";
import MecchiNode from "../../workflow/node-base";
import { css } from "@emotion/react";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { tw } from "twind";
import { MecchiKV } from "../../stores/nodes";
import { InputHandle, OutputHandle } from "../../stores/view-node";

const MecchiPlaybackNodeInfo = {
  type: 'playback',
  group: 'io',
  view: MecchiPlaybackNode,
  data: {
    samples: []
  },

  transform: function (inputs: MecchiKV, data: MecchiKV): Promise<MecchiKV> {
    return new Promise(resolve => {
      resolve(inputs);
    });
  }
}

export default MecchiPlaybackNodeInfo;

const selector = (id: string) => (store: MecchiNodeStore) => ({

});

const customStyles = css`
  .rhap_container {
    box-shadow: none !important;
  }
`;

export function MecchiPlaybackNode({ id, data }: { id: string, data: any }) {
  const { } = useMecchiNodeStore(selector(id));

  return <MecchiNode title="Playback" id={id}>
    <div style={{ position: 'absolute', top: 8 }}>
      <InputHandle index={0} id={id} io={{ name: 'sample', type: "sound" }} />
    </div>

    <div style={{ position: 'absolute', top: 0, right: 0 }}>
      <OutputHandle index={0} id={id} io={{ name: 'sample', type: "sound" }} />
    </div>

    <AudioPlayer className="nodrag" css={css`
      width: 500px;
      box-shadow: none;
      
    `}
      layout="stacked-reverse"
      src={`out_data/${data.samples?.[0]}`}
      autoPlay={false}
      autoPlayAfterSrcChange={true}
      onPlay={e => { }}
    />

  </MecchiNode>
}; 