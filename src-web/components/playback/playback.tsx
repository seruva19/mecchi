import { MecchiNodeStore, useMecchiNodeStore } from "../../stores/node-store";
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
    autoplay: true,
    samples: []
  },

  transform: function (inputs: MecchiKV, data: MecchiKV): Promise<MecchiKV> {
    return new Promise(resolve => {
      resolve(inputs);
    });
  }
}

export default MecchiPlaybackNodeInfo;

const selector = (id: string) => (store: any) => ({
  setParams: (key: string, value: any) => store.updateNode(id, { [key]: value }),
});

const customStyles = css`
  .rhap_container {
    box-shadow: none !important;
  }
`;

export function MecchiPlaybackNode({ id, data }: { id: string, data: any }) {
  const { setParams } = useMecchiNodeStore(selector(id));

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
      autoPlayAfterSrcChange={data['autoplay']}
      onPlay={e => { }}
    />
    <div className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50" style={{
      background: 'whitesmoke',
      margin: '0 10px',
      padding: 10
    }}>
      <div className={`${tw`flex`}`}>
        <label htmlFor={`${id}-checkbox-input-autoplay`} className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>Autoplay</label>
        <input id={`${id}-checkbox-input-autoplay`} type="checkbox" checked={data['autoplay']} onChange={e => setParams('autoplay', e.target.checked)}
          className={tw('text-sm h-6 border-blue-200 border-1 rounded px-1 focus:outline-none')} />

      </div></div>
  </MecchiNode>
}; 