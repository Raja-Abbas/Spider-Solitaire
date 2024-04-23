import React, { useState, useEffect } from 'react';
import GoogleImage from '../assets/CardBack.png';
import CardBack from '../assets/CardBack.png'; // Add a card back image for face-down cards

// Import provided card images for Spades
import SpadesAce from '../assets/Cards/Suit=Spades, Number=Ace.svg';
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

const CombinedComponent = ({ onDrop }) => {
  const [tableau, setTableau] = useState(Array(7).fill([]));
  const [foundation, setFoundation] = useState(Array(3).fill([])); // Foundation piles
  const [dealCount, setDealCount] = useState(0);
  const [movesHistory, setMovesHistory] = useState([]);
  const recordMove = (before, after) => {
  setMovesHistory([...movesHistory, { before, after }]);
};
  const spadesCards = [SpadesAce, Spades2, Spades3, Spades4, Spades5, Spades6, Spades7, Spades8, Spades9, Spades10, Spades11, Spades12, Spades13];
  const maxDealCount = 10;

  const dealInitialCards = () => {
    const initialTableau = tableau.map((_, index) => {
      const cardsCount = 6; // Ensure max 6 cards for each stack
      const cards = Array.from({ length: cardsCount }, (_, i) => ({
        image: i === cardsCount - 1 ? spadesCards[Math.floor(Math.random() * spadesCards.length)] : CardBack,
        isVisible: i === cardsCount - 1 
      }));
      return cards;
    });
    setTableau(initialTableau);
  };
  
  useEffect(() => {
    dealInitialCards();
  }, []);

  const isDescending = (cards) => {
    for (let i = 1; i < cards.length; i++) {
      const currentRank = getRank(cards[i].image);
      const previousRank = getRank(cards[i - 1].image);
      if (currentRank !== previousRank - 1) {
        return false;
      }
    }
    return true;
  };

  const getRank = (cardImage) => {
    const filename = cardImage.split('/').pop(); 

    const rankMatch = filename.match(/Number=(\w+)/); // Match the rank part of the filename
    if (rankMatch && rankMatch[1]) {
      const rankStr = rankMatch[1]; // Extracted rank string
      // Convert rank string to numerical value
      switch (rankStr) {
        case 'Ace':
          return 1;
        case 'Jack':
          return 11;
        case 'Queen':
          return 12;
        case 'King':
          return 13;
        default:
          return parseInt(rankStr, 10); // Convert other ranks to integers
      }
    }
    return 0; // Return 0 if rank extraction fails
  };

  const handleSingleCardDragStart = (e, stackIndex, cardIndex) => {
    const selectedCards = tableau[stackIndex].slice(cardIndex);
    const isDescendingSequence = isDescending(selectedCards);
  
    // Check if the selected cards form a descending sequence
    if (isDescendingSequence) {
      e.dataTransfer.setData('text/plain', JSON.stringify({ stackIndex, cardIndex, selectedCards }));
    } else {
      console.log("Cannot drag cards that are not in descending order.");
      e.preventDefault(); // Prevent dragging if the cards are not in descending order
    }
  };
  
  const handleSingleCardDrop = (e, stackIndex) => {
  e.preventDefault();
  const cardData = JSON.parse(e.dataTransfer.getData('text/plain'));
  const targetStack = tableau[stackIndex];

  // Calculate the number of cards being moved
  const numMovedCards = cardData.selectedCards.length;

  // Check if the move is valid for moving the selected cards to the target stack
  if (isValidMultiCardMove(cardData.selectedCards, targetStack)) {
    const updatedTableau = tableau.map((stack, i) => {
      if (i === cardData.stackIndex) {
        return stack.slice(0, cardData.cardIndex); // Remove selected cards from the source stack
      } else if (i === stackIndex) {
        return [...stack, ...cardData.selectedCards]; // Add selected cards to the target stack
      }
      return stack;
    });

    // Update tableau state with the modified stacks
    setTableau(updatedTableau);

    // Record the move before updating the tableau state
    recordMove(tableau, updatedTableau);

    // Check for win condition
    checkForWin(updatedTableau);
  } else {
    console.log("Invalid move.");
  }
};

  
  const isValidMultiCardMove = (selectedCards, targetStack) => {
    if (selectedCards.length === 0) return false;
  
    const bottomCardRank = getRank(targetStack[targetStack.length - 1].image);
    const topCardRank = getRank(selectedCards[0].image);
  
    return bottomCardRank === topCardRank + 1;
  };
        
  
  const checkForWin = (tableau) => {
    console.log("Checking for win...");
  };

  const addCardToStacks = () => {
    const updatedTableau = tableau.map(stack => {
      if (stack.length < spadesCards.length) {
        const randomIndex = Math.floor(Math.random() * spadesCards.length);
        return [...stack, { image: spadesCards[randomIndex], isVisible: true }];
      }
      return stack;
    });
    setTableau(updatedTableau);
  };


  const handleClick = () => {
    if (dealCount < maxDealCount) {
      addCardToStacks();
      setDealCount(dealCount + 1);
    } else {
      console.log("You have reached the maximum deal count.");
    }
  };

  const handleReset = () => {
  dealInitialCards();
  setDealCount(0);
  setMovesHistory([]);
};

const handleUndo = () => {
  if (movesHistory.length > 0) {
    const lastMove = movesHistory.pop(); // Remove the last move from the history
    setTableau(lastMove.before); // Restore the tableau state to the state before the last move
    setMovesHistory([...movesHistory]); // Update the moves history after removing the last move
  } else {
    console.log("No moves to undo.");
  }
};

const handleFoundationDrop = (e, pileIndex) => {
  e.preventDefault();
  const cardData = JSON.parse(e.dataTransfer.getData('text/plain'));
  const targetPile = foundation[pileIndex];

  // Check if the move is valid for moving the selected cards to the foundation pile
  if (isValidFoundationMove(cardData.selectedCards, targetPile)) {
    // Update the foundation pile with the moved cards
    const updatedFoundation = [...foundation];
    updatedFoundation[pileIndex] = [...targetPile, ...cardData.selectedCards];
    setFoundation(updatedFoundation);

    // Remove the moved cards from the tableau
    const updatedTableau = tableau.map((stack, i) => {
      if (i === cardData.stackIndex) {
        return stack.slice(0, cardData.cardIndex); // Remove selected cards from the source stack
      }
      return stack;
    });
    setTableau(updatedTableau);

    // Record the move before updating the tableau state
    recordMove(tableau, updatedTableau);

    // Check for win condition
    checkForWin(updatedTableau);
  } else {
    console.log("Invalid move to foundation.");
  }
};

const isValidFoundationMove = (selectedCards, targetPile) => {
  if (selectedCards.length === 0) return false;

  // Check if the target pile is empty and the first card is an Ace
  if (targetPile.length === 0 && getRank(selectedCards[0].image) === 1) return true;

  // Check if the target pile is not empty and the top card's rank is one less than the first card's rank
  if (targetPile.length > 0 && getRank(targetPile[targetPile.length - 1].image) === getRank(selectedCards[0].image) - 1) return true;

  return false;
};

return (
  <div className='h-auto flex justify-around xl:w-[1200px] xl:mx-auto w-[100%]'>
    <div className='flex flex-col w-auto'>
    <div className='pt-[10px] flex flex-col items-center w-auto'>
      <img onClick={handleClick} className="hover:p-2 focus:animate-pulse hover:bg-gray-200 bg-white transition-all rounded-md w-[100px] h-[150px]" src={GoogleImage} alt="Google Image"/>
      <p onClick={handleClick} className='w-[100%] text-cyan-200 hover:bg-black cursor-pointer transition-all p-1 mt-[10px] rounded-lg border text-center'>DEAL</p>
      <div className='flex flex-col justify-center items-center'>
        <button onClick={handleReset} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2 mt-2'>Reset</button>
        <button onClick={handleUndo} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2 mt-2'>Undo</button>
      </div>
    </div>
     {/* Render foundation piles */}
     <div className='mt-[50px] flex flex-col gap-5 justify-center pt-[10px]'>
       {foundation.map((pile, pileIndex) => (
        <div
          key={pileIndex}
          className='relative w-[120px] h-[150px] flex justify-center items-center border border-gray-700 text-center rounded-lg'
          onDrop={(e) => handleFoundationDrop(e, pileIndex)}
          onDragOver={(e) => e.preventDefault()}
        >
          {pile.map((card, cardIndex) => (
            <img
              key={cardIndex}
              src={card.image}
              alt={`Foundation Card ${pileIndex}-${cardIndex}`}
              className='cursor-pointer w-[100px] h-[150px] absolute'
              draggable={false}
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
    <div className='flex flex-col'>
      
      {/* Render tableau stacks */}
      <div className='flex gap-5 justify-center pt-[10px]'>
      {tableau.map((stack, stackIndex) => (
        <div
          key={stackIndex}
          className='relative w-[120px] h-[150px] flex justify-center items-center border border-gray-700 text-center rounded-lg'
          onDrop={(e) => handleSingleCardDrop(e, stackIndex)}
          onDragOver={(e) => e.preventDefault()}
        >
          {stack.map((card, cardIndex) => (
            <img
              key={cardIndex}
              src={card.isVisible ? card.image : CardBack}
              alt={`Tableau Card ${stackIndex}-${cardIndex}`}
              className='cursor-pointer w-[100px] h-[150px] absolute'
              draggable={card.isVisible}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                top: `${cardIndex * 28}px`,
              }}
              onDragStart={(e) => handleSingleCardDragStart(e, stackIndex, cardIndex)}
            />
          ))}
        </div>
      ))}
      </div>
    </div>
  </div>
);
};

export default CombinedComponent;
