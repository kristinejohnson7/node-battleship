var rs = require("readline-sync");

class Game {
  constructor() {
    this.gridSize = 9;
    this.gameBoard = {};
    this.strikeLocation = [];
    this.char = 1;

    this.shipCount = 5;

    this.ships = [
      { name: "destroyer", size: 2, coordinates: [] },
      { name: "cruiser1", size: 3, coordinates: [] },
      { name: "cruiser2", size: 3, coordinates: [] },
      { name: "battleship", size: 4, coordinates: [] },
      { name: "carrier", size: 5, coordinates: [] },
    ];
    // this.attempts = [];
    // this.shipLocations = {};

    this.occupiedSquares = [];
  }

  // functions

  beginGame() {
    // rs.keyIn("Press any key to start the game. ");
    // this.gridSize = rs.question(
    //   `What size would you like your board? (Enter one number only) `,
    //   {
    //     limit: /^[1-9]$/i,
    //     limitMessage: "That is not a proper entry. Try again. ",
    //   }
    // );
    this.gameBoard = this.createGrid(this.gridSize);
    this.startShipsProcess(this.shipCount);
    this.getCoordinate();
  }

  createGrid(size) {
    let grid = [];
    for (let i = 0; i < size; i++) {
      grid[i] = [];
      for (let j = 0; j < size; j++) {
        grid[i][j] = "-";
      }
    }
    return grid;
  }

  // place ship

  startShipsProcess(count) {
    for (let i = 0; i <= count; i++) {
      this.generateRandomLocation("S", this.gameBoard, this.gridSize);
    }

    console.table(this.gameBoard);
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  generateRandomLocation(c, grid, max) {
    let foundEmptySpotAndDidPlace = false;

    while (!foundEmptySpotAndDidPlace) {
      let x = this.getRandomInt(max);
      let y = this.getRandomInt(max);

      if (!this.occupiedSquares.includes(`${x}-${y}`)) {
        this.placeShipStartingPointAtLocation(x, y, c, grid);
        foundEmptySpotAndDidPlace = true;
        this.char++;
      }
    }
  }

  placeShipStartingPointAtLocation(x, y, c, grid, ship) {
    for (let i = 0; i < 3; i++) {
      grid[y][x + i] = this.char;

      let xA = x + i;
      this.occupiedSquares.push(`${xA}-${y}`);
    }
  }

  //game play

  attackPlay(y, x, grid) {
    if (grid[y][x] == "S") {
      grid[y][x] = "!";

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
    } else if (grid[y][x] == "-") {
      grid[y][x] = "x";
      return false, console.log("You have missed!"), this.getCoordinate();
    } else {
      return (
        false,
        console.log("You have already picked this location. Miss!"),
        this.getCoordinate()
      );
    }
  }

  //convert letter to number

  getCoordinate() {
    this.strikeLocation = rs.question(
      `Enter a location to strike i.e., 'A2'. `,
      {
        limit: /^[a-j][123]$/i,
        limitMessage: "That is not a proper location. Try again.",
      }
    );
    this.strikeLocation = this.strikeLocation.split("");
    this.convertNumber(this.strikeLocation[1], 1);
    this.sumChars(this.strikeLocation[0]);
  }

  convertNumber(n, i) {
    this.strikeLocation[1] = n - i;
  }

  sumChars(s) {
    var i,
      n = s.length,
      acc = 0;
    for (i = 0; i < n; i++) {
      acc += parseInt(s[i], 36) - 10;
    }

    return (
      this.strikeLocation.splice(0, 1, acc),
      this.attackPlay(
        this.strikeLocation[0],
        this.strikeLocation[1],
        this.gameBoard
      )
    );
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
