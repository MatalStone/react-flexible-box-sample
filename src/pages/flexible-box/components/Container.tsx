import React, { useState } from 'react'
import { indexGenerator } from 'pure-functions/common/util';
import { getBoxSize } from 'pure-functions/flexible-box/constant';
import { useDrop } from 'react-dnd';
import { DraggableBox, DraggedBox } from 'types/flexible-box';

const getSerialNo = indexGenerator(1)

const { width, height } = getBoxSize()

function Container() {
    const [boxes, setBoxes] = useState([] as DraggedBox[])
    const [rect, setRect] = useState({top:0,left:0})

    const [collectedProps, drop] = useDrop(
        () => ({
          accept: "box",
          drop(item: DraggableBox, monitor) {
            const clientOffset = monitor.getClientOffset();
            if(clientOffset == null){
                return
            }
            const box = {
                serialNo: getSerialNo(),
                text: item.text,
                color: item.color,
                top: clientOffset.y - rect.top - (height/2),
                left: clientOffset.x - rect.left - (width/2)
            }
            setBoxes([...boxes, box])
          }
        }),
        [boxes, setBoxes]
      );
      
    return (
    <div
        ref={(el) => {
            if(el == null){
                return
            }
            const _rect = el.getBoundingClientRect()
            if(rect.top !== _rect.top || rect.left !== _rect.left){
                setRect({top:_rect.top,left:_rect.left})
            }
            drop(el)
        }}
        style={{
            position: "relative",
            border: "medium solid black",
            width: "100%",
            height: "calc(100vh - 64px)"
        }}>
            {boxes.map(box =>
            <div key={box.serialNo} style={{
                position: "absolute",
                top: box.top,
                left: box.left,
                display: "flex",
                verticalAlign: "middle",
                textAlign: "center",
                justifyContent: "center",
                border: `2px dashed ${box.color}`,
                width,
                height,
                marginRight: 8,
                cursor: "move"
            }}>
                {box.text}
            </div>)}            
    </div>)
}

export default Container