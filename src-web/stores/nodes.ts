import { MecchiEnvironmentNodeInfo } from '../components/nodes/environment';
import { MecchiUpsamplerNodeInfo } from '../components/nodes/upsampler';
import { MecchiPlaybackNodeInfo } from '../components/nodes/playback';
import { MecchiPromptNodeInfo } from '../components/nodes/prompt';
import { MecchiMusicGenNodeInfo } from '../components/nodes/musicgen';
import { MecchiSoundUploadNodeInfo } from '../components/nodes/sound_upload';
import { MecchiBypassNodeInfo } from '../components/nodes/bypass';

export type MecchiKV = { [key: string]: any };

export interface MecchiNode {
  type: string;
  view: Function;
  data: MecchiKV;
  transform: (inputs: MecchiKV, state: MecchiKV) => Promise<MecchiKV>;
}

// TODO: nodes should be registered in external configuration file 
export const mecchiNodes: MecchiNode[] = [
  MecchiEnvironmentNodeInfo,
  MecchiPromptNodeInfo,
  MecchiMusicGenNodeInfo,
  MecchiUpsamplerNodeInfo,
  MecchiPlaybackNodeInfo,
  MecchiSoundUploadNodeInfo,
  MecchiBypassNodeInfo
];