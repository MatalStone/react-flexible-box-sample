import React from 'react'
import { getBoxSize } from 'pure-functions/flexible-box/constant';
import { useDrag } from 'react-dnd';
import { InitialBoxProps } from 'types/flexible-box/props'

const { width, height } = getBoxSize()

function InitialBox({itemBox}: InitialBoxProps) {
    const [, drag] = useDrag(
        {
          type: "initialBox",
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
            cursor: "pointer",
            boxSizing: "border-box"
        }}>
            {itemBox.text}
    </div>)
}

export default InitialBox;
