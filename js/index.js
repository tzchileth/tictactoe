// IIFE (module pattern) for gameBoard
const gameBoard = (function() {
    // Initial state of the gameBoard when nobody has played yet.
    const gameBoardArray = [false, false, false,
                            false, false, false,
                            false, false, false];
    
    // Get the value of a particular box [it can be either true or false]
    // Call this function in the updateGameBoard function
    const getGameBoardItem = (index) => gameBoardArray[index];

    // The index passed to the function [0, 1, ..., 8] 
    // will be the id on each box in the gameBoard
    // Update a box with 'X' or 'O' if the current value is false
    const updateGameBoard = (index) => {
        if (!getGameBoardItem[index]) {
            gameBoardArray[index] = true; 
        }
    };

    // check if all values in the gameBoardArray are true
    // if it returns true, and there's no winner, then it's a tie
    // if it returns false, the next player can play again
    const isGameBoardFilledUp = () => gameBoardArray.every(
                                        item => 
                                        (item === true)
                                        );

    return { gameBoardArray,
             getGameBoardItem,
             updateGameBoard,
             isGameBoardFilledUp,
            };
})();
