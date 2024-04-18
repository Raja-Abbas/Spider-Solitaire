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

  const spadesCards = [SpadesAce, Spades2, Spades3, Spades4, Spades5, Spades6, Spades7, Spades8, Spades9, Spades10, Spades11, Spades12, Spades13];
  const maxDealCount = 10;
  const [dealCount, setDealCount] = useState(0);

// Function to deal initial cards to tableau
const dealInitialCards = () => {
  const initialTableau = tableau.map((_, index) => {
    const cardsCount = index + 1 <= maxDealCount ? index + 1 : maxDealCount; // Ensure max 6 cards for each stack
    const cards = Array.from({ length: cardsCount }, (_, i) => ({
      image: i === cardsCount - 1 ? spadesCards[Math.floor(Math.random() * spadesCards.length)] : CardBack, // Add one random card to the last position
      isVisible: false // Set isVisible to false for all cards initially
    }));
    return cards;
  });
  setTableau(initialTableau);

  // After 5 seconds, flip the cards to reveal their faces
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


  // Function to add one new card to each stack
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
    dealInitialCards(); // Deal initial cards when the component mounts
  }, []); // Empty dependency array to ensure it runs only once

  const handleRandomDistribution = () => {
    addCardToStacks();
  };

  const handleDrop = (e, stackIndex, cardIndex) => {
    e.preventDefault();
    const cardData = JSON.parse(e.dataTransfer.getData('text/plain'));
    const droppedCard = tableau[cardData.stackIndex][cardData.cardIndex];
    const targetStack = tableau[stackIndex];
  
    // Check if the move is valid
    if (isValidMove(droppedCard, targetStack)) {
      const updatedTableau = tableau.map((stack, i) => {
        if (i === cardData.stackIndex) {
          // Remove dragged card from source stack
          return stack.filter((_, index) => index !== cardData.cardIndex);
        } else if (i === stackIndex) {
          // Add dragged card to target stack and reveal it
          return [...stack, { ...droppedCard, isVisible: true }];
        }
        return stack;
      });
      setTableau(updatedTableau);
      onDrop();
      checkForWin(updatedTableau);
    } else {
      console.log("Invalid move.");
    }
  };
  
  const isValidMove = (card, stack) => {
    if (stack.length === 0) return card.image === spadesCards[spadesCards.length - 1]; // Only the last card (King) can be placed on an empty stack
    const topCard = stack[stack.length - 1];
    const cardRankIndex = spadesCards.findIndex(c => c === card.image);
    const topCardRankIndex = spadesCards.findIndex(c => c === topCard.image);
    return cardRankIndex === topCardRankIndex - 1; // Allow placing card if its rank is one less than the top card's rank
  };

  const checkForWin = (tableau) => {
    const allStacksEmpty = tableau.every(stack => stack.length === 0);
    if (allStacksEmpty && dealCount === maxDealCount) {
      // Check if all foundation stacks contain 13 cards of the same suit
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

  return (
    <div className='h-auto flex justify-around xl:w-[1200px] xl:mx-auto w-[100%]'>
       {/* Render draggable item */}
       <div className='pt-[10px]'>
        <img onClick={handleClick} className="hover:p-2 hover:bg-gray-200 bg-white transition-all rounded-md w-[100px] h-[150px]" src={GoogleImage} alt="Google Image"/>
        <p onClick={handleClick} className='text-cyan-200 hover:bg-black cursor-pointer transition-all p-1 -ml-[5px] mt-[10px] rounded-lg border text-center'>CLICK</p>
      </div>
      {/* Render tableau stacks */}
<div className='flex gap-5 justify-center pt-[10px]'>
  {tableau.map((stack, stackIndex) => (
    <div
      key={stackIndex}
      className='relative w-[120px] h-[150px] flex justify-center items-center border border-gray-700 text-center rounded-lg'
      onDrop={(e) => handleDrop(e, stackIndex)}
      onDragOver={(e) => e.preventDefault()}
    >
      {stack.length > 0 ? (
        // If stack is not empty, render the cards
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
        // If stack is empty, render only the card back image
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
