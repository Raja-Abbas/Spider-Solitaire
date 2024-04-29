import React from 'react';

const SpiderSolitaireRulesPopup = ({ onClose }) => {
  return (
    <div className="fixed bg-opacity-100 top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 z-50">
      <div className="bg-black flex justify-center flex-col text-cyan-500 p-6 rounded-lg max-w-md">
        <h2 className="text-xl font-bold mb-2">Spider Solitaire Rules</h2>
        <p className="mb-2">Read through the rules below to understand how to play Spider Solitaire:</p>
        <ul className="list-disc ml-6">
          <li><strong>Objective:</strong> Arrange all cards of each suit in descending order from King to Ace to clear them from the tableau.</li>
          <li><strong>Setup:</strong> Two decks of cards are dealt into 10 columns. Each column contains a mix of face-up and face-down cards.</li>
          <li><strong>Foundation:</strong> Empty foundation piles at the left side. Complete descending sequences from King to Ace are moved to these piles.</li>
          <li><strong>Gameplay:</strong>
            <ul className="list-disc ml-6">
              <li>Move cards within the tableau to create descending sequences of cards of the same suit.</li>
              <li>Sequences can be moved as a unit if they are of the same suit.</li>
              <li>Any card or sequence can be moved to an empty column.</li>
              <li>Deal new cards from the stock pile to the tableau when stuck</li>
            </ul>
          </li>
          <li><strong>Winning:</strong> Fill all foundation piles with cards of the same suit, arranged from King to Ace.</li>
        </ul>
        <button className="mt-2 w-[100px] mx-auto text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SpiderSolitaireRulesPopup;
