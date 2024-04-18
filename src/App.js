// App.js
import React, { useState } from 'react';
import DraggableItem from './components/DraggableItem';
import Timer from './components/Timer'
import Image1 from './assets/Image2.png'

import './index.css';

const App = () => {
  const [droppedItem, setDroppedItem] = useState(null);

  
  const handleDrop = (item) => {
    setDroppedItem(item);
    
    setKey(Date.now());
  };

  const [key, setKey] = useState(Date.now()); 

  const handleDragOver = () => {
  };

  return (
    <div className='max-xl:hidden xl:mx-auto bg-cyan-800 overflow-hidden	 border-black border relative w-[100%] flex justify-between h-screen px-2'>
      <DraggableItem onDrop={handleDrop} />
      <Timer/>
      <div  className='absolute bottom-10 right-10 flex flex-col gap-2'>
        <img className='w-[130px] h-[250px]' src={Image1} alt="Image"/>
      </div>
    </div>
  );
};

export default App;
