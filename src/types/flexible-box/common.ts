export interface DraggableBox {
    serialNo: number
    text: string
    color: string;
}

export interface DraggedBox {
    serialNo: number
    text: string
    color: string;
    top: number
    left: number
    width: number
    height: number
}
