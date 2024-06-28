import { getBoxSize } from 'pure-functions/flexible-box/constant';
import React from 'react'
import { useDrag } from 'react-dnd';
import { ItemBoxProps } from 'types/flexible-box'

const { width, height } = getBoxSize()

function ItemBoxComponent({itemBox}: ItemBoxProps) {
    const [collected, drag, dragPreview] = useDrag(
        {
          type: "box",
          item: itemBox
        },
        [itemBox]
    );

    return (
    <div
        ref={drag}
        style={{
            display: "flex",
            verticalAlign: "middle",
            textAlign: "center",
            justifyContent: "center",
            border: `2px dashed ${itemBox.color}`,
            width,
            height,
            marginRight: 8,
            cursor: "pointer"
        }}>
            {itemBox.text}
    </div>)
}

export default ItemBoxComponent;
