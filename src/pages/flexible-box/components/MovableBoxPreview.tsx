import React from 'react'
import { MovableBoxPreviewProps } from 'types/flexible-box/props';

function MovableBoxPreview({itemBox}: MovableBoxPreviewProps) {
    return (
    <div style={{
        pointerEvents: "none",
        position: "absolute",
        border: `2px dashed ${itemBox.color}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        top: `${itemBox.top}%`,
        left: `${itemBox.left}%`,
        width: `${itemBox.width}%`,
        height: `${itemBox.height}%`,
        boxSizing: "border-box",
    }}>
        {itemBox.text}
    </div>
    )
}

export default MovableBoxPreview;
