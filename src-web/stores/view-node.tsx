import { Handle, Position } from "reactflow";
import { tw } from "twind";
import { css } from "@emotion/react";
import { useMecchiNodeStore } from "./node-store";
import MecchiNode from "../canvas/node-base";
import { MecchiIO, MecchiKV, MecchiNodeInfo } from "./nodes";

const handles: Record<string, string> = {
  'ignition': '🟠',
  'text': '🔵',
  'sound': '🟢',
  'tensor': '🟡',
  'any': '🟣',
  'undefined': '🔴',
};

export const PowerHandle = ({ id }: { id: string }) => {
  return <Handle id={`${id}-power`} type="target" style={{ bottom: -5, width: 5, height: 5 }} position={Position.Bottom} css={css`
    &.target::after { content: '${handles["ignition"]}'; position: absolute; top: -8px; left: -5px; font-size: 10px; }`}>
  </Handle>
}

export const InputHandle = ({ id, index, io }: { id: string, index: number, io: MecchiIO }) => {
  return <Handle id={`${id}-input-${index}`} type="target" style={{ top: 35 + 20 * index, width: 5, height: 5 }} position={Position.Left} css={css`
    &.target::after { content: '${handles[io.type]}'; position: absolute; top: ${-6}px; left: -4px; font-size: 10px; }`}>
    <span style={{ position: 'absolute', fontSize: 12, marginLeft: 13, top: -8, fontFamily: 'monospace', width: 'max-content' }}>{io.name}</span>
  </Handle>
}

export const OutputHandle = ({ id, index, io }: { id: string, index: number, io: MecchiIO }) => {
  return <Handle id={`${id}-output-${index}`} type="source" style={{ top: 35 + 20 * index, width: 5, height: 5 }} position={Position.Right} css={css`
    &.source::after { content: '${handles[io.type]}'; position: absolute; top: -6px; left: -7px; font-size: 10px; }`}>
    <span style={{ position: 'relative', fontSize: 12, marginRight: 13, top: -8, fontFamily: 'monospace', width: 'max-content', float: 'right' }}>{io.name}</span>
  </Handle>
}

export function createMecchiNodeView(node: MecchiNodeInfo) {
  const selector = (id: string) => (store: any) => ({
    setParams: (key: string, value: any) => store.updateNode(id, { [key]: value }),
  });

  return function MecchiDynamicNode({ id, data }: { id: string, data: MecchiKV }) {
    const { setParams } = useMecchiNodeStore(selector(id));
    const offset = 20 * Math.max(node.inputs.length, node.outputs.length) - 30;

    return <MecchiNode title={node.title} id={id}>
      <PowerHandle id={id} />

      {node.inputs.map((input, index) => {
        return <InputHandle key={`input-${index}`} id={id} index={index} io={input} />
      })}

      {node.outputs.map((output, index) => {
        return <OutputHandle key={`output-${index}`} id={id} index={index} io={output} />
      })}

      <div className={`${tw`flex flex-col p-2`} nodrag`} style={{ marginTop: offset }}>
        {node.units.map((unit, index) => {
          if (unit.type == 'line') {
            return <div key={`unit-${index}`} className={`${tw`flex`}`}>
              <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>{unit.title}</label>
              <input className={tw('text-sm h-6 flex-1 border-blue-200 border-1 rounded px-1 focus:outline-none')}
                type="text" value={data[unit.name]} onChange={e => setParams(unit.name, e.target.value)} />
            </div>
          } else if (unit.type == 'multiline') {
            return <div key={`unit-${index}`} className={`${tw`flex`}`}>
              <textarea id="message" defaultValue={data.prompt} rows={6} style={{ minWidth: 400, resize: 'none' }} className={`${tw`block m-2 p-2 text-sm text-gray-900 focus:outline-none bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}`}
                placeholder={unit.title} onChange={e => setParams(unit.name, e.target.value)}>
              </textarea>
            </div>
          } else if (unit.type == 'number') {
            return <div key={`unit-${index}`} className={`${tw`flex`}`}>
              <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>{unit.title}</label>
              <input className={tw('text-sm h-6 flex-1 border-blue-200 border-1 rounded px-1 focus:outline-none')}
                type="number" min={unit.range?.min} max={unit.range?.max} step={unit.range?.step} value={data[unit.name]} onChange={e => setParams(unit.name, e.target.value)} />
            </div>
          } else if (unit.type == 'list') {
            return <div key={`unit-${index}`} className={`${tw`flex`}`}>
              <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>{unit.title}</label>
              <select value={data[unit.name]} onChange={e => setParams(unit.name, e.target.value)}
                className={tw('text-sm h-6 flex-1 border-blue-200 border-1 rounded px-1 focus:outline-none')}>
                {unit.values!.map((value, valueIndex) => {
                  return <option value={value} key={`value-${valueIndex}`}>{value}</option>
                })}
              </select>
            </div>
          } else if (unit.type == 'bool') {
            return <div key={`unit-${index}`} className={`${tw`flex`}`}>
              <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>{unit.title}</label>
              <input type="checkbox" checked={data[unit.name]} onChange={e => setParams(unit.name, e.target.checked)}
                className={tw('text-sm h-6 border-blue-200 border-1 rounded px-1 focus:outline-none')} />
            </div>
          }
        })}
      </div>
    </MecchiNode>
  };
}