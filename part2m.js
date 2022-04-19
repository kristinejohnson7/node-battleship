var rs = require("readline-sync");

class Game {
  constructor() {
    this.gridSize = 9;
    this.gameBoard = {};
    this.strikeLocation = [];
    this.shipCount = 5;
    // this.occupiedSquares = [];
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
    this.gridSize = rs.question(
      `What size would you like your board? (Enter one number only) `,
      {
        limit: /^[1-9]$/i,
        limitMessage: "That is not a proper entry. Try again. ",
      }
    );
    this.gameBoard = this.createGrid(this.gridSize);
    this.startShipsProcess();
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

  startShipsProcess() {
    for (const ship of this.ships) {
      this.generateRandomLocation(this.gameBoard, this.gridSize, ship);
    }
    console.table(this.gameBoard);
    // process.exit();
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  generateRandomLocation(grid, max, ship) {
    let foundEmptySpotAndDidPlace = false;
    let allSquaresAreAvailable = false;
    let directionString;
    let valid;

    while (!foundEmptySpotAndDidPlace) {
      let x = this.getRandomInt(max);
      let y = this.getRandomInt(max);

      [valid, directionString] = this.checkAllSquaresBasedOnDirectionFromPoint(
        x,
        y,
        ship
      );

      if (valid) {
        this.placeShipStartingPointAtLocation(
          x,
          y,
          "S",
          grid,
          directionString,
          ship
        );
        foundEmptySpotAndDidPlace = true;
      }
    }
  }

  checkAllSquaresBasedOnDirectionFromPoint(column, row, ship) {
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

  placeShipStartingPointAtLocation(x, y, c, grid, direction, ship) {
    // let direction;

    if (direction === "right") {
      console.log(direction);
      console.log(ship.size);
      for (let i = 0; i < ship.size; i++) {
        grid[y][x + i] = c;

        ship.coordinates.push(`${x + i}-${y}`);
      }
    } else if (direction === "left") {
      console.log(direction);
      console.log(ship.size);
      for (let i = 0; i < ship.size; i++) {
        grid[y][x - i] = c;

        ship.coordinates.push(`${x - i}-${y}`);
      }
    } else if (direction === "down") {
      console.log(direction);
      console.log(ship.size);
      for (let i = 0; i < ship.size; i++) {
        grid[y + i][x] = c;

        ship.coordinates.push(`${x}-${y + i}`);
      }
    } else if (direction === "up") {
      console.log(direction);
      console.log(ship.size);
      for (let i = 0; i < ship.size; i++) {
        grid[y - i][x] = c;

        ship.coordinates.push(`${x}-${y - i}`);
      }
    }
  }

  //convert strike coordinate letter to number

  getCoordinate() {
    this.strikeLocation = rs.question(
      `Enter a location to strike i.e., 'A2'. `,
      {
        limit: /^[a-j][1-9]$/i,
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

  //game play

  attackPlay(y, x, grid) {
    if (grid[y][x] == "S") {
      grid[y][x] = "!";

      // find which ship.coordinates contains this y,x.
      //once you know ship
      //check all coords for that ship === !
      // if YES, THEN count --

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
