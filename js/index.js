// IIFE (module pattern) for gameBoard
const gameBoard = (function () {
  // Initial state of the gameBoard when nobody has played yet.
  let gameBoardArray = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];

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
  const isGameBoardFilledUp = () =>
    gameBoardArray.every((item) => item === true);

  const isGameBoardBlank = () => gameBoardArray.every((item) => item === false);

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
  };

  const shuffleGameBoard = (array) => {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  return {
    gameBoardArray,
    getGameBoardItem,
    updateGameBoard,
    isGameBoardFilledUp,
    resetGameBoard,
    getAvailableBoxes,
    shuffleGameBoard,
    isGameBoardBlank,
  };
})();

// User
function createUser(name) {
  const tictactoeName = "@" + name;
  const getTictactoeName = () => tictactoeName;

  return { name, getTictactoeName };
}

// Player
// The marker can be either 'X' or 'O'
// The marker ('X' or 'O') can be the value on the button
function createPlayer(marker = "&#10005;") {
  // Initial score for a player
  // This score will be increased by 1 if he wins a game
  const score = 0;

  const playerStatus = false;

  // This array contains the boxes on the board player ticked
  // The values will be gotten from the id on each box
  const moves = [];

  // index is the id of the box the player ticked
  // only add a move if the move is valid and if the board is not filled up
  const makeMove = (index) => {
    if (
      !gameBoard.isGameBoardFilledUp() &&
      !gameBoard.getGameBoardItem(index)
    ) {
      // add the id to the 'moves'
      moves.push(index);
    }
  };

  // get length of the moves array
  const movesLength = () => moves.length;

  // since a winner can be found only after 3 moves
  const getTotalMoves = () => {
    if (movesLength() >= 3) {
      return moves.reduce(
        (accumulator, currentValue) => accumulator + currentValue
      );
    }
  };

  const clearMoves = () => {
    if (movesLength() > 0) {
      moves.splice(0, movesLength());
    }
  };

  return {
    marker,
    getTotalMoves,
    makeMove,
    moves,
    movesLength,
    clearMoves,
    score,
    playerStatus,
  };
}

const game = (function (doc) {
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
  let btn;
  let xScore;
  let oScore;
  let XSCORE = 0;
  let OSCORE = 0;
  let winnerFound = false; // initially no winner yet
  let isGameDraw = false; // initially set to false
  let playerOneTurn = true; // to keep track of whose turn to make a move
  let playerTwoTurn = false; // 'X' goes first, so it is set to true initially
  let playerOneWon = false;
  let playerTwoWon = false;
  let winningPattern = "";
  let count = 0;

  const restart = doc.querySelector("#restart");

  // wrap this in a function
  if (!!doc) {
    btn = doc.querySelectorAll("button");
    xButton = doc.querySelector(".xButton");
    oButton = doc.querySelector(".oButton");
    xScore = doc.querySelector("#xScore");
    oScore = doc.querySelector("#oScore");
  }

  let playerOne = createPlayer(); // update this line to get the marker from the button element
  let playerTwo = createPlayer("&#79;"); // update this line to get the marker from the button element

  restart.addEventListener("click", () => {
    restartGame();
  });

  const play = () => {
    xButton.addEventListener("click", () => {
      if (!playerOne.playerStatus && !playerTwo.playerStatus) {
        playerOne.playerStatus = true;
        playerOne.marker = "&#10005;";
        playerTwo.marker = "&#79;";
        if (count === 0) {
          game.play();
        }
      }
    });

    oButton.addEventListener("click", () => {
      if (!playerTwo.playerStatus && !playerOne.playerStatus) {
        playerTwo.playerStatus = true;
        playerTwo.marker = "&#10005;";
        playerOne.marker = "&#79;";
        if (count === 0) {
          game.play();
        }
      }
    });

    const board = doc.querySelector(".article");
    let index;

    board.addEventListener("click", (e) => {
      if (
        gameBoard.isGameBoardBlank() &&
        !playerOne.playerStatus &&
        !playerTwo.playerStatus
      ) {
        playerOne.playerStatus = true;
      }

      let id = e.target.id;
      index = Number(id.slice(1));

      // keep playing game is it's not a tie and there's no winner yet
      if (!winnerFound && count < 10) {
        if (playerOneTurn && !winnerFound) {
          let movesArrayLength = playerOne.movesLength();
          playerOne.makeMove(index);

          // check if move is valid and update board
          if (!gameBoard.getGameBoardItem(index)) {
            gameBoard.updateGameBoard(index);
            let box = doc.querySelector(`#${id}`);
            box.innerHTML = playerOne.marker;
          }

          // check if playerOne won
          if (checkForWinner(playerOne)) {
            winnerFound = true;
            playerOneWon = true;
            count = 9;

            if (playerOne.marker === "&#10005;") {
              if (isNaN(Number(xScore.textContent))) {
                xScore.textContent = 0;
                xScore.textContent = ++xScore.textContent;
                playerOne.score = xScore.textContent;

                setXScore(Number(xScore.textContent));
              } else {
                xScore.textContent = ++xScore.textContent;
                playerOne.score = xScore.textContent;

                setXScore(Number(xScore.textContent));
              }
            } else {
              if (isNaN(Number(oScore.textContent))) {
                oScore.textContent = 0;
                oScore.textContent = ++oScore.textContent;
                playerOne.score = oScore.textContent;

                setOScore(Number(oScore.textContent));
              } else {
                oScore.textContent = ++oScore.textContent;
                playerOne.score = oScore.textContent;

                setOScore(Number(oScore.textContent));
              }
            }

            // highlight winning cells
            let winningCells = updateResult().winningPattern;

            winningCells.forEach((cell) => {
              let elem = doc.querySelector(`#b${cell}`);
              elem.classList.toggle("playerOneWon");
              elem.style.border = "3px solid #bda314";
            });

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
        } else if (playerTwoTurn && !winnerFound) {
          let movesArrayLength = playerTwo.movesLength();
          playerTwo.makeMove(index);

          if (!gameBoard.getGameBoardItem(index)) {
            gameBoard.updateGameBoard(index);
            let box = doc.querySelector(`#${id}`);
            box.innerHTML = playerTwo.marker; //"&#79;";
          }

          // playerTwo.makeMove(getComputerChoice());
          // check if playerOne won
          if (checkForWinner(playerTwo)) {
            winnerFound = true;
            playerTwoWon = true;
            count = 9;

            if (playerTwo.marker === "&#79;") {
              if (isNaN(Number(oScore.textContent))) {
                oScore.textContent = 0;
                oScore.textContent = ++oScore.textContent;
                playerTwo.score = oScore.textContent;

                setOScore(Number(oScore.textContent));
              } else {
                oScore.textContent = ++oScore.textContent;
                playerTwo.score = oScore.textContent;

                setOScore(Number(oScore.textContent));
              }
            } else {
              if (isNaN(Number(xScore.textContent))) {
                xScore.textContent = 0;
                xScore.textContent = ++xScore.textContent;
                playerTwo.score = xScore.textContent;

                setXScore(Number(xScore.textContent));
              } else {
                xScore.textContent = ++xScore.textContent;
                playerTwo.score = xScore.textContent;

                setXScore(Number(xScore.textContent));
              }
            }

            // highlight winning cells
            let winningCells = updateResult().winningPattern;
            winningCells.forEach((cell) => {
              let elem = doc.querySelector(`#b${cell}`);
              elem.classList.toggle("playerTwoWon");
              elem.style.border = "3px solid #600606";
            });

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

          displayResultMessage();

          count++;
          return;
        }
      }
    });
  };

  // get game result
  const updateResult = () => {
    return { playerOneWon, playerTwoWon, isGameDraw, winningPattern };
  };

  // const restartGame
  const restartGame = () => {
    const gameContainer = doc.querySelector(".gameContainer");
    const article = doc.querySelector(".article");

    if (doc.querySelector(".message")) {
      const message = doc.querySelector(".message");

      gameContainer.removeChild(message);

      gameContainer.insertBefore(article, restart);
    }

    const boxes = doc.querySelectorAll(".box");

    winnerFound = false;
    isGameDraw = false;
    playerOneTurn = true;
    playerTwoTurn = false;
    playerOneWon = false;
    playerTwoWon = false;
    playerOne.playerStatus = false;
    playerTwo.playerStatus = false;
    winningPattern = "";
    playerTwo.marker = "&#79;";
    playerOne.marker = "&#10005;";
    gameBoard.resetGameBoard();
    game.playerOne.clearMoves();
    game.playerTwo.clearMoves();
    count = 0;

    boxes.forEach((box) => {
      box.textContent = "";
      box.classList.remove("playerTwoWon");
      box.classList.remove("playerOneWon");
      box.style.border = "3px solid #fff";
    });

    game.play();
  };

  const setXScore = function (score) {
    XSCORE = score;
  };

  const setOScore = function (score) {
    OSCORE = score;
  };

  const getScore = function () {
    return { XSCORE, OSCORE };
  };

  const checkForWinner = function (player) {
    let difference;
    let win = false;
    if (player.movesLength() >= 3) {
      for (const key in winningMoves) {
        difference = winningMoves[key].filter(
          (x) => player.moves.indexOf(x) < 0
        );

        if (difference.length === 0) {
          win = true;
          winningPattern = winningMoves[key];
          updateResult()["winningPattern"] = winningPattern;
          return win;
        }
      }
    }
  };

  const gameIsDraw = function () {
    const gameContainer = doc.querySelector(".gameContainer");
    const info = doc.querySelector(".info");
    const restart = doc.querySelector("#restart");

    const messageDiv = doc.createElement("div");
    messageDiv.classList.toggle("message");

    messageDiv.innerHTML = "Game is a tie!<br> No Victor!<br> No Vanquished!";

    gameContainer.insertBefore(messageDiv, restart);
  };

  const displayResultMessage = function () {
    if (game.updateResult().isGameDraw) {
      const myTimeout = setTimeout(gameIsDraw, 5000);
    }
  };

  // generate radom index (id) for computer [playerTwo : O]
  function getComputerChoice() {
    // let availableBoxes = gameBoard.getAvailableBoxes();
    let availableBoxes = gameBoard.shuffleGameBoard(
      gameBoard.getAvailableBoxes()
    );
    let lengthOfAvailableBoxes = availableBoxes.length;
    const index =
      availableBoxes[Math.floor(Math.random() * lengthOfAvailableBoxes)];
    return index; // this slot is available
  }

  return {
    play,
    restartGame,
    playerOne,
    playerTwo,
    updateResult,
    displayResultMessage,
    gameIsDraw,
    getScore,
  };
})(document);
