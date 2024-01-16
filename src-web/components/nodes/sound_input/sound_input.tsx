import { MecchiNodeStore, useMecchiNodeStore } from "../../../stores/node-store";
import { Handle, Position } from "reactflow";
import MecchiNode from "../../../canvas/node-base";
import { tw } from "twind";
import { MecchiKV } from "../../../stores/nodes";
import Uploady, { useFileInput, useItemFinishListener } from "@rpldy/uploady";
import UploadButton from "@rpldy/upload-button";
import { useRef } from "react";
import { useMecchiUIStore } from "../../../stores/ui-store";
import { OutputHandle, PowerHandle } from "../../../stores/view-node";
import { Global, css } from "@emotion/react";

const MecchiSoundInputNodeInfo = {
  type: 'sound-input',
  group: ['io'],
  view: MecchiSoundInputNode,
  data: {
    soundpath: undefined
  },

  transform: function (inputs: MecchiKV, state: MecchiKV): Promise<MecchiKV> {
    return Promise.resolve({ samples: [state.soundpath] });
  }
}

export default MecchiSoundInputNodeInfo;

const selector = (id: string) => (store: MecchiNodeStore) => ({
  setSound: (file: string) => store.updateNode(id, { soundpath: file }),
});

const UploadInput = ({ id }: { id: string }) => {
  const { success, error } = useMecchiUIStore();
  const { setSound } = useMecchiNodeStore(selector(id));

  const inputRef = useRef<any>();
  useFileInput(inputRef);

  useItemFinishListener(item => {
    const { data: { mecchi, file } } = item.uploadResponse;

    if (mecchi == '👍') {
      setSound(file);
      success('Upload successful')
    } else {
      error('Upload failed');
    }
  });

  return <form method="POST">
    <input type="file" name="sound" style={{ display: "none" }} ref={inputRef} />
  </form>;
};

export function MecchiSoundInputNode({ id, data }: { id: string, data: any }) {
  return <MecchiNode title="Sound input" id={id}>
    <PowerHandle id="soundinput" />
    <OutputHandle index={0} id="soundinput" io={{ name: 'sample', type: "sound" }} />

    <div className={`${tw`flex flex-col p-2`} nodrag upload-panel`} style={{ width: 200 }}>
      <Global styles={css`
      .upload-panel button {
        background-color: #f1f5f9;
      }
    `} />
      <Uploady customInput destination={{ url: "/mecchi/upload", method: 'POST' }}>
        <UploadInput id={id} />
        <UploadButton />
      </Uploady>
    </div>
  </MecchiNode>
}; 