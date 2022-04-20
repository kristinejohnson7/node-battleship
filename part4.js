var rs = require("readline-sync");

class Game {
  constructor() {
    this.myGameBoard = [];
    this.computerGameBoard = [];
    this.strikeLocation = [];
    this.shipCount = 5;
    this.myShips = [
      { name: "destroyer", size: 2, coordinates: [] },
      { name: "cruiser1", size: 3, coordinates: [] },
      { name: "cruiser2", size: 3, coordinates: [] },
      { name: "battleship", size: 4, coordinates: [] },
      { name: "carrier", size: 5, coordinates: [] },
    ];
    this.computerShips = [
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
      `What size would you like your boards? (Enter one number only) `,
      {
        limit: /^([1-9]|10)$/i,
        limitMessage: "That is not a proper entry. Try again. ",
      }
    );
    this.myGameBoard = this.createGrid(this.gridSize);
    this.computerGameBoard = this.createGrid(this.gridSize);
    this.printGrid(this.computerGameBoard, true);
    this.startShipsProcess(this.myShips, this.myGameBoard);
    this.startShipsProcess(this.computerShips, this.computerGameBoard);
    this.getCoordinate();
  }

  //create game board

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

  //print game board

  printGrid(grid, isEnemy = false) {
    const headers = this.createHeaders(grid.length); //x-axis
    console.log(headers);
    for (let i = 0; i < grid.length; i++) {
      let alpha = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
      let rowStr = alpha[i] + " ";
      for (let cell of grid[i]) {
        if (isEnemy && cell == "S") {
          rowStr += "- ";
        } else {
          rowStr += cell + " ";
        }
      }
      console.log(rowStr);
    }
  }

  createHeaders(size) {
    let result = "  ";
    for (let i = 0; i < size; i++) {
      result = result + (i + 1) + " ";
    }
    return result;
  }

  drawBreak() {
    console.log("----------------------------------------");
  }

  // place ship

  startShipsProcess(ships, board) {
    for (const ship of ships) {
      this.generateRandomLocation(board, this.gridSize, ship);
    }
    console.table(board);
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  generateRandomLocation(board, max, ship) {
    let didPlace = false;
    let directionString;
    let valid;

    while (!didPlace) {
      let x = this.getRandomInt(max);
      let y = this.getRandomInt(max);

      [valid, directionString] = this.generateRandomDirection(
        x,
        y,
        ship,
        board
      );

      if (valid) {
        this.placeShip(x, y, "S", board, directionString, ship);
        didPlace = true;
      }
    }
  }

  generateRandomDirection(column, row, ship, board) {
    let valid = false;
    let direction = Math.floor(Math.random() * 4) + 1;
    let directionString = "";

    if (direction === 1) {
      // right
      for (let index = 0; index < ship.size; index++) {
        if (
          column + index >= board.length ||
          board[row][column + index] === "S" ||
          board[row][column + index] === undefined
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
          board[row][column - index] === "S" ||
          board[row][column - index] === undefined
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
          row + index >= board.length ||
          board[row + index][column] === "S" ||
          board[row + index][column] === undefined
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
          board[row - index][column] === "S" ||
          board[row - index][column] === undefined
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
    // let direction;

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

  getCoordinate() {
    this.strikeLocation = rs.question(
      `Enter a location to strike i.e., 'A2'. `,
      {
        limit: /^[a-j](10|[1-9])$/i,
        limitMessage: "That is not a proper location. Try again.",
      }
    );
    this.strikeLocation = this.strikeLocation.split("");
    this.convertNumber(this.strikeLocation[1], 1);
    this.sumChars(this.strikeLocation[0], board);
  }

  convertNumber(n, i) {
    this.strikeLocation[1] = n - i;
  }

  sumChars(s, board) {
    var i,
      n = s.length,
      acc = 0;
    for (i = 0; i < n; i++) {
      acc += parseInt(s[i], 36) - 10;
    }

    return (
      this.strikeLocation.splice(0, 1, acc),
      this.attackPlay(this.strikeLocation[0], this.strikeLocation[1], board)
    );
  }

  //game play

  trackShipSunkCount(y, x, grid) {
    for (const ship of this.ships) {
      if (ship.coordinates.includes(`${x}-${y}`)) {
        if (grid[y][x] === "X") {
          ship.size--;
          if (ship.size === 0) {
            this.shipCount--;
            if (this.shipCount === 0) {
              this.endGame();
            } else {
              console.log(
                `Hit. You have sunk a battleship. ${this.shipCount} ships remaining.`
              );
              this.printGrid(grid, true);
              this.drawBreak();
              this.getCoordinate();
            }
          } else {
            console.log(
              `Hit! The ship is still standing! There are ${this.shipCount} remaining!`
            );
            this.printGrid(grid, true);
            this.drawBreak();
            this.getCoordinate();
          }
        }
      }
    }
  }

  attackPlay(y, x, grid) {
    if (grid[y][x] == "S") {
      (grid[y][x] = "X"), this.trackShipSunkCount(y, x, grid);
      if (this.shipCount === 0) {
        this.endGame();
      }
    } else if (grid[y][x] == "-") {
      grid[y][x] = "O";
      return (
        console.log("You have missed!"),
        this.printGrid(grid, true),
        this.drawBreak(),
        this.getCoordinate()
      );
    } else {
      return (
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

class User extends Game {
  constructor() {
    this.whatever = 0;
  }
}

class Computer extends Game {
  constructor() {
    this.whatever = 0;
  }
}

const newGame = new Game();

newGame.beginGame();
