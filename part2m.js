var rs = require("readline-sync");

class Game {
  constructor() {
    this.gridSize = 9;
    this.gameBoard = {};
    this.strikeLocation = [];
    this.shipCount = 5;
    this.occupiedSquares = [];
    this.ships = [
      { name: "destroyer", size: 2, coordinates: [] },
      { name: "cruiser1", size: 3, coordinates: [] },
      { name: "cruiser2", size: 3, coordinates: [] },
      { name: "battleship", size: 4, coordinates: [] },
      { name: "carrier", size: 5, coordinates: [] },
    ];
  }

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
      this.generateRandomLocation(this.gameBoard, this.gridSize);
    }
    console.table(this.gameBoard);
    process.exit();
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  generateRandomLocation(grid, max) {
    let foundEmptySpotAndDidPlace = false;
    let allSquaresAreAvailable = false;
    let directionString;
    let valid;

    while (!foundEmptySpotAndDidPlace) {
      let x = this.getRandomInt(max);
      let y = this.getRandomInt(max);

      if (!this.occupiedSquares.includes(`${x}-${y}`)) {
        [valid, directionString] =
          this.checkAllSquaresBasedOnDirectionFromPoint(x, y);

        if (valid) {
          this.placeShipStartingPointAtLocation(
            x,
            y,
            "S",
            grid,
            directionString
          );
          foundEmptySpotAndDidPlace = true;
        }
      }
    }
  }

  checkAllSquaresBasedOnDirectionFromPoint(column, row) {
    let valid = false;
    let direction = Math.floor(Math.random() * 4) + 1;
    let directionString = "";

    if (direction === 1) {
      // right
      for (let index = 0; index < 3; index++) {
        if (
          column + index >= 9 ||
          this.gameBoard[row][column + index] === "S" ||
          this.gameBoard[row][column + index] === undefined
        ) {
          directionString = "right";
          return [valid, directionString];
        }
      }
      valid = true;
      directionString = "right";
      return [valid, directionString];
    } else if (direction === 2) {
      // left
      for (let index = 0; index < 3; index++) {
        if (
          column - index < 0 ||
          this.gameBoard[row][column - index] === "S" ||
          this.gameBoard[row][column - index] === undefined
        ) {
          directionString = "left";
          return [valid, directionString];
        }
      }
      valid = true;
      directionString = "left";
      return [valid, directionString];
    } else if (direction === 3) {
      // down
      for (let index = 0; index < 2; index++) {
        if (
          row + index >= 9 ||
          this.gameBoard[row + index][column] === "S" ||
          this.gameBoard[row + index][column] === undefined
        ) {
          directionString = "down";
          return [valid, directionString];
        }
      }
      valid = true;
      directionString = "down";
      return [valid, directionString];
    } else if (direction === 4) {
      // up
      for (let index = 0; index < 2; index++) {
        if (
          row - index < 0 ||
          this.gameBoard[row - index][column] === "S" ||
          this.gameBoard[row - index][column] === undefined
        ) {
          directionString = "up";
          return [valid, directionString];
        }
      }
      valid = true;
      directionString = "up";
      return [valid, directionString];
    }
  }

  placeShipStartingPointAtLocation(x, y, c, grid, direction) {
    // let direction;

    if (direction === "right") {
      console.log(direction);
      for (let i = 0; i < 3; i++) {
        grid[y][x + i] = c;

        this.occupiedSquares.push(`${x + i}-${y}`);
      }
    } else if (direction === "left") {
      console.log(direction);
      for (let i = 0; i < 3; i++) {
        grid[y][x - i] = c;

        this.occupiedSquares.push(`${x - i}-${y}`);
      }
    } else if (direction === "down") {
      console.log(direction);
      for (let i = 0; i < 2; i++) {
        grid[y + i][x] = c;

        this.occupiedSquares.push(`${x}-${y + i}`);
      }
    } else if (direction === "up") {
      console.log(direction);
      for (let i = 0; i < 2; i++) {
        grid[y - i][x] = c;

        this.occupiedSquares.push(`${x}-${y - i}`);
      }
    }
  }
}

const newGame = new Game();

newGame.beginGame();

// class Game {
//   constructor() {
//     this.gridSize = 9;
//     this.gameBoard = [];
//     this.strikeLocation = [];
//     this.char = 1;
//     this.shipCount = 1;
//     this.occupiedSquares = [];
//   }

//   beginGame() {
//     this.gameBoard = this.createGrid(this.gridSize);
//     this.startShipsProcess(this.shipCount);
//   }

//   createGrid(size) {
//     let grid = [];
//     for (let i = 0; i < size; i++) {
//       grid[i] = [];
//       for (let j = 0; j < size; j++) {
//         grid[i][j] = "-";
//       }
//     }
//     return grid;
//   }

//   startShipsProcess(count) {
//     for (let i = 0; i <= 1; i++) {
//       this.generateRandomLocation("S", this.gameBoard, this.gridSize);
//     }

//     console.table(this.gameBoard);
//     process.exit();
//   }

//   getRandomInt(max) {
//     return Math.floor(Math.random() * Math.floor(max));
//   }

//   generateRandomLocation(c, grid, max) {
//     let locationIsValid = false;
//     let direction = "";
//     let row, column;

//     while (!locationIsValid) {
//       let x = this.getRandomInt(max);
//       let y = this.getRandomInt(max);

//       [row, column, direction, locationIsValid] = this.locationChecker(x, y);
//       console.log(row, column, direction, locationIsValid);
//     }

//     if (direction === "right") {
//       for (let i = 0; i < 5; i++) {
//         grid[column][row + i] = "R";
//         let xA = row + i;
//         this.occupiedSquares.push(`${xA}-${column}`);
//       }
//     } else if (direction === "left") {
//       for (let i = 5; i > 0; i++) {
//         grid[column][row - i] = "L";
//         let xB = row - i;
//         this.occupiedSquares.push(`${xB}-${column}`);
//       }
//     }
//   }

//   locationChecker(x, y) {
//     let locationIsValid = false;
//     let direction = "";

//     if (this.occupiedSquares.includes(`${x}-${y}`)) {
//       return [x, y, direction, locationIsValid];
//     }

//     let randomDirection = Math.ceil(Math.random() * 2);

//     if (randomDirection === 1) {
//       direction = "right";

//       for (let i = 0; i < 5; i++) {
//         if (
//           y + i > this.gameBoard.length ||
//           this.gameBoard[y][x + i] === NaN ||
//           this.gameBoard[y][x + i] === "undefined"
//         ) {
//           return [x, y, direction, locationIsValid];
//         } else {
//           locationIsValid = true;
//           return [x, y, direction, locationIsValid];
//         }
//       }
//     }

//     if (randomDirection === 2) {
//       direction = "left";

//       for (let i = 5; i > 0; i--) {
//         if (
//           y - i < 0 ||
//           this.gameBoard[y][x - i] === NaN ||
//           this.gameBoard[y][x - i] === "undefined"
//         ) {
//           return [x, y, direction, locationIsValid];
//         } else {
//           locationIsValid = true;
//           return [x, y, direction, locationIsValid];
//         }
//       }
//     }
//   }
// }

// const newGame = new Game();

// newGame.beginGame();
