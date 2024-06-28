import { DragSourceMonitor } from "react-dnd";
import { DraggableBox, DraggedBox } from "./common";
import { ResizedItemBoxData } from "./movable-box";

export interface InitialBoxProps {
    itemBox: DraggableBox
}

export interface MovableBoxProps {
    itemBox: DraggedBox
    onResize: (box: ResizedItemBoxData) => void
    onEndDrag: (draggedItem: DraggedBox, monitor: DragSourceMonitor<DraggedBox, unknown>) => void
}

export interface MovableBoxPreviewProps {
    itemBox: DraggedBox
}