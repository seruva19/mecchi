import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from 'reactflow';
import { createPortal } from 'react-dom';
import { tw } from "twind";
import { Global, css } from '@emotion/react'
import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu
} from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import { nanoid } from 'nanoid';
import { useMecchiNodeStore } from '../stores/node-store';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const MENU_ID = `menu-edge${nanoid(2)}`;
  const { show, hideAll } = useContextMenu({
    id: MENU_ID
  });

  function handleItemClick({ event, props, triggerEvent, data }: any) {
    console.log(event, props, triggerEvent, data);
  }

  function displayMenu(e: any) {
    show({
      event: e
    });
  }

  const { setEdges, edges, setHandles, handles } = useMecchiNodeStore();
  const [edgePath, labelX, labelY, offsetX, offsetY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeRemove = () => {
    const leftEdges = edges.filter((edge) => edge.id !== id);
    const disconnectedEdge = edges.find((edge) => edge.id === id)!;
    const leftHandles = handles.filter(handle => disconnectedEdge.sourceHandle !== handle && disconnectedEdge.targetHandle !== handle);

    setEdges(leftEdges);
    setHandles(leftHandles);
  };

  return (
    <>
      <Global
        styles={css`
        .contexify {
          font-size: 12px;
          line-height: 12px;
        }
        `}
      />
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className=""
        >
          {createPortal(<>
            <Menu id={MENU_ID}>
              <Item onClick={onEdgeRemove}>
                Remove
              </Item>
            </Menu>
          </>,
            document.body)}
          <button onClick={displayMenu} style={{ outline: 'none', fontSize: 12 }}>⚙️</button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}