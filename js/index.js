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
        if (getGameBoardItem(index) === false) {
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
function createPlayer(marker="&#10005;") {
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
            !gameBoard.getGameBoardItem(index))
             {
            // add the id to the 'moves'
            moves.push(index); 
            // gameBoard.updateGameBoard(index);
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
const game = (function(doc) {
    // winningMoves object
    const winningMoves = {
        three: [0, 1, 2],
        nine: [0, 3, 6],
        zero48: [0, 4, 8],
        one47: [1, 4, 7],
        two46: [2, 4, 6],
        three45: [3, 4, 5],
        fifteen: [2, 5, 8],
        twenty1: [6, 7, 8],
    };

    let x;
    let y;
    let xScore;
    let oScore;
    // wrap this in a function
    if (!!doc) {
        x = doc.querySelector(".xButton");
        y = doc.querySelector(".yButton");
        xScore = doc.querySelector("#xScore");
        oScore = doc.querySelector("#oScore");
    }

        const playerOne = createPlayer(); // update this line to get the marker from the button element
        const playerTwo = createPlayer(); // update this line to get the marker from the button element
        const restart = doc.querySelector("#restart");
        
        let winnerFound = false;  // initially no winner yet
        let isGameDraw = false;   // initially set to false
        let playerOneTurn = true;   // to keep track of whose turn to make a move 
        let playerTwoTurn = false;  // 'X' goes first, so it is set to true initially
        let playerOneWon = false;
        let playerTwoWon = false;
        let winningPattern = "";
        let count = 0;

        restart.addEventListener("click", () => {
            restartGame();
        });

        const play = () => {
            const board = doc.querySelector(".article");
            let index;
           
            board.addEventListener("click", (e) => {
                let id = e.target.id;
                index = Number(id.slice(1));

                 // keep playing game is it's not a tie and there's no winner yet
            if (!winnerFound && count < 10) {
                console.log(count);
                if (playerOneTurn && !winnerFound) {
                    console.log("yes");
                    let movesArrayLength = playerOne.movesLength();
                    playerOne.makeMove(index);
                    console.log(index);

                    // check if move is valid and update board
                    if (!gameBoard.getGameBoardItem(index)) {
                        gameBoard.updateGameBoard(index);
                        let box = doc.querySelector(`#${id}`);
                        box.innerHTML = "&#10005;" 
                        console.log("X updated");
                    }
                   
                    // check if playerOne won
                    if (checkForWinner(playerOne)) {
                        winnerFound = true;
                        playerOneWon = true;
                        count = 9;
                        playerOne.score++;
                        xScore.textContent = playerOne.score;
                        // highlight winning cells
                        let winningCells = updateResult().winningPattern;

                        winningCells.forEach(cell => {
                            let elem = doc.querySelector(`#b${cell}`);
                            elem.classList.toggle("playerOneWon");
                            elem.style.border = "3px solid #bda314";
                            
                        });

                        console.log(winningCells);

                        console.log("Player 1 won", playerOneWon);
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
                            playerTwo.makeMove(index);

                            if (!gameBoard.getGameBoardItem(index)) {
                                gameBoard.updateGameBoard(index);
                                let box = doc.querySelector(`#${id}`);
                                box.innerHTML = "&#79;"
                                console.log("O updated");
                            }
                         
                            // playerTwo.makeMove(getComputerChoice());
                            // check if playerOne won
                            if (checkForWinner(playerTwo)) {
                                winnerFound = true;
                                playerTwoWon = true;
                                count = 9;
                                playerTwo.score++;
                                oScore.textContent = playerTwo.score;
                                // highlight winning cells
                                let winningCells = updateResult().winningPattern;
                                winningCells.forEach(cell => {
                                    let elem = doc.querySelector(`#b${cell}`);
                                    console.log(elem);

                                    elem.classList.toggle("playerTwoWon");
                                    elem.style.border = "3px solid #600606";

                            });

                                console.log(count);
                                console.log("Player 2 won", playerTwoWon);
                                console.log(count);


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

                // check if it's a tie
                if (count === 9 && playerOneWon === false && playerTwoWon === false) {
                    isGameDraw = true;
                    console.log("It's a tie", isGameDraw);
                    
                    console.log(count);

                    count++;
                    return;
                }
            }
            });
        }

   // get game result
    const updateResult = () => {
        return { playerOneWon, playerTwoWon, isGameDraw, winningPattern };
    }

    // const resetGameValues
    const restartGame = () => {
        const boxes = doc.querySelectorAll(".box");
        winnerFound = false;  
        isGameDraw = false;   
        playerOneTurn = true;   
        playerTwoTurn = false;  
        playerOneWon = false;
        playerTwoWon = false;
        winningPattern = "";
        gameBoard.resetGameBoard();
        game.playerOne.clearMoves();
        game.playerTwo.clearMoves();
        count = 0;

        boxes.forEach(box => {
            box.textContent = "";
            box.classList.remove("playerTwoWon");
            box.classList.remove("playerOneWon");
            box.style.border = "3px solid #fff";
        });
        game.play();
    };

    const checkForWinner = function(player) {
        let difference;
        let win = false;
        if (player.movesLength() >= 3) {
            for (const key in winningMoves) {
                    difference = winningMoves[key].
                    filter(x => player.moves.indexOf(x) < 0);
                    console.log(difference.length);
    
                    if(difference.length === 0) {
                        win = true;
                        winningPattern =  winningMoves[key];
                        updateResult()["winningPattern"] = winningPattern;
                        return win;
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

    return { play, restartGame, playerOne, playerTwo, updateResult };
})(document);

// playerOneWon, playerTwoWon, isGameDraw, winningPattern 