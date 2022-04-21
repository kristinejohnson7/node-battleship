var rs = require("readline-sync");

class Game {
  constructor() {
    this.boardSize = 3;
    this.myBoard = this.createBoard(this.boardSize);
    this.coordinate = [];
    this.shipCount = 2;
    this.attempts = [];
    this.shipLocations = {};
  }

  // functions

  beginGame() {
    rs.keyIn("Press any key to start the game. ");
    this.placeShips(this.shipCount);
    this.getCoordinate();
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

  getCoordinate() {
    this.coordinate = rs.question(`Enter a location to strike i.e., 'A2'. `, {
      limit: /^[abc][123]$/i,
      limitMessage: "That is not a proper location. Try again.",
    });
    this.coordinate = this.coordinate.split("");
    this.convertNumber(this.coordinate[1], 1);
    this.sumChars(this.coordinate[0]);
  }

  convertNumber(n, i) {
    this.coordinate[1] = n - i;
  }

  sumChars(s) {
    var i,
      n = s.length,
      acc = 0;
    for (i = 0; i < n; i++) {
      acc += parseInt(s[i], 36) - 10;
    }

    return (
      this.coordinate.splice(0, 1, acc),
      this.attackPlay(this.coordinate[0], this.coordinate[1], this.myBoard)
    );
  }

  // place ship

  placeShips(ships) {
    for (let i = 0; i < ships; i++) {
      this.generateRandomLocation("S", this.myBoard, this.boardSize);
    }
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

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
    // console.table(grid);
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
          this.getCoordinate()
        );
    } else if (board[y][x] == "-") {
      board[y][x] = "x";
      return false, console.log("You have missed!"), this.getCoordinate();
    } else {
      return (
        false,
        console.log("You have already picked this location. Miss!"),
        this.getCoordinate()
      );
    }
  }

  endGame() {
    if (
      rs.keyInYN(
        "You have destroyed all battleships. Would you like to play again? Y/N"
      )
    ) {
      this.beginGame();
    } else {
      console.log("See you next time!");
      process.exit();
    }
  }
}

const newGame = new Game();

newGame.beginGame();
