import React from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import FlexibleBox from './flexible-box'

function App() {
  return (
    <div className='App'>
      <DndProvider backend={HTML5Backend}>
        <FlexibleBox />
      </DndProvider>
    </div>
  );
}

export default App;
