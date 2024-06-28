export interface InitialBounds {
    top: number;
    left: number;
    bottom: number;
    right: number;
    width: number;
    height: number;
    maxWidth?: number;
    maxHeight?: number;
}

export interface ResizedItemBoxData {
    serialNo: number
    top: number
    left: number
    width: number
    height: number
}