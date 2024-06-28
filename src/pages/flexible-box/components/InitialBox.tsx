import React from 'react'
import { getBoxSize } from 'pure-functions/flexible-box/constant';
import { useDrag } from 'react-dnd';
import { InitialBoxProps } from 'types/flexible-box/props'

const { width, height } = getBoxSize()

function InitialBox({itemBox}: InitialBoxProps) {
    const [_, drag] = useDrag(
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

export default InitialBox;
