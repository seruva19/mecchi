import { MecchiNodeStore, useMecchiNodeStore } from "../../stores/node-store";
import { Handle, Position } from "reactflow";
import MecchiNode from "../node-base";
import { tw } from "twind";
import { MecchiKV } from "../../stores/nodes";
import Uploady, { useFileInput, useItemFinishListener } from "@rpldy/uploady";
import UploadButton from "@rpldy/upload-button";
import { useRef } from "react";
import { useMecchiViewStore } from "../../stores/view-store";

export const MecchiSoundUploadNodeInfo = {
  type: 'sound-upload',
  view: MecchiSoundUploadNode,
  data: {
    soundpath: undefined
  },

  transform: function (inputs: MecchiKV, state: MecchiKV): Promise<MecchiKV> {
    return Promise.resolve({ samples: [state.soundpath] });
  }
}

const selector = (id: string) => (store: MecchiNodeStore) => ({
  setSound: (file: string) => store.updateNode(id, { soundpath: file }),
});

const UploadInput = ({ id }: { id: string }) => {
  const { success, error } = useMecchiViewStore();
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

export default function MecchiSoundUploadNode({ id, data }: { id: string, data: any }) {
  return <MecchiNode title="Sound upload" id={id}>
    <Handle id="soundupload-a" className={`${tw`w-2 h-2`}`} type="target" style={{ top: 40, bottom: 'auto', background: 'orange' }} position={Position.Left}>
      <span className={`${tw`absolute font-bold text-xs ml-2 pr-1 pl-1 rounded`}`} style={{ marginTop: -7 }}>power</span>
    </Handle>

    <Handle id="soundupload-b" className={`${tw`w-2 h-2`}`} type="source" style={{ top: 30, bottom: 'auto', background: 'blue' }} position={Position.Right}>
      <span className={`${tw`font-bold text-xs float-right mr-3`}`} style={{ marginTop: -7 }}>sample</span>
    </Handle>

    <div className={`${tw`flex flex-col p-2`}`} style={{ width: 200 }}>
      <Uploady customInput destination={{ url: "/mecchi/upload", method: 'POST' }}>
        <UploadInput id={id} />
        <UploadButton />
      </Uploady>
    </div>
  </MecchiNode>
}; 