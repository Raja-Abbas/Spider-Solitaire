import React from 'react';

const SpiderSolitaireRulesPopup = ({ onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
      <div className="bg-white p-8 rounded-lg max-w-md">
        <h2 className="text-xl font-bold mb-4">Spider Solitaire Rules</h2>
        <p className="mb-4">Read through the rules below to understand how to play Spider Solitaire:</p>
        <ul className="list-disc ml-6">
          <li><strong>Objective:</strong> Arrange all cards of each suit in descending order from King to Ace to clear them from the tableau.</li>
          <li><strong>Setup:</strong> Two decks of cards are dealt into 7 columns. Each column contains a mix of face-up and face-down cards.</li>
          <li><strong>Foundation:</strong> Three empty foundation piles at the top. Complete descending sequences from King to Ace are moved to these piles.</li>
          <li><strong>Gameplay:</strong>
            <ul className="list-disc ml-6">
              <li>Move cards within the tableau to create descending sequences of cards of the same suit.</li>
              <li>Sequences can be moved as a unit if they are of the same suit.</li>
              <li>Any card or sequence can be moved to an empty column.</li>
              <li>Deal new cards from the stock pile to the tableau when stuck, but it adds a time penalty.</li>
            </ul>
          </li>
          <li><strong>Winning:</strong> Fill all foundation piles with cards of the same suit, arranged from King to Ace.</li>
        </ul>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SpiderSolitaireRulesPopup;
