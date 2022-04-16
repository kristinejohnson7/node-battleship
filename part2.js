var rs = require("readline-sync");

class Game {
  constructor() {
    this.gridSize = "";
    this.myGrid = "";
    this.coordinate = [];
    this.shipCount = 5;
    this.ships = [
      { name: "destroyer", cells: 2, coordinates: [] },
      { name: "cruiser1", cells: 3, coordinates: [] },
      { name: "cruiser2", cells: 3, coordinates: [] },
      { name: "battleship", cells: 4, coordinates: [] },
      { name: "carrier", cells: 5, coordinates: [] },
    ];
    this.attempts = [];
    this.shipLocations = {};
  }

  // functions

  beginGame() {
    rs.keyIn("Press any key to start the game. ");
    this.gridSize = rs.question(
      `What size would you like your board? (Enter one number only) `,
      {
        limit: /^[1-9]$/i,
        limitMessage: "That is not a proper entry. Try again. ",
      }
    );
    this.myGrid = this.createGrid(this.gridSize);
    this.placeShips(this.shipCount);
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
      this.attackPlay(this.coordinate[0], this.coordinate[1], this.myGrid)
    );
  }

  // place ship

  placeShips(ships) {
    for (let i = 0; i < ships; i++) {
      this.generateRandomLocation("S", this.myGrid, this.gridSize);
    }
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  generateRandomLocation(c, grid, max) {
    let didPlace = false;
    while (!didPlace) {
      let x = this.getRandomInt(max);

      let y = this.getRandomInt(max);

      if (!this.shipLocations[`${x}-${y}`]) {
        this.placeCharacterAtLocation(x, y, c, grid);

        didPlace = true;
        this.shipLocations[`${x}-${y}`] = true;
      }
    }
  }

  placeCharacterAtLocation(x, y, c, grid) {
    grid[y][x] = c;
    console.table(grid);
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
