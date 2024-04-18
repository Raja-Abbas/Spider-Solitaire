import React, { useState } from 'react';

// Importing spades cards
import Spades1 from '../assets/Cards/Suit=Spades, Number=Ace.svg';
import Spades2 from '../assets/Cards/Suit=Spades, Number=2.svg';
import Spades3 from '../assets/Cards/Suit=Spades, Number=3.svg';
import Spades4 from '../assets/Cards/Suit=Spades, Number=4.svg';
import Spades5 from '../assets/Cards/Suit=Spades, Number=5.svg';
import Spades6 from '../assets/Cards/Suit=Spades, Number=6.svg';
import Spades7 from '../assets/Cards/Suit=Spades, Number=7.svg';
import Spades8 from '../assets/Cards/Suit=Spades, Number=8.svg';
import Spades9 from '../assets/Cards/Suit=Spades, Number=9.svg';
import Spades10 from '../assets/Cards/Suit=Spades, Number=10.svg';
import Spades11 from '../assets/Cards/Suit=Spades, Number=Jack.svg';
import Spades12 from '../assets/Cards/Suit=Spades, Number=Queen.svg';
import Spades13 from '../assets/Cards/Suit=Spades, Number=King.svg';

const DropZone = ({ onDrop, onDragOver }) => {
  const [tableau, setTableau] = useState([
    [],[],[], [], [], [], []
  ]);
  const [foundations, setFoundations] = useState(Array(4).fill([]));

  const getColor = (card) => {
    if (
      card === Spades1 || card === Spades2 || card === Spades3 || card === Spades4 ||
      card === Spades5 || card === Spades6 || card === Spades7 || card === Spades8 ||
      card === Spades9 || card === Spades10 || card === Spades11 || card === Spades12 || card === Spades13
    ) {
      return 'black';
    }
    return null;
  };

  const handleDrop = (e, stackIndex, isTableau) => {
    e.preventDefault();
    const imageUrl = e.dataTransfer.getData('text/plain');
  
    if (isTableau) {
      const draggedCardColor = getColor(imageUrl);
      const topCard = tableau[stackIndex][tableau[stackIndex].length - 1];
  
      if (!topCard || canPlaceCard(imageUrl, topCard)) {
        const updatedTableau = [...tableau];
        updatedTableau[stackIndex] = [...updatedTableau[stackIndex], imageUrl];
        setTableau(updatedTableau);
      }
    } else {
      const updatedFoundations = [...foundations];
      updatedFoundations[stackIndex] = [...updatedFoundations[stackIndex], imageUrl];
      setFoundations(updatedFoundations);
    }
  
    onDrop(imageUrl);
  };
  
  const canPlaceCard = (card1, card2) => {
    const cardValue1 = getCardValue(card1);
    const cardColor1 = getColor(card1);
    const cardValue2 = getCardValue(card2);
    const cardColor2 = getColor(card2);
  
    return cardValue1 === cardValue2 - 1;
  };
  
  const getCardValue = (card) => {
    return parseInt(card.split('=')[2].split('.')[0], 10);
  };
  

  return (
    <div className='h-auto flex flex-col items-center w-[70%]'>
      {/* Render Foundations */}
      <div className='pt-[10px] flex gap-5'>
        {foundations.map((stack, stackIndex) => (
          <div
            key={stackIndex}
            className='w-[120px] h-[150px] flex justify-center items-center border border-gray-700 text-center rounded-lg'
            onDrop={(e) => handleDrop(e, stackIndex, false)}
            onDragOver={(e) => e.preventDefault()}
          >
            {stack.map((card, cardIndex) => (
              <img
                key={cardIndex}
                src={card}
                alt={`Foundation Card ${stackIndex}-${cardIndex}`}
                className='w-auto h-auto'
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            ))}
          </div>
        ))}
      </div>
      {/* Render Tableau */}
      <div className='flex gap-5 items-end pt-[10px]'>
        {tableau.map((stack, stackIndex) => (
          <div
            key={stackIndex}
            className='relative w-[120px] h-[150px] flex justify-center items-center border border-gray-700 text-center rounded-lg'
            onDrop={(e) => handleDrop(e, stackIndex, true)}
            onDragOver={(e) => e.preventDefault()}
          >
            {stack.map((card, cardIndex) => (
              <img
                key={cardIndex}
                src={card}
                alt={`Tableau Card ${stackIndex}-${cardIndex}`}
                className='w-[100px] h-[150px] absolute'
                draggable={cardIndex === stack.length - 1}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  top: `${cardIndex * 28}px`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
      
      
    </div>
  );
};

export default DropZone;
