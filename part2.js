var rs = require("readline-sync");

class Game {
  constructor() {
    this.gameBoard = [];
    this.shipCount = 5;
    this.ships = [
      { name: "destroyer", size: 2, coordinates: [] },
      { name: "cruiser1", size: 3, coordinates: [] },
      { name: "cruiser2", size: 3, coordinates: [] },
      { name: "battleship", size: 4, coordinates: [] },
      { name: "carrier", size: 5, coordinates: [] },
    ];
  }

  beginGame() {
    rs.keyIn("Press any key to start the game. ");
    this.boardSize = rs.question(
      `What size would you like your board? (Enter one number only) `,
      {
        limit: /^([5-9]|10)$/i,
        limitMessage:
          "That is not a proper entry, board must be bigger than 4. Try again. ",
      }
    );
    this.gameBoard = this.createBoard(this.boardSize);
    this.startShipsProcess();
    this.getStrike();
  }

  createBoard(size) {
    let board = [];
    for (let i = 0; i < size; i++) {
      board[i] = [];
      for (let j = 0; j < size; j++) {
        board[i][j] = "-";
      }
    }
    return board;
  }

  // place ship

  startShipsProcess = () => {
    for (const ship of this.ships) {
      this.generateRandomLocation(this.gameBoard, this.boardSize, ship);
    }
  };

  getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

  generateRandomLocation(board, max, ship) {
    let didPlace = false;
    let directionString;
    let valid;

    while (!didPlace) {
      let x = this.getRandomInt(max);
      let y = this.getRandomInt(max);

      [valid, directionString] = this.generateRandomDirection(x, y, ship);

      if (valid) {
        this.placeShip(x, y, "S", board, directionString, ship);
        didPlace = true;
      }
    }
  }

  generateRandomDirection(column, row, ship) {
    let valid = false;
    let direction = Math.floor(Math.random() * 4) + 1;
    let directionString = "";

    if (direction === 1) {
      // right
      for (let index = 0; index < ship.size; index++) {
        if (
          column + index >= this.gameBoard.length ||
          this.gameBoard[row][column + index] === "S" ||
          this.gameBoard[row][column + index] === undefined
        ) {
          return [valid, directionString];
        }
      }
      valid = true;
      directionString = "right";
      return [valid, directionString];
    } else if (direction === 2) {
      // left
      for (let index = 0; index < ship.size; index++) {
        if (
          column - index < 0 ||
          this.gameBoard[row][column - index] === "S" ||
          this.gameBoard[row][column - index] === undefined
        ) {
          return [valid, directionString];
        }
      }
      valid = true;
      directionString = "left";
      return [valid, directionString];
    } else if (direction === 3) {
      // down
      for (let index = 0; index < ship.size; index++) {
        if (
          row + index >= this.gameBoard.length ||
          this.gameBoard[row + index][column] === "S" ||
          this.gameBoard[row + index][column] === undefined
        ) {
          return [valid, directionString];
        }
      }
      valid = true;
      directionString = "down";
      return [valid, directionString];
    } else if (direction === 4) {
      // up
      for (let index = 0; index < ship.size; index++) {
        if (
          row - index < 0 ||
          this.gameBoard[row - index][column] === "S" ||
          this.gameBoard[row - index][column] === undefined
        ) {
          return [valid, directionString];
        }
      }
      valid = true;
      directionString = "up";
      return [valid, directionString];
    }
  }

  placeShip(x, y, c, board, direction, ship) {
    if (direction === "right") {
      for (let i = 0; i < ship.size; i++) {
        board[y][x + i] = c;

        ship.coordinates.push(`${x + i}-${y}`);
      }
    } else if (direction === "left") {
      for (let i = 0; i < ship.size; i++) {
        board[y][x - i] = c;

        ship.coordinates.push(`${x - i}-${y}`);
      }
    } else if (direction === "down") {
      for (let i = 0; i < ship.size; i++) {
        board[y + i][x] = c;

        ship.coordinates.push(`${x}-${y + i}`);
      }
    } else if (direction === "up") {
      for (let i = 0; i < ship.size; i++) {
        board[y - i][x] = c;

        ship.coordinates.push(`${x}-${y - i}`);
      }
    }
  }

  //convert strike coordinate letter to number

  getStrike() {
    this.strikeLocation = rs.question(
      `Enter a location to strike i.e., 'A2'. `,
      {
        limit: /^[a-j]([1-9]|10)$/i,
        limitMessage: "That is not a proper location. Try again.",
      }
    );
    this.splitStrike(this.strikeLocation);
  }

  splitStrike(strike) {
    this.strikeLocationNumber = parseInt(
      this.convertNumber(strike.slice(1), 1)
    );
    this.strikeLocationAlpha = this.sumChars(strike.slice(0, 1));
  }

  convertNumber = (n, i) => (n = n - i);

  sumChars(s) {
    var i,
      n = s.length,
      acc = 0;
    for (i = 0; i < n; i++) {
      acc += parseInt(s[i], 36) - 10;
    }

    return this.attackPlay(acc, this.strikeLocationNumber, this.gameBoard);
  }

  //game play

  trackShipSunkCount(y, x, board) {
    for (const ship of this.ships) {
      if (ship.coordinates.includes(`${x}-${y}`)) {
        if (board[y][x] === "!") {
          ship.size--;
          if (ship.size === 0) {
            this.shipCount--;
            if (this.shipCount === 0) {
              this.endGame();
            } else {
              console.log(
                `Hit. You have sunk a battleship. ${this.shipCount} remaining.`
              ),
                this.getStrike();
            }
          } else {
            console.log(
              `Hit! The ship is still standing! ${this.shipCount} remaining!`
            ),
              this.getStrike();
          }
        }
      }
    }
  }

  attackPlay(y, x, board) {
    if (y >= this.boardSize || x >= this.boardSize) {
      console.log("That is not a proper location. Try again");
      this.getStrike();
    }
    if (board[y][x] == "S") {
      (board[y][x] = "!"), this.trackShipSunkCount(y, x, board);
      if (this.shipCount === 0) {
        this.endGame();
      }
    } else if (board[y][x] == "-") {
      board[y][x] = "x";
      return console.log("You have missed!"), this.getStrike();
    } else {
      return (
        console.log("You have already picked this location. Miss!"),
        this.getStrike()
      );
    }
  }

  endGame() {
    if (
      rs.keyInYN(
        "You have destroyed all battleships. Would you like to play again? Y/N"
      )
    ) {
      let anotherGame = new Game();
      anotherGame.beginGame();
    } else {
      console.log("See you next time!");
      process.exit();
    }
  }
}

const newGame = new Game();

newGame.beginGame();
