var rs = require("readline-sync");

class Game {
  constructor() {
    this.boardSize = 3;
    this.shipCount = 2;
    this.shipLocations = {};
  }

  // functions

  beginGame() {
    rs.keyIn("Press any key to start the game. ");
    this.myBoard = this.createBoard(this.boardSize);
    this.placeShips(this.shipCount);
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

  //convert letter to number

  getStrike() {
    this.strike = rs.question(`Enter a location to strike i.e., 'A2'. `, {
      limit: /^[abc][123]$/i,
      limitMessage: "That is not a proper location. Try again.",
    });
    this.strike = this.strike.split("");
    this.convertNumber(this.strike[1], 1);
    this.sumChars(this.strike[0]);
  }

  convertNumber = (n, i) => (this.strike[1] = n - i);

  sumChars(s) {
    var i,
      n = s.length,
      acc = 0;
    for (i = 0; i < n; i++) {
      acc += parseInt(s[i], 36) - 10;
    }

    return (
      this.strike.splice(0, 1, acc),
      this.attackPlay(this.strike[0], this.strike[1], this.myBoard)
    );
  }

  // place ship

  placeShips = (ships) => {
    for (let i = 0; i < ships; i++) {
      this.generateRandomLocation("S", this.myBoard, this.boardSize);
    }
  };

  getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

  generateRandomLocation(c, board, max) {
    let didPlace = false;
    while (!didPlace) {
      let x = this.getRandomInt(max);

      let y = this.getRandomInt(max);

      if (!this.shipLocations[`${x}-${y}`]) {
        this.placeCharacterAtLocation(x, y, c, board);

        didPlace = true;
        this.shipLocations[`${x}-${y}`] = true;
      }
    }
  }

  placeCharacterAtLocation(x, y, c, board) {
    board[y][x] = c;
  }

  //game play

  attackPlay(y, x, board) {
    if (board[y][x] == "S") {
      board[y][x] = "!";

      this.shipCount--;
      if (this.shipCount === 0) {
        this.endGame();
      } else
        return (
          true,
          console.log(
            `Hit. You have sunk a battleship. ${this.shipCount} ship remaining.`
          ),
          this.getStrike()
        );
    } else if (board[y][x] == "-") {
      board[y][x] = "x";
      return false, console.log("You have missed!"), this.getStrike();
    } else {
      return (
        false,
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
