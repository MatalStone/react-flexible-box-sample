export function getPosition (
    draggingItem: { top: number, left: number, width: number, height: number},
    areaRect?: {width: number, height: number},
    differenceOffset?: {x: number, y: number} | null)
{
    if(differenceOffset == null || areaRect == null) {
        return {
            top: 0,
            left: 0
        }
    }

    const widthPixel = areaRect.width * (draggingItem.width / 100)
    const heightPixel = areaRect.height * (draggingItem.height / 100)

    const maxTopPixel = areaRect.height - heightPixel
    const maxLeftPixel = areaRect.width - widthPixel

    const initialTopPixel = areaRect.height * (draggingItem.top / 100)
    const initialLeftPixel = areaRect.width * (draggingItem.left / 100)

    let topPixel = initialTopPixel + differenceOffset.y
    let leftPixel = initialLeftPixel + differenceOffset.x

    if(topPixel < 0) {
        topPixel = 0  
    } else if(topPixel > maxTopPixel) {
        topPixel = maxTopPixel
    }

    if(leftPixel < 0) {
        leftPixel = 0
    } else if(leftPixel > maxLeftPixel) {
        leftPixel = maxLeftPixel
    }

    const top = (topPixel / areaRect.height) * 100
    const left = (leftPixel / areaRect.width) * 100

    return {
        top,
        left,
    }
}