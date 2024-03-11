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
    
    // reset gameBoard to default values of false
    const resetGameBoard = () => gameBoardArray.map(item => item = false);

    return { gameBoardArray,
             getGameBoardItem,
             updateGameBoard,
             isGameBoardFilledUp,
             resetGameBoard,
            };
})();

// User
function createUser(name) {
    const tictactoeName = "@" + name;
    const getTictactoeName = () => tictactoeName;

    return {name, getTictactoeName};
}

// Player
// The marker can be either 'X' or 'O'
// The marker ('X' or 'O') can be the value on the button
function createPlayer(marker) {
    // Initial score for a player
    // This score will be increased by 1 if he wins a game
    const score = 0;

    // This array contains the boxes on the board player ticked
    // The values will be gotten from the id on each box
    const moves = [];

    // index is the id of the box the player ticked
    // only add a move if the move is valid and if the board is not filled up
    const makeMove = (index) => {
        if (!gameBoard.isGameBoardFilledUp() && 
            !gameBoard.getGameBoardItem(index)) {
            // add the id to the 'moves'
            moves.push(index); 
            gameBoard.updateGameBoard(index);
        }
    };

    // since a winner can be found only after 3 moves
    const getTotalMoves = () => {
        if (moves.length >= 3) {
           return moves.reduce(
            (accumulator, currentValue) => accumulator + currentValue)
        }
    };

    return { marker, getTotalMoves, makeMove, score };
}