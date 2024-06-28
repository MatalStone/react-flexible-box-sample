import React, { useState, useRef, useMemo } from 'react'
import { indexGenerator } from 'pure-functions/common/util';
import { getBoxSize } from 'pure-functions/flexible-box/constant';
import { useDrop, useDragLayer } from 'react-dnd';
import { DraggableBox, DraggedBox } from 'types/flexible-box/common';
import MovableBox from './MovableBox';
import { ResizedItemBoxData } from 'types/flexible-box/movable-box';
import MovableBoxPreview from './MovableBoxPreview';

const getSerialNo = indexGenerator(1)

const { width, height } = getBoxSize()

function Container() {
    const [boxes, setBoxes] = useState([] as DraggedBox[])
    const dropAreaRef = useRef<HTMLDivElement | null>(null)

    const rect = dropAreaRef.current == null ? undefined : dropAreaRef.current.getBoundingClientRect()

    const [, dropInitialBox] = useDrop(
        () => ({
          accept: "initialBox",
          drop(item: DraggableBox, monitor) {
            const clientOffset = monitor.getClientOffset();
            if(clientOffset == null || rect == null){
                return
            }
            const topPixel = clientOffset.y - rect.top - (height/2)
            const leftPixel = clientOffset.x - rect.left - (width/2)
            const box = {
                serialNo: getSerialNo(),
                text: item.text,
                color: item.color,
                top: (topPixel / rect.height) * 100,
                left: (leftPixel / rect.width) * 100,
                width: (width / rect.width) * 100,
                height: (height / rect.height) * 100
            }
            setBoxes([...boxes, box])
          }
        }),
        [boxes, setBoxes, rect]
      );

    const [, dropMovableBox] = useDrop(
        () => ({
          accept: "movableBox",
          drop(item: DraggableBox, monitor) {
            console.log("move")
          }
        }),
        []
    );

    const { itemType, isDragging, item, differenceOffset } =
        useDragLayer((monitor) => ({
            item: monitor.getItem() as DraggedBox,
            itemType: monitor.getItemType(),
            differenceOffset: monitor.getDifferenceFromInitialOffset(),
            isDragging: monitor.isDragging(),
        }))

    const isMoving = isDragging && itemType === "movableBox"

    const position = useMemo(() => {
        if(differenceOffset == null || rect == null) {
            return {
                top: 0,
                left: 0,
                width: 0,
                height: 0
            }
        }
        const widthPixel = rect.width * (item.width / 100)
        const heightPixel = rect.height * (item.height / 100)

        const initialTopPixel = rect.height * (item.top / 100)
        const initialLeftPixel = rect.width * (item.left / 100)

        const topPixel = initialTopPixel + differenceOffset.y
        const leftPixel = initialLeftPixel + differenceOffset.x

        return {
            top: topPixel,
            left: leftPixel,
            width: widthPixel,
            height: heightPixel
        }
    }, [item, differenceOffset, rect])
      
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
                    />
                ))}
            {isMoving ?
                <MovableBoxPreview
                    itemBox={
                        {...item,
                        ...position
                    }} /> : null}
    </div>)
}

export default Container
