import React, { useState, useRef } from 'react'
import { indexGenerator } from 'pure-functions/common/util';
import { getBoxSize } from 'pure-functions/flexible-box/constant';
import { useDrop } from 'react-dnd';
import { DraggableBox, DraggedBox } from 'types/flexible-box/common';
import MovableBox from './MovableBox';
import { ResizedItemBoxData } from 'types/flexible-box/movable-box';

const getSerialNo = indexGenerator(1)

const { width, height } = getBoxSize()

function Container() {
    const [boxes, setBoxes] = useState([] as DraggedBox[])
    const dropAreaRef = useRef<HTMLDivElement | null>(null)

    const [_, drop] = useDrop(
        () => ({
          accept: "box",
          drop(item: DraggableBox, monitor) {
            const clientOffset = monitor.getClientOffset();
            if(clientOffset == null || dropAreaRef.current == null){
                return
            }
            const rect = dropAreaRef.current.getBoundingClientRect()
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
        [boxes, setBoxes]
      );
      
    return (
    <div
        ref={(el) => {
            dropAreaRef.current = el
            drop(el)
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
    </div>)
}

export default Container
