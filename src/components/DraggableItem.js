import React, { useState, useEffect } from 'react';
import GoogleImage from '../assets/CardBack.png';
import CardBack from '../assets/CardBack.png'; // Add a card back image for face-down cards
import CongratsImage from '../assets/pngegg.png';

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
  const [tableau, setTableau] = useState(Array(10).fill([]));
  const [foundation, setFoundation] = useState(Array(3).fill([])); 
  const [dealCount, setDealCount] = useState(0);
  const [movesHistory, setMovesHistory] = useState([]);
  const [filledFoundations, setFilledFoundations] = useState(0); 
  const [difficulty, setDifficulty] = useState(null); // State to store the selected difficulty
  const [gameWon, setGameWon] = useState(false); // State to track if the game is won
  const [totalMoves, setTotalMoves] = useState(0); // State to track the total moves

  const spadesCards = [SpadesAce, Spades2, Spades3, Spades4, Spades5, Spades6, Spades7, Spades8, Spades9, Spades10, Spades11, Spades12, Spades13];
  const maxDealCount = 5;
  const handleDifficultySelection = (difficultyLevel) => {
      setDifficulty(difficultyLevel);
      const pilesCount = {
        easy: 1,
        medium: 2,
        hard: 3
      };
      setFoundation(Array(pilesCount[difficultyLevel]).fill([]));
    };
    const dealInitialCards = () => {
      const initialTableau = tableau.map((_, index) => {
        const cardsCount = index < 4 ? 5 : 4; // First 4 stacks get 5 cards, the rest get 4 cards
        let cards = [];
    
        if (cardsCount <= 13) {
          cards = Array.from({ length: cardsCount }, (_, i) => {
            const randomIndex = Math.floor(Math.random() * spadesCards.length);
            const isVisible = i === cardsCount - 1; 
            return {
              image: isVisible ? spadesCards[randomIndex] : CardBack, 
              isVisible: isVisible,
            };
          });
        }
        return cards;
      });
  
      const shuffledCards = shuffleArray(spadesCards); // Shuffle the spadesCards array
      const remainingCards = shuffledCards.slice(40); // Get the last 44 cards after shuffling
  
      for (let i = 0; i < remainingCards.length; i++) {
        initialTableau[i % 10].push({ image: remainingCards[i], isVisible: true });
      }
  
      setTableau(initialTableau);
    };
  
  
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  
  
  
  useEffect(() => {
    if (difficulty) {
      dealInitialCards();
    }
  }, [difficulty]);

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
    // Check if the game is won
    if (!gameWon) {
      const selectedCards = tableau[stackIndex].slice(cardIndex);
      const isDescendingSequence = isDescending(selectedCards);
    
      // Check if the selected cards form a descending sequence
      if (isDescendingSequence) {
        e.dataTransfer.setData('text/plain', JSON.stringify({ stackIndex, cardIndex, selectedCards }));
      } else {
        console.log("Cannot drag cards that are not in descending order.");
        e.preventDefault(); // Prevent dragging if the cards are not in descending order
      }
    } else {
      e.preventDefault(); // Prevent dragging if the game is won
    }
  };
  
  const handleSingleCardDrop = (e, stackIndex) => {
    // Check if the game is won
    if (!gameWon) {
        e.preventDefault();
        const cardData = JSON.parse(e.dataTransfer.getData('text/plain'));
        const targetStack = tableau[stackIndex];

        // Check if the target stack is empty or if the move is valid for moving the selected cards to the target stack
        if (targetStack.length === 0 || isValidMultiCardMove(cardData.selectedCards, targetStack)) {
            const updatedTableau = tableau.map((stack, i) => {
                if (i === cardData.stackIndex) {
                    // Check if the dropped card is from the initial deal and the card behind is a card back
                    if (dealCount < maxDealCount && cardData.cardIndex > 0 && stack[cardData.cardIndex - 1].image === CardBack) {
                        // Find the index of the card behind the dropped card
                        const cardBehindIndex = cardData.cardIndex - 1;
                        // Replace the card behind the dropped card with a random spade card
                        const randomIndex = Math.floor(Math.random() * spadesCards.length);
                        stack[cardBehindIndex] = { image: spadesCards[randomIndex], isVisible: true };
                    }
                    return stack.slice(0, cardData.cardIndex); // Remove selected cards from the source stack
                } else if (i === stackIndex) {
                    const visibleIndex = stack.findIndex(card => card.isVisible); // Find the index of the first visible card
                    const updatedStack = stack.map((card, index) => ({
                        ...card,
                        isVisible: index >= visibleIndex, // Set isVisible to true for cards starting from the first visible card
                    }));
                    return [...updatedStack, ...cardData.selectedCards]; // Add selected cards to the target stack
                }
                return stack; // Return the original stack if the condition is not met
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
    }
};


  const isValidMultiCardMove = (selectedCards, targetStack) => {
    if (selectedCards.length === 0 || !selectedCards.every(card => card && card.image)) return false;
  
    const bottomCardRank = getRank(targetStack[targetStack.length - 1].image);
    const topCardRank = getRank(selectedCards[0].image);
  
    return bottomCardRank === topCardRank + 1;
  };
  

  const checkForWin = (tableau) => {
    // Check if all tableau stacks are empty
    const allStacksEmpty = tableau.every(stack => stack.length === 0);
    
    // If all stacks are empty, it's a win
    return allStacksEmpty;
  };  

  const addCardToStacks = () => {
    const shuffledCards = shuffleArray(spadesCards); // Shuffle the spadesCards array
  
    const cardCounts = {}; // Object to keep track of the counts of each card
    const cardsToAdd = []; // Array to store cards to be added to the stacks
  
    // Initialize cardCounts for each card in shuffledCards
    shuffledCards.forEach(card => {
      cardCounts[card] = cardCounts[card] ? cardCounts[card] + 1 : 1;
    });
  
    const requiredSets = Math.ceil(spadesCards.length / 13) * 3; // Calculate the required number of sets
  
    // Loop until each set of 13 cards appears at least three times in each column
    while (!isMinCardDistributionMet(cardCounts)) {
      shuffledCards.forEach(card => {
        // Check if the card count is less than 3 and add it to the cardsToAdd array
        if (cardCounts[card] < 3) {
          cardsToAdd.push(card);
          cardCounts[card]++; // Increment the count for the added card
        }
      });
    }
  
    const updatedTableau = tableau.map((stack, stackIndex) => {
      // Add one card to each stack
      const card = cardsToAdd.shift(); // Get the first card from the cardsToAdd array
      if (card) {
        stack.push({ image: card, isVisible: true }); // Add the card to the stack
      }
      return stack;
    });
  
    setTableau(updatedTableau);
  };
  
  const isMinCardDistributionMet = (cardCounts) => {
    // Check if each card appears at least three times in the distribution
    return Object.values(cardCounts).every(count => count >= 3);
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
    window.location.reload(); 
    dealInitialCards();
    setDealCount(0);
    setMovesHistory([]);
    setFilledFoundations(0); // Reset the filled foundation piles count
  };
  const handleUndo = () => {
    // Check if there are moves in the history to undo
    if (movesHistory.length > 0) {
      // Get the last recorded move from the history
      const lastMove = movesHistory[movesHistory.length - 1];
  
      // Check if the last move involved sending cards to the foundation
      let cardsSentToFoundation = false;
      for (let i = 0; i < lastMove.after.length; i++) {
        const beforeLength = lastMove.before[i].length;
        const afterLength = lastMove.after[i].length;
        if (afterLength < beforeLength) {
          // Cards were removed from this stack, indicating they were sent to the foundation
          cardsSentToFoundation = true;
          break;
        }
      }
  
      // Adjust the number of moves to go back based on whether cards were sent to the foundation
      const movesToGoBack = cardsSentToFoundation ? 2 : 1;
  
      // Find the state before the specified number of moves
      let stateBeforeUndo = tableau;
      for (let i = 0; i < movesToGoBack; i++) {
        if (movesHistory.length > i) {
          stateBeforeUndo = movesHistory[movesHistory.length - 1 - i].before;
        }
      }
  
      // Set the tableau state to the state before the specified number of moves
      setTableau(stateBeforeUndo);
  
      // Remove the last move(s) from the history
      setMovesHistory(movesHistory.slice(0, -movesToGoBack));
    } else {
      console.log("No moves to undo.");
    }
  };
  
  
  
  
  
  
  
  
  const getLastMoveType = (move) => {
    // Check if the move involves sending cards to the foundation
    if (move.after.some(stack => stack.length < move.before.some(stack => stack.length))) {
      return 'foundation';
    } else {
      return 'tableau';
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
      
      // Check if the foundation pile is fully filled
      if (updatedFoundation[pileIndex].length === 13) {
        setFilledFoundations(filledFoundations + 1); // Increment the filled foundation piles count
      }
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

  const recordMove = (before, after) => {
    // Check if the movesHistory array has reached the limit of 100 moves
      setMovesHistory([...movesHistory, { before, after }]);
  };

  const handleAutoMoveToFoundation = () => {
    // Iterate over each tableau stack
    tableau.forEach((stack, stackIndex) => {
      // Check if the stack has at least 13 cards
      if (stack.length >= 13) {
        // Check if the top 13 cards form a descending sequence
        if (isDescending(stack.slice(-13))) {
          // Check if there is an empty foundation pile
          const emptyPileIndex = foundation.findIndex(pile => pile.length === 0);
          if (emptyPileIndex !== -1) {
            // Move the top 13 cards to the empty foundation pile
            const cardsToMove = stack.slice(-13);
            const updatedFoundation = [...foundation];
            updatedFoundation[emptyPileIndex] = [...cardsToMove];
            setFoundation(updatedFoundation);

            // Remove the moved cards from the tableau stack
            const updatedTableau = [...tableau];
            updatedTableau[stackIndex] = stack.slice(0, -13);
            setTableau(updatedTableau);

            // Record the move
            recordMove(tableau, updatedTableau);

            // Check for win condition
            checkForWin(updatedTableau);
            
            // Check if the foundation pile is fully filled
            if (updatedFoundation[emptyPileIndex].length === 13) {
              setFilledFoundations(filledFoundations + 1); // Increment the filled foundation piles count
            }
          }
        }
      }
    });
  };
  const handleNewGame = () => {
    window.location.reload(); 
  };

  // Call this function whenever the tableau or foundation piles are updated
  useEffect(() => {
    handleAutoMoveToFoundation();
  }, [tableau, foundation]);
  useEffect(() => {
    // Check if all foundation piles are filled
    const allPilesFilled = foundation.every(pile => pile.length === 13);
  
     // If all piles are filled, set gameWon to true
    if (allPilesFilled) {
      setGameWon(true);
    }
  }, [foundation]);
  
  return (
    <div className='pt-5 h-auto flex justify-around xl:w-[1200px] xl:mx-auto w-[100%]'>
      {!difficulty && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-black p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center text-white capitalize">SELECT DIFFICULTY</h2>
            <div className="flex flex-col justify-center gap-4">
              <button onClick={() => handleDifficultySelection('easy')} className="bg-blue-500 hover:bg-blue-700 text-white text-xl transition-all font-bold py-2 px-4 rounded">Easy</button>
              <button onClick={() => handleDifficultySelection('medium')} className="bg-blue-500 hover:bg-blue-700 text-white text-xl transition-all font-bold py-2 px-4 rounded">Medium</button>
              <button onClick={() => handleDifficultySelection('hard')} className="bg-blue-500 hover:bg-blue-700 text-white text-xl transition-all font-bold py-2 px-4 rounded">Hard</button>
            </div>
          </div>
        </div>
      )}
      {gameWon && (
        <div className="fixed z-[10000] bg-opacity-75 top-0 left-0 w-full h-full flex justify-center items-center">
          <div className="z-[10000] w-[600px] h-[400px] p-8 rounded-lg shadow-lg flex flex-col justify-center items-center">
            <img className='mb-0' src={CongratsImage} alt="Congrats"/>
            <h2 className="text-xl font-bold -mt-6 mb-4 text-center text-white">You won the game <span className='text-red-500'>!</span></h2>
            <h4 className="text-xl font-bold mb-4 text-center text-white">Moves : <span className='text-red-500'>{movesHistory.length}</span></h4>
            <button onClick={handleNewGame} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Play Again</button>
          </div>
        </div>
      )}
      <div className='flex flex-col w-auto'>
        <div className='pt-[10px] flex flex-col items-center w-auto'>
          <img onClick={handleClick} className="hover:p-2 focus:animate-pulse hover:bg-gray-200 bg-white transition-all rounded-md w-[70px] h-[100px]" src={GoogleImage} alt="Google Image"/>
          <div className="text-md text-cyan-200 mt-2 font-semibold">Moves: <span className='text-red-500 font-bold'>{movesHistory.length}</span></div>
          <div className="text-md text-cyan-200 mt-2 font-semibold">Deals Left: <span className='text-red-500 font-bold'>{maxDealCount - dealCount}</span></div>
          <p onClick={handleClick} className='w-auto py-2 px-4 text-red-500 hover:bg-black cursor-pointer transition-all p-1 mt-[10px] rounded-lg border border-cyan-200 text-center'>DEAL</p>
          <div className='flex flex-col justify-center items-center'>
            <button onClick={handleReset} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2'>Reset</button>
            <button onClick={handleUndo} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2'>Undo</button>
          </div>
        </div>
        {/* Render foundation piles */}
        <div className='flex flex-col gap-1 items-center justify-center pt-[10px]'>
          {foundation.map((pile, pileIndex) => (
            <div
              key={pileIndex}
              className='relative bg-gray-50 w-[80px] h-[100px] flex justify-center items-center border border-gray-700 text-center rounded-lg'
              onDrop={(e) => handleFoundationDrop(e, pileIndex)}
              onDragOver={(e) => e.preventDefault()}
            >
              {pile.map((card, cardIndex) => (
                <img
                  key={cardIndex}
                  src={card.image}
                  alt={`Foundation Card ${pileIndex}-${cardIndex}`}
                  className='cursor-pointer absolute top-50 bottom-50 left-50 '
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    zIndex: cardIndex, // Ensures cards are stacked on top of each other
                    transform: `translateY(-${cardIndex * 0}px)`, // Adjust this value as needed for proper stacking
                  }}
                  draggable={false}
                />
              ))}
              <p className='text-cyan-600 text-xs'>Foundation</p>
            </div>
          ))}
        </div>
        <div className="text-sm text-cyan-200 mt-2 font-semibold text-center">Foundation Filled: {filledFoundations}</div>
      </div>
      <div className='flex flex-col'>
        {/* Render tableau stacks */}
        <div className='flex gap-5 justify-center pt-[10px]'>
          {tableau.map((stack, stackIndex) => (
            <div
              key={stackIndex}
              className='relative w-[80px] h-[100px] flex justify-center items-center border-4 border-cyan-800 text-center rounded-lg'
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
                    top: `${cardIndex * 22}px`,
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
