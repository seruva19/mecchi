
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
import { useState } from 'react';
import { EdgeProps, getBezierPath, BaseEdge, EdgeLabelRenderer } from '@xyflow/react';

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

  const [shown, setShown] = useState(false);
  const { show, hideAll } = useContextMenu({
    id: MENU_ID
  });

  function handleItemClick({ event, props, triggerEvent, data }: any) {
    console.log(event, props, triggerEvent, data);
  }

  function displayMenu(e: any) {
    if (shown) {
      show({
        event: e
      });
    } else {
      hideAll();
    }

    setShown(!shown);
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
    const newEdges = edges.filter((edge) => edge.id !== id);
    const disconnectedEdge = edges.find((edge) => edge.id === id)!;
    const newHandles = handles.filter(handle => disconnectedEdge.sourceHandle !== handle && disconnectedEdge.targetHandle !== handle);

    setEdges(newEdges);
    setHandles(newHandles);
  };

  return (
    <>
      <Global
        styles={css`
        .contexify {
          font-size: 12px;
          line-height: 12px;
        }

        .flow-edge {
          /* opacity: 0; */
        }
        .flow-edge:hover {
          opacity: 1;
        }

        .flow-edge.front {
          zIndex: 1001,
        }
        `}
      />
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            // zIndex: 1001,
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            // transform: `translate(-50%, 0%) translate(${sourceX - 4}px,${sourceY - 10}px)`,
            fontSize: 12,
            // background: 'white',
            pointerEvents: 'all',
          }}
          className="flow-edge"
        >
          {createPortal(<>
            <Menu id={MENU_ID} style={{ marginTop: 10 }}>
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
