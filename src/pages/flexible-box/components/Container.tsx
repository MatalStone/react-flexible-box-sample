import React, { useState, useRef, useMemo } from 'react'
import { indexGenerator } from 'pure-functions/common/util';
import { getBoxSize } from 'pure-functions/flexible-box/constant';
import { useDrop, useDragLayer } from 'react-dnd';
import { DraggableBox, DraggedBox } from 'types/flexible-box/common';
import MovableBox from './MovableBox';
import { ResizedItemBoxData } from 'types/flexible-box/movable-box';
import MovableBoxPreview from './MovableBoxPreview';
import { getPosition } from 'pure-functions/flexible-box/container';

const getSerialNo = indexGenerator(1)

const { width, height } = getBoxSize()

function Container() {
    const [boxes, setBoxes] = useState([] as DraggedBox[])
    const dropAreaRef = useRef<HTMLDivElement | null>(null)
    const positionRef = useRef({top: 0, left: 0})

    const areaRect = dropAreaRef.current == null ? undefined : dropAreaRef.current.getBoundingClientRect()

    const [, dropInitialBox] = useDrop(
        () => ({
          accept: "initialBox",
          drop(item: DraggableBox, monitor) {
            const clientOffset = monitor.getClientOffset();
            if(clientOffset == null || areaRect == null){
                return
            }
            const topPixel = clientOffset.y - areaRect.top - (height/2)
            const leftPixel = clientOffset.x - areaRect.left - (width/2)
            const box = {
                serialNo: getSerialNo(),
                text: item.text,
                color: item.color,
                top: (topPixel / areaRect.height) * 100,
                left: (leftPixel / areaRect.width) * 100,
                width: (width / areaRect.width) * 100,
                height: (height / areaRect.height) * 100
            }
            setBoxes([...boxes, box])
          }
        }),
        [boxes, setBoxes, areaRect]
      );

    const [, dropMovableBox] = useDrop(
        () => ({
          accept: "movableBox",
        }),
        []
    );

    const { itemType, isDragging, draggingItem, differenceOffset } =
        useDragLayer((monitor) => ({
            draggingItem: monitor.getItem() as DraggedBox,
            itemType: monitor.getItemType(),
            differenceOffset: monitor.getDifferenceFromInitialOffset(),
            isDragging: monitor.isDragging(),
        }))

    const isMoving = isDragging && itemType === "movableBox"

    const position = useMemo(() => {
        positionRef.current = getPosition(draggingItem, areaRect, differenceOffset)
        return positionRef.current
    }, [draggingItem, areaRect, differenceOffset])
      
    return (
    <div
        ref={(el) => {
            dropAreaRef.current = el
            dropInitialBox(el)
            dropMovableBox(el)
        }}
        style={{
            position: "relative",
            border: "4px dashed black",
            width: "calc(100% - 8px)",
            height: "calc(100vh - 64px)"
        }}>
            {boxes.map(box => (
                <MovableBox
                    key={box.serialNo}
                    itemBox={box}
                    onResize={(box: ResizedItemBoxData) => {
                        const targetBox = boxes.find(b => b.serialNo === box.serialNo)
                        if(targetBox == null) {
                            return
                        }
                        const _box: DraggedBox = {
                            ...targetBox,
                            ...box
                        }
                        setBoxes([
                            ...boxes.filter(b => b.serialNo !== box.serialNo),
                            _box
                        ])
                    }}
                    onEndDrag={(draggedItem) => {
                        setBoxes([
                            ...boxes.filter(b => b.serialNo !== draggedItem.serialNo),
                            { ...draggedItem, ...positionRef.current }
                        ])
                        positionRef.current = { top:0, left:0}
                    }}
                    />
                ))}
            {isMoving ?
                <MovableBoxPreview
                    itemBox={
                        {...draggingItem,
                        ...position
                    }} /> : null}
    </div>)
}

export default Container
