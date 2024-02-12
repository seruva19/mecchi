import ky from 'ky';
import { createMecchiNodeView } from './view-node';

export type MecchiKV = { [key: string]: any };
export type MecchiIO = { name: string, type: 'ignition' | 'text' | 'sound' | 'tensor' | 'any' | 'undefined', required?: boolean };
export type MecchiUnit = { name: string, title: string, type: string, values?: any[], range?: { min: number, max: number, step: number } };
export type MecchiEvent = { halt: boolean };

export interface MecchiNodeInfo {
  type: string;
  title: string;
  group: string;
  view: Function;
  inputs: Array<MecchiIO>;
  outputs: Array<MecchiIO>;
  units: Array<MecchiUnit>;
  data: MecchiKV;
  transform: (inputs: MecchiKV, state: MecchiKV, event: MecchiEvent) => Promise<MecchiKV>;
}

let _mecchiNodes: MecchiNodeInfo[] | undefined = undefined;
export async function getMecchiNodes(): Promise<MecchiNodeInfo[]> {
  if (!_mecchiNodes) {
    _mecchiNodes = await loadMecchiNodes();
  }

  return _mecchiNodes;
}

async function loadMecchiNodes() {
  const mecchiNodes = [];

  const result: any = await ky.get('/mecchi/init', {
    timeout: false
  }).json();

  const { nodes: nodePaths } = result;

  for (const path of nodePaths) {
    const module = await import(/* @vite-ignore */ path);
    mecchiNodes.push(module.default);

    if (!module.default.view) {
      console.info('registered dynamic view for node: \'' + module.default.type + '\' (' + module.default.group + ')');
      module.default.view = createMecchiNodeView(module.default);
    }
  }

  return mecchiNodes;
}
