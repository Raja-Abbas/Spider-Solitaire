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
  const [tableau, setTableau] = useState([
    [], [], [], [], [], [], []
  ]);

  const [foundation, setFoundation] = useState({
    Spades: [],
    Hearts: [],
    Diamonds: [],
    Clubs: []
  });

  const [movesHistory, setMovesHistory] = useState([]);

  const spadesCards = [SpadesAce, Spades2, Spades3, Spades4, Spades5, Spades6, Spades7, Spades8, Spades9, Spades10, Spades11, Spades12, Spades13];
  const maxDealCount = 10;
  const [dealCount, setDealCount] = useState(0);

  const dealInitialCards = () => {
    const initialTableau = tableau.map((_, index) => {
      const cardsCount = index + 1 <= maxDealCount ? index + 1 : maxDealCount; // Ensure max 6 cards for each stack
      const cards = Array.from({ length: cardsCount }, (_, i) => ({
        image: i === cardsCount - 1 ? spadesCards[Math.floor(Math.random() * spadesCards.length)] : CardBack,
        isVisible: false
      }));
      return cards;
    });
    setTableau(initialTableau);
    setTimeout(() => {
      const updatedTableau = initialTableau.map(stack => {
        return stack.map(card => ({
          ...card,
          isVisible: true
        }));
      });
      setTableau(updatedTableau);
    }, 1000); // 5000 milliseconds = 5 seconds
  };

  const addCardToStacks = () => {
    if (dealCount >= maxDealCount) return;
    const updatedTableau = tableau.map(stack => {
      if (stack.length < spadesCards.length) {
        const randomIndex = Math.floor(Math.random() * spadesCards.length);
        return [...stack, { image: spadesCards[randomIndex], isVisible: true }];
      }
      return stack;
    });
    setTableau(updatedTableau);
    setDealCount(dealCount + 1);
  };

  useEffect(() => {
    dealInitialCards();
  }, []);

  const handleRandomDistribution = () => {
    addCardToStacks();
  };

  const handleDrop = (e, stackIndex, cardIndex) => {
    e.preventDefault();
    const cardData = JSON.parse(e.dataTransfer.getData('text/plain'));
    const droppedCard = tableau[cardData.stackIndex][cardData.cardIndex];
    const targetStack = tableau[stackIndex];

    if (isValidMove(droppedCard, targetStack)) {
      const updatedTableau = tableau.map((stack, i) => {
        if (i === cardData.stackIndex) {
          return stack.filter((_, index) => index !== cardData.cardIndex);
        } else if (i === stackIndex) {
          return [...stack, { ...droppedCard, isVisible: true }];
        }
        return stack;
      });
      setMovesHistory([...movesHistory, { from: cardData.stackIndex, to: stackIndex }]);
      setTableau(updatedTableau);
      onDrop();
      checkForWin(updatedTableau);
    } else {
      console.log("Invalid move.");
    }
  };

  const isValidMove = (card, stack) => {
    if (stack.length === 0) return card.image === spadesCards[spadesCards.length - 1];
    const topCard = stack[stack.length - 1];
    const cardRankIndex = spadesCards.findIndex(c => c === card.image);
    const topCardRankIndex = spadesCards.findIndex(c => c === topCard.image);
    return cardRankIndex === topCardRankIndex - 1;
  };

  const checkForWin = (tableau) => {
    const allStacksEmpty = tableau.every(stack => stack.length === 0);
    if (allStacksEmpty && dealCount === maxDealCount) {
      const spadesWin = foundation.Spades.length === 13;
      const heartsWin = foundation.Hearts.length === 13;
      const diamondsWin = foundation.Diamonds.length === 13;
      const clubsWin = foundation.Clubs.length === 13;
      if (spadesWin && heartsWin && diamondsWin && clubsWin) {
        alert("Congratulations! You win!");
      } else {
        alert("Game over. You lose!");
      }
    }
  };

  const handleClick = () => {
    handleRandomDistribution();
  };

  const handleReset = () => {
    setTableau(Array(7).fill([]));
    setDealCount(0);
    setMovesHistory([]);
    dealInitialCards();
  };

  const handleUndo = () => {
    if (movesHistory.length > 0) {
      const lastMove = movesHistory[movesHistory.length - 1];
      const updatedTableau = [...tableau];
      const cardToMove = updatedTableau[lastMove.to].pop();
      updatedTableau[lastMove.from].push(cardToMove);
      setMovesHistory(movesHistory.slice(0, -1));
      setTableau(updatedTableau);
    }
  };

  const handleHint = () => {
    // Iterate over each card in the tableau
    for (let stackIndex = 0; stackIndex < tableau.length; stackIndex++) {
      const stack = tableau[stackIndex];
      for (let cardIndex = 0; cardIndex < stack.length; cardIndex++) {
        const card = stack[cardIndex];
        // Check if the card can be moved to any other stack or to the foundation
        if (canMoveCard(card, stackIndex, cardIndex)) {
          // Execute the move
          executeMove(stackIndex, cardIndex);
          return; // Exit the function after providing a hint
        }
      }
    }
    console.log("No hint available.");
  };
  
  // Function to check if a card can be moved to any other stack or to the foundation
  const canMoveCard = (card, stackIndex, cardIndex) => {
    // Check if the card can be moved to the foundation
    const targetSuit = Object.keys(foundation).find(suit => isValidMove(card, foundation[suit]));
    if (targetSuit) {
      return true;
    }
    // Check if the card can be moved to any other tableau stack
    for (let targetStackIndex = 0; targetStackIndex < tableau.length; targetStackIndex++) {
      if (targetStackIndex !== stackIndex) {
        if (isValidMove(card, tableau[targetStackIndex])) {
          return true;
        }
      }
    }
    return false;
  };
  
  // Function to execute the move suggested by the hint
  const executeMove = (fromStackIndex, fromCardIndex) => {
    const card = tableau[fromStackIndex][fromCardIndex];
    // Check if the card can be moved to the foundation
    const targetSuit = Object.keys(foundation).find(suit => isValidMove(card, foundation[suit]));
    if (targetSuit) {
      // Move the card to the foundation
      const updatedTableau = [...tableau];
      updatedTableau[fromStackIndex] = tableau[fromStackIndex].filter((_, index) => index !== fromCardIndex);
      setTableau(updatedTableau);
      setFoundation({
        ...foundation,
        [targetSuit]: [...foundation[targetSuit], card]
      });
      return;
    }
    // Check if the card can be moved to any other tableau stack
    for (let targetStackIndex = 0; targetStackIndex < tableau.length; targetStackIndex++) {
      if (targetStackIndex !== fromStackIndex) {
        if (isValidMove(card, tableau[targetStackIndex])) {
          // Move the card to the target tableau stack
          const updatedTableau = [...tableau];
          updatedTableau[fromStackIndex] = tableau[fromStackIndex].filter((_, index) => index !== fromCardIndex);
          updatedTableau[targetStackIndex] = [...tableau[targetStackIndex], card];
          setTableau(updatedTableau);
          return;
        }
      }
    }
  };
      

  return (
    <div className='h-auto flex justify-around xl:w-[1200px] xl:mx-auto w-[100%]'>
      <div className='pt-[10px] flex flex-col items-center'>
        <img onClick={handleClick} className="hover:p-2 focus:animate-pulse hover:bg-gray-200 bg-white transition-all rounded-md w-[100px] h-[150px]" src={GoogleImage} alt="Google Image"/>
        <p onClick={handleClick} className='w-[100%] text-cyan-200 hover:bg-black cursor-pointer transition-all p-1 mt-[10px] rounded-lg border text-center'>CLICK</p>
        <div className='flex flex-col justify-center items-center'>
        <button onClick={handleReset} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2 mt-2'>Reset</button>
        <button onClick={handleUndo} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2 mt-2'>Undo</button>
        {/* <button onClick={handleHint} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2 mt-2'>Hint</button> */}
        </div>
      </div>
      <div className='flex gap-5 justify-center pt-[10px]'>
        {tableau.map((stack, stackIndex) => (
          <div
            key={stackIndex}
            className='relative w-[120px] h-[150px] flex justify-center items-center border border-gray-700 text-center rounded-lg'
            onDrop={(e) => handleDrop(e, stackIndex)}
            onDragOver={(e) => e.preventDefault()}
          >
            {stack.length > 0 ? (
              stack.map((card, cardIndex) => (
                <img
                  key={cardIndex}
                  src={card.isVisible ? card.image : CardBack}
                  alt={`Tableau Card ${stackIndex}-${cardIndex}`}
                  className='cursor-pointer w-[100px] h-[150px] absolute'
                  draggable={card.isVisible && cardIndex === stack.length - 1}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    top: `${cardIndex * 28}px`,
                  }}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', JSON.stringify({ stackIndex, cardIndex }));
                  }}
                />
              ))
            ) : (
              <img
                src={CardBack}
                alt={`Tableau Card Back ${stackIndex}`}
                className='cursor-pointer w-[100px] h-[150px] absolute'
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CombinedComponent;
