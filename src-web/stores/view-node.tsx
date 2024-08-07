import { tw } from "twind";
import { Global, css } from "@emotion/react";
import { MecchiNodeStore, useMecchiNodeStore } from "./node-store";
import MecchiNode from "../workflow/node-base";
import { MecchiIO, MecchiKV, MecchiNodeInfo } from "./nodes";
import { Handle, Position } from "@xyflow/react";

const handle: Record<string, string> = {
  'inactive': '⚪',
  'ignition': '🟠',
  'text': '🔵',
  'sound': '🟢',

  'module': '🟡',
  'any': '🟣',
  'undefined': '🔴',
};

const selector = (id: string) => (store: MecchiNodeStore) => ({
  setParams: (key: string, value: any) => store.updateNode(id, { [key]: value }),
  handles: store.handles
});

export const PowerHandle = ({ id }: { id: string }) => {
  const { handles } = useMecchiNodeStore(selector(id));
  const connected = handles.indexOf(`${id}-power`) !== -1;

  return <Handle id={`${id}-power`} type="target" style={{ bottom: -2, width: 5, height: 5 }} position={Position.Bottom} css={css`
    &.target::after { content: '${connected ? handle["ignition"] : handle["inactive"]}'; position: absolute; top: -8px; left: -5px; font-size: 10px;`}>
  </Handle>
}

export const InputHandle = ({ id, index, io }: { id: string, index: number, io: MecchiIO }) => {
  const { handles } = useMecchiNodeStore(selector(id));
  const connected = handles.indexOf(`${id}-input-${index}`) !== -1;

  return <Handle id={`${id}-input-${index}`} type="target" style={{ top: 35 + 20 * index, width: 5, height: 5 }} position={Position.Left} css={css`
    &.target::after { content: '${connected ? handle[io.type] : handle["inactive"]}'; position: absolute; top: ${-6}px; left: -4px; font-size: 10px;`}>
    <span style={{ position: 'absolute', fontSize: 12, marginLeft: 13, top: -8, fontFamily: 'monospace', width: 'max-content' }}>{io.name}</span>
  </Handle>
}

export const OutputHandle = ({ id, index, io }: { id: string, index: number, io: MecchiIO }) => {
  const { handles } = useMecchiNodeStore(selector(id));
  const connected = handles.indexOf(`${id}-output-${index}`) !== -1;

  return <Handle id={`${id}-output-${index}`} type="source" style={{ top: 35 + 20 * index, width: 5, height: 5 }} position={Position.Right} css={css`
    &.source::after { content: '${connected ? handle[io.type] : handle["inactive"]}'; position: absolute; top: -6px; left: -7px; font-size: 10px;`}>
    <span style={{ position: 'relative', fontSize: 12, marginRight: 13, top: -8, fontFamily: 'monospace', width: 'max-content', float: 'right' }}>{io.name}</span>
  </Handle>
}

export function createMecchiNodeView(node: MecchiNodeInfo) {
  return function MecchiDynamicNode({ id, data }: { id: string, data: MecchiKV }) {
    const { setParams, handles } = useMecchiNodeStore(selector(id));
    const offset = 20 * Math.max(node.inputs.length, node.outputs.length) - 30;

    return <MecchiNode title={node.title} id={id}>
      <Global
        styles={css`
  
        `}
      />
      <PowerHandle id={id} />

      {node.inputs.map((input, index) => {
        return <InputHandle key={`input-${index}`} id={id} index={index} io={input} />
      })}

      {node.outputs.map((output, index) => {
        return <OutputHandle key={`output-${index}`} id={id} index={index} io={output} />
      })}

      <div className={`${tw`flex flex-col p-2`} nodrag`} style={{ marginTop: offset }}>
        {node.params.map((param, index) => {
          if (param.type == 'line') {
            return <div key={`param-${index}`} className={`${tw`flex`}`}>
              <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>{param.title}</label>
              <input className={tw('text-sm h-6 flex-1 border-blue-200 border-1 rounded px-1 focus:outline-none')}
                type="text" value={data[param.name]} onChange={e => setParams(param.name, e.target.value)} />
            </div>
          } else if (param.type == 'multiline') {
            return <div key={`param-${index}`} className={`${tw`flex`}`}>
              <textarea id="message" defaultValue={data.prompt} rows={5} style={{ minWidth: 400, resize: 'none', fontSize: 14 }} className={`${tw`block mx-2 my-0 p-2 text-sm text-gray-900 focus:outline-none bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}`}
                placeholder={param.title} onChange={e => setParams(param.name, e.target.value)}>
              </textarea>
            </div>
          } else if (param.type == 'number') {
            return <div key={`param-${index}`} className={`${tw`flex`}`}>
              <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>{param.title}</label>
              <input className={tw('text-sm h-6 flex-1 border-blue-200 border-1 rounded px-1 focus:outline-none')}
                type="number" min={param.range?.min} max={param.range?.max} step={param.range?.step} value={data[param.name]} onChange={e => setParams(param.name, e.target.value)} />
            </div>
          } else if (param.type == 'list') {
            return <div key={`param-${index}`} className={`${tw`flex`}`}>
              <label className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>{param.title}</label>
              <select value={data[param.name]} onChange={e => setParams(param.name, e.target.value)}
                className={tw('text-sm h-6 flex-1 border-blue-200 border-1 rounded px-1 focus:outline-none')}>
                {param.values!.map((value, valueIndex) => {
                  return <option value={value} key={`value-${valueIndex}`}>{value}</option>
                })}
              </select>
            </div>
          } else if (param.type == 'bool') {
            return <div key={`param-${index}`} className={`${tw`flex`}`}>
              <label htmlFor={`${id}-checkbox-input-${index}`} className={tw('px-2 py-1 mb-2 gap-2 text-sm')}>{param.title}</label>
              <input id={`${id}-checkbox-input-${index}`} type="checkbox" checked={data[param.name]} onChange={e => setParams(param.name, e.target.checked)}
                className={tw('text-sm h-6 border-blue-200 border-1 rounded px-1 focus:outline-none')} />
            </div>
          }
        })}
      </div>
    </MecchiNode>
  };
}