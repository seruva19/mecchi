import ky from 'ky';

export type MecchiKV = { [key: string]: any };

export interface MecchiNode {
  type: string;
  group: string;
  view: Function;
  data: MecchiKV;
  transform: (inputs: MecchiKV, state: MecchiKV) => Promise<MecchiKV>;
}

let _mecchiNodes: MecchiNode[] | undefined = undefined;
export async function getMecchiNodes(): Promise<MecchiNode[]> {
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
  }

  return mecchiNodes;
}