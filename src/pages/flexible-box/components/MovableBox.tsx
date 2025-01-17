import React, { useEffect, useState } from 'react'
import { Resizable } from 're-resizable'
import { MovableBoxProps } from 'types/flexible-box/props'
import { InitialBounds, ResizedItemBoxData } from 'types/flexible-box/movable-box'
import { DragSourceMonitor, useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

function MovableBox({
        itemBox,
        onResize,
        draggingPosition,
        onEndDrag,
    }: MovableBoxProps) {
    const [initialBounds, setInitialBounds] = useState({
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: 0,
        height: 0,
        maxWidth: undefined,
        maxHeight: undefined,
    } as InitialBounds);

    const [{ isDragging }, drag, preview] = useDrag(
        {
          type: "movableBox",
          item: itemBox,
          collect: (monitor: DragSourceMonitor) => ({
            isDragging: monitor.isDragging(),
          }),
          end: ({serialNo}) => {
                onEndDrag(serialNo, draggingPosition.top, draggingPosition.left)
            }
        },
        [itemBox, draggingPosition]
    );

    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true })
      }, [preview])

    return (
        <Resizable
            size={{
                width: `${itemBox.width}%`,
                height: `${itemBox.height}%`,
            }}
            minWidth={30}
            minHeight={30}
            maxWidth={
                initialBounds.maxWidth == null ? undefined : `${initialBounds.maxWidth}%`
            }
            maxHeight={
                initialBounds.maxHeight == null ? undefined : `${initialBounds.maxHeight}%`
            }
            style={{
                position: "absolute",
                top: `${itemBox.top}%`,
                left: `${itemBox.left}%`,
                display: "flex",
                verticalAlign: "middle",
                textAlign: "center",
                justifyContent: "center",
                border: `2px dashed ${itemBox.color}`,
                cursor: "move",
                opacity: isDragging ? 0 : 1
            }}
            onResizeStart={(_, direction, element) => {
                const newTop = Number(element.style.top.slice(0, -1));
                const newLeft = Number(element.style.left.slice(0, -1));
                const newWidth = Number(element.style.width.slice(0, -1));
                const newHeight = Number(element.style.height.slice(0, -1));
                const newBottom = newTop + newHeight;
                const newRight = newLeft + newWidth;
                let maxWidth = 0;
                let maxHeight = 0;
                switch (direction) {
                    case "top": {
                        maxWidth = newWidth;
                        maxHeight = newBottom;
                        break;
                    }
                    case "left": {
                        maxWidth = newRight;
                        maxHeight = newHeight;
                        break;
                    }
                    case "topLeft": {
                        maxWidth = newRight;
                        maxHeight = newBottom;
                        break;
                    }
                    case "bottomLeft": {
                        maxWidth = newRight;
                        maxHeight = 100 - newTop;
                        break;
                    }
                    case "topRight": {
                        maxWidth = 100 - newLeft;
                        maxHeight = newBottom;
                        break;
                    }
                    case "bottom": {
                        maxWidth = newWidth;
                        maxHeight = 100 - newTop;
                        break;
                    }
                    case "right": {
                        maxWidth = 100 - newLeft;
                        maxHeight = newHeight;
                        break;
                    }
                    case "bottomRight": {
                        maxWidth = 100 - newLeft;
                        maxHeight = 100 - newTop;
                        break;
                    }
                }
                setInitialBounds({
                    top: newTop,
                    left: newLeft,
                    bottom: newBottom,
                    right: newRight,
                    width: newWidth,
                    height: newHeight,
                    maxWidth,
                    maxHeight,
                });
            }}
            onResize={(_, direction, el) => {
                const newWidth = Number(el.style.width.slice(0, -1));
                const newHeight = Number(el.style.height.slice(0, -1));
                let box: ResizedItemBoxData = {
                    serialNo: 0,
                    top: 0,
                    left: 0,
                    width: 0,
                    height: 0,
                };
                switch (direction) {
                    case "top":
                    case "left":
                    case "topLeft": {
                        const newTop = Math.max(
                            0,
                            initialBounds.top -
                                (newHeight - initialBounds.height)
                        );
                        const newLeft = Math.max(
                            0,
                            initialBounds.left -
                                (newWidth - initialBounds.width)
                        );
                        box = {
                            serialNo: itemBox.serialNo,
                            top: newTop,
                            left: newLeft,
                            width: initialBounds.right - newLeft,
                            height: initialBounds.bottom - newTop,
                        };
                        break;
                    }
                    case "bottomLeft": {
                        const newLeft = Math.max(
                            0,
                            initialBounds.left -
                                (newWidth - initialBounds.width)
                        );
                        box = {
                            serialNo: itemBox.serialNo,
                            top: initialBounds.top,
                            left: newLeft,
                            width: newWidth,
                            height: newHeight,
                        };
                        break;
                    }
                    case "topRight": {
                        const newTop = Math.max(
                            0,
                            initialBounds.top -
                                (newHeight - initialBounds.height)
                        );
                        box = {
                            serialNo: itemBox.serialNo,
                            top: newTop,
                            left: initialBounds.left,
                            width: newWidth,
                            height: newHeight,
                        };
                        break;
                    }
                    case "bottom":
                    case "right":
                    case "bottomRight":
                        box = {
                            serialNo: itemBox.serialNo,
                            top: initialBounds.top,
                            left: initialBounds.left,
                            width: newWidth,
                            height: newHeight,
                        };
                        break;
                }

                onResize(box);
            }}
            onResizeStop={() => {
                setInitialBounds({
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    width: 0,
                    height: 0,
                    maxWidth: undefined,
                    maxHeight: undefined,
                });
            }}
            >
                <div
                    ref={drag}
                    style={{
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    {itemBox.text}
                </div>
        </Resizable>
    )
}

export default MovableBox;
