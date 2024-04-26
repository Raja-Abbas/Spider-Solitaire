import React, { useState, useEffect } from 'react';
import DraggableItem from './components/DraggableItem';
import Timer from './components/Timer'
import Image1 from './assets/Image2.png'
import SpiderSolitaireRulesPopup from './components/spidersolitairepopup';
import ReactPlayer from 'react-player'

import './index.css';

const App = () => {
  const [droppedItem, setDroppedItem] = useState(null);
  const [showRulesPopup, setShowRulesPopup] = useState(true);

  const handleDrop = (item) => {
    setDroppedItem(item);
    setKey(Date.now());
  };

  const [key, setKey] = useState(Date.now()); 

  const handleCloseRulesPopup = () => {
    setShowRulesPopup(false);
  };

  useEffect(() => {
    if (!showRulesPopup) {
      // Execute after 3 seconds
      const timeoutId = setTimeout(() => {
        // Trigger draggable item action here
        // For example:
        console.log('Run draggable after 3 seconds');
      }, 10000);

      // Cleanup function
      return () => clearTimeout(timeoutId);
    }
  }, [showRulesPopup]);

  return (
    <div className='max-xl:hidden xl:mx-auto overflow-hidden border-black border relative w-[100%] flex justify-between h-screen xl:px-2'>
      {showRulesPopup && <SpiderSolitaireRulesPopup onClose={handleCloseRulesPopup} />}
      <DraggableItem onDrop={handleDrop} />
      <Timer/>
      <div className='shadow-2xl absolute p-3 bg-black rounded-lg bottom-10 right-5 flex flex-col gap-2'>
        <img className='hover:w-[200px] hover:h-[270px] transition-all shadow-2xl w-[130px] h-[200px]' src={Image1} alt="Image"/>
      </div>
      <div className="video-container">
        <video loop autoPlay muted className='w-screen h-screen scale-115 video-container2'>
          <source src="Video/Video.mp4" type="video/mp4" />
          Sorry, your browser doesn't support videos.
        </video>
      </div>
    </div>
  );
};

export default App;
