var rs = require("readline-sync");

class Game {
  constructor() {
    this.board = this.createGrid(3);
    this.myShips = 2;
    this.attempts = [];
    this.shipLocations = {
      ship1: [],
      ship2: [],
    };
  }

  // functions

  beginGame() {
    rs.keyIn("Press any key to start the game.");
    console.log(this.board);
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

  placeShip() {}

  getCoordinate(x, y) {
    let coordinate = rs.question(`Enter a location to strike i.e., 'A2'. `);
  }
}

const newGame = new Game();

newGame.beginGame();
