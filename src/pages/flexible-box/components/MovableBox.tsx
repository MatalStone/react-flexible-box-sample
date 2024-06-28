import React, { useState } from 'react'
import { Resizable } from 're-resizable'
import { MovableBoxProps } from 'types/flexible-box/props'
import { InitialBounds, ResizedItemBoxData } from 'types/flexible-box/movable-box'

function MovableBox({
        itemBox,
        onResize
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

    return (
        <Resizable
            size={{
                width: `${itemBox.width}%`,
                height: `${itemBox.height}%`,
            }}
            minWidth={"2%"}
            minHeight={"2%"}
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
                cursor: "move"
            }}
            onResizeStart={(_, direction, element) => {
                const newTop = Number(element.style.top.slice(0, -1));
                const newLeft = Number(element.style.left.slice(0, -1));
                const newWidth = Number(element.style.width.slice(0, -1));
                const newHeight = Number(element.style.height.slice(0, -1));
                const newBottom = newTop + newHeight;
                const newRight = newLeft + newWidth;
                console.log(element.style, newTop, newLeft, newWidth, newHeight, newBottom, newRight)
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
                {itemBox.text}
        </Resizable>
    )
}

export default MovableBox;
