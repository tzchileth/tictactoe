// IIFE (module pattern) for gameBoard
const gameBoard = (function() {
    // Initial state of the gameBoard when nobody has played yet.
    let gameBoardArray = [false, false, false,
                            false, false, false,
                            false, false, false];
    
    // Get the value of a particular box [it can be either true or false]
    // Call this function in the updateGameBoard function
    //gameBoardArray[index]
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
    const resetGameBoard = () => {
        gameBoardArray.forEach((item, index) => {
            gameBoardArray[index] = false;
        });
    };

    // get available boxes
    const getAvailableBoxes = () => {
        let availableBoxes = [];
        gameBoardArray.forEach((item, index) => {
            if (item === false) {
                availableBoxes.push(index);
            }
        });
        return availableBoxes;
    }

    const shuffleGameBoard  = (array) => {
        let currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle.
        while (currentIndex > 0) {
      
          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
                    array[randomIndex], array[currentIndex]
                ];
        }
      
        return array;
      }

    return { gameBoardArray,
             getGameBoardItem,
             updateGameBoard,
             isGameBoardFilledUp,
             resetGameBoard,
             getAvailableBoxes,
             shuffleGameBoard,
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

    // get length of the moves array
    const movesLength = () => moves.length;

    // since a winner can be found only after 3 moves
    const getTotalMoves = () => {
        if (movesLength() >= 3) {
           return moves.reduce(
            (accumulator, currentValue) => accumulator + currentValue)
        }
    };

    const clearMoves = () => {
        if (movesLength() > 0) {
            moves.splice(0, movesLength());
        }
    }

    return { marker, getTotalMoves, makeMove, moves, movesLength, clearMoves, score };
}

// Game: The game is between a human and computer
const game = (function() {
    // winningMoves object
    const winningMoves = {
        3: [0, 1, 2],
        9: [0, 3, 6],
        12: [[0, 4, 8], [1, 4, 7], [2, 4, 6], [3, 4, 5]],
        15: [2, 5, 8],
        21: [6, 7, 8],
    };
 
        const playerOne = createPlayer("X"); // update this line to get the marker from the button element
        const playerTwo = createPlayer("O"); // update this line to get the marker from the button element
        let winnerFound = false;  // initially no winner yet
        let isGameDraw = false;   // initially set to false
        let playerOneTurn = true;   // to keep track of whose turn to make a move 
        let playerTwoTurn = false;  // 'X' goes first, so it is set to true initially
        let playerOneWon = false;
        let playerTwoWon = false;
        let winningPattern = "";
        let count = 1;

        const play = () => {
            // keep playing game is it's not a tie and there's no winner yet
            while (!winnerFound && count <= 9) {
                if (playerOneTurn && !winnerFound) {
                    let movesArrayLength = playerOne.movesLength();
                    // get the index as an id using event listener on the DOM
                    // prompt player1 to input an available slot
                    let index = Number(prompt("Player One: Enter an integer between 0 & 8: "));
                    playerOne.makeMove(index);
                    // check if playerOne won
                    if (checkForWinner(playerOne)) {
                        winnerFound = true;
                        playerOneWon = true;
                        playerOne.score++;
                        console.log("Player 1 won");
                        return;
                    }
                    // check that playerOne has actually played
                    if (playerOne.movesLength() > movesArrayLength) {
                        // set playerOneTurn to false so that he doesn't make more than one move in his turn
                        playerOneTurn = false;
                        // make next player to be player 2
                        playerTwoTurn = true;
                        count++;
                        }
                } 
                else if (playerTwoTurn && !winnerFound) {
                            let movesArrayLength = playerTwo.movesLength();
                            // get the index as an id using event listener on the DOM
                            let index = Number(prompt("Player Two: Enter an integer between 0 & 8: "));
                            playerTwo.makeMove(index);
                            // playerTwo.makeMove(getComputerChoice());
                            // check if playerOne won
                            if (checkForWinner(playerTwo)) {
                                // winner found
                                winnerFound = true;
                                playerTwoWon = true;
                                playerTwo.score++;
                                console.log("Player 2 won");

                                return;
                            }

                        // check that playerTwo has actually played
                        if (playerTwo.movesLength() > movesArrayLength) {
                            // set playerTwoTurn to false so that he doesn't make more than one move in his turn
                            playerTwoTurn = false;
                            // make next player to be player 1
                            playerOneTurn = true;
                            count++;
                        }
                } 
            }
        }

    // display the result
    const displayResult = () => {
        if (winningPattern === "") {
            isGameDraw = true;
        }
        return { playerOneWon, playerTwoWon, isGameDraw, winningPattern };
    }

    const resetGameValues = () => {
        winnerFound = false;  
        isGameDraw = false;   
        playerOneTurn = true;   
        playerTwoTurn = false;  
        playerOneWon = false;
        playerTwoWon = false;
        winningPattern = "";
        count = 1;
    };

    const checkForWinner = function(player) {
        let difference;
        let win = false;
        for (const key in winningMoves) {
            if (key !== "12") {
                difference = winningMoves[key].
                filter(x => player.moves.indexOf(x) < 0);
                if(difference.length === 0) {
                    win = true;
                    winningPattern =  {moves: winningMoves[key]};
                    return win;
                }
            }
            if (key === "12") {
                for (let i = 0; i < winningMoves["12"].length; i++) {
                    difference =  winningMoves["12"][i].
                    filter(item => player.moves.indexOf(item) < 0);
                    if (difference.length === 0) {
                        win = true;
                        winningPattern =  {moves: winningMoves[12][i]};
                        return true;
                    }
                }
            }
        }
    }

    // generate radom index (id) for computer [playerTwo : O]
   function getComputerChoice() {
    // let availableBoxes = gameBoard.getAvailableBoxes();
    let availableBoxes = gameBoard.shuffleGameBoard(gameBoard.getAvailableBoxes());
    let lengthOfAvailableBoxes = availableBoxes.length;
    const index = availableBoxes[
            Math.floor(Math.random() * lengthOfAvailableBoxes)
            ]; 
    return index; // this slot is available
    }

    return { play, displayResult, resetGameValues, playerOne, playerTwo, winningPattern };
})();