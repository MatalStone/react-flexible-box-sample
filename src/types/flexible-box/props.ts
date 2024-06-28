import { DragSourceMonitor } from "react-dnd";
import { DraggableBox, DraggedBox } from "./common";
import { ResizedItemBoxData } from "./movable-box";

export interface InitialBoxProps {
    itemBox: DraggableBox
}

export interface MovableBoxProps {
    itemBox: DraggedBox
    onResize: (box: ResizedItemBoxData) => void
    draggingPosition: {top: number, left: number}
    onEndDrag: (serialNo: number, top: number, left: number) => void
}

export interface MovableBoxPreviewProps {
    itemBox: DraggedBox
}