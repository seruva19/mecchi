import React from "react";
import { MecchiKV } from "../../../stores/nodes";
import MecchiNode from "../../node-base";

const MecchiAudioLdm2NodeInfo = {
  type: 'audioldm2',
  view: MecchiAudioLdm2Node,
  data: {

  },

  transform: function (inputs: MecchiKV, state: MecchiKV): Promise<MecchiKV> {
    return Promise.resolve(inputs);
  }
}

export default MecchiAudioLdm2NodeInfo;

const selector = (id: string) => (store: any) => ({
  setParams: (key: string, value: any) => store.updateNode(id, { [key]: value }),
});

export const runInference = () => {

}

export function MecchiAudioLdm2Node({ id, data }: { id: string, data: MecchiKV }) {
  return <MecchiNode title="AudioLdm2" id={id}>
    <></>
  </MecchiNode>
};