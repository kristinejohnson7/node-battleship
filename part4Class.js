var rs = require("readline-sync");

class Game {
  constructor() {
    this.myGameBoard = [];
    this.computerGameBoard = [];
    this.strikeLocation = [];
    this.myShipCount = 5;
    this.computerShipCount = 5;
    this.computerAttackLog = [];
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

  //create game board

  createGrid(size) {
    let board = [];
    for (let i = 0; i < size; i++) {
      board[i] = [];
      for (let j = 0; j < size; j++) {
        board[i][j] = "-";
      }
    }
    return board;
  }

  //print game board

  printGrid(board, isEnemy = false) {
    const headers = this.createHeaders(board.length); //x-axis
    console.log(headers);
    for (let i = 0; i < board.length; i++) {
      let alpha = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
      let rowStr = alpha[i] + " ";
      for (let cell of board[i]) {
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

  endGame() {
    if (rs.keyInYN("Would you like to play again? Y/N")) {
      this.beginGame();
    } else {
      console.log("See you next time!");
      process.exit();
    }
  }
}

class User extends Game {
  constructor() {
    super();
  }

  convertNumber(n, i) {
    this.strikeLocation[1] = n - i;
  }

  getCoordinate(board) {
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

  sumChars(s, board) {
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
        this.computerGameBoard
      )
    );
  }

  trackShipSunkCount(y, x, board, ships) {
    for (const ship of ships) {
      if (ship.coordinates.includes(`${x}-${y}`)) {
        if (board[y][x] === "X") {
          ship.size--;
          if (ship.size === 0) {
            this.computerShipCount--;
            if (this.computerShipCount === 0) {
              console.log("Victory!! Take that computer!");
              this.endGame();
            } else {
              console.log(
                `Hit. You have sunk a battleship. ${this.computerShipCount} ships remaining.`
              );
              this.printGrid(board, true);
              this.drawBreak();
              this.strikeLoop();
            }
          } else {
            console.log(
              `Hit! The ship is still standing! There are ${this.computerShipCount} remaining!`
            );
            this.printGrid(board, true);
            this.drawBreak();
            this.strikeLoop();
          }
        }
      }
    }
  }

  attackPlay(y, x, board) {
    if (board[y][x] == "S") {
      board[y][x] = "X";
      this.trackShipSunkCount(y, x, board, this.computerShips);
    } else if (board[y][x] == "-") {
      board[y][x] = "O";
      console.log("You have missed!");
      this.printGrid(board, true);
      this.drawBreak();
      this.strikeLoop();
    } else {
      console.log("You have already picked this location. Miss!");
      this.printGrid(board, true);
      this.strikeLoop();
    }
  }
}

class Computer extends User {
  constructor() {
    super();
  }

  computerStrike(board, max) {
    let a = Math.floor(Math.random() * Math.floor(max));
    let b = Math.floor(Math.random() * Math.floor(max));
    if (this.computerAttackLog.includes(`${a}-${b}`)) {
      this.computerStrike(this.myGameBoard, this.gridSize);
    } else {
      this.computerAttackLog.push(`${a}-${b}`);
      this.computerAttack(a, b, board);
    }
  }

  trackMySunkShips(b, a, board, ships) {
    for (const ship of ships) {
      if (ship.coordinates.includes(`${a}-${b}`)) {
        if (board[b][a]) {
          ship.size--;
          console.log(`Computer has hit a battleship`);
          // this.printGrid(this.myGameBoard, true);
          if (ship.size === 0) {
            this.myShipCount--;
            console.log(
              `Computer has sunk a battleship. ${this.myShipCount} remaining.`
            );
            if (this.myShipCount === 0) {
              console.log("Lose it all!! Better luck next time human.");
              this.endGame();
            }
          }
        }
      }
    }
  }

  computerAttack(b, a, board) {
    if (board[b][a] === "S") {
      board[b][a] = "X";
      this.trackMySunkShips(b, a, board, this.myShips);
    } else if (board[b][a] === "-") {
      board[b][a] = "O";
      console.log("Computer has missed.");
      // this.printGrid(this.myGameBoard, true);
      return false;
    } //else {
    // return this.printGrid(this.myGameBoard, true);
    //}
  }
}

class Start extends Computer {
  constructor() {
    super();
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
    this.strikeLoop();
  }

  strikeLoop() {
    while (this.computerShipCount > 0 && this.myShipCount > 0) {
      this.computerStrike(this.myGameBoard, this.gridSize);
      this.getCoordinate(this.computerGameBoard);
    }
  }
}

const newGame = new Start();

newGame.beginGame();
