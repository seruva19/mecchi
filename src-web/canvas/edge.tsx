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

  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeRemove = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <Global
        styles={css`
        .contexify {
          font-size: 12px;
          line-height: 12px;
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
