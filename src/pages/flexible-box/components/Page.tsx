import React from 'react'
import { indexGenerator } from 'pure-functions/common/util';
import { DraggableBox } from 'types/flexible-box/common';
import InitialBox from './InitialBox'
import Container from './Container'

const getSerialNo = indexGenerator(1)

const itemBoxes: DraggableBox[] = [
    { serialNo: getSerialNo(), text: "Blueberry", color: '#3f51b5' },
    { serialNo: getSerialNo(), text: "Apple", color: '#f44336' },
    { serialNo: getSerialNo(), text: "Orange", color: '#ff9800'},
]

function Page() {      
    return (
    <div>
        <div style={{
            display: "flex",
            height: 40,
        }}>
            {itemBoxes.map(box => (
                <InitialBox
                    key={box.serialNo}
                    itemBox={box} />))
            }
        </div>
        <Container />
    </div>)
}

export default Page;
