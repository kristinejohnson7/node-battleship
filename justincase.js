// var rs = require("readline-sync");

// class Game {
//   constructor() {
//     this.gridSize = 3;
//     this.myGrid = this.createGrid(this.gridSize);
//     this.coordinate = [];
//     this.myShips = 2;
//     this.attempts = [];
//     this.shipLocations = {};
//   }

//   // functions

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

//   beginGame() {
//     rs.keyIn("Press any key to start the game.");

//     this.placeShips(this.myShips);
//     console.table(this.myGrid);
//   }

//   // convert letter to number
//   // getCoordinate() {
//   //   this.coordinate = rs.question(`Enter a location to strike i.e., 'A2'. `, {
//   //     limit: /^[abc][123]$/i,
//   //     limitMessage: "That is not a proper location. Try again.",
//   //   });
//   //   this.coordinate = this.coordinate.split("");
//   //   this.sumChars(this.coordinate[0]);
//   // }

//   // sumChars(s) {
//   //   var i,
//   //     n = s.length,
//   //     acc = 0;
//   //   for (i = 0; i < n; i++) {
//   //     acc += parseInt(s[i], 36) - 10;
//   //   }
//   //   return this.coordinate.splice(0, 1, acc), console.log(this.coordinate);
//   // }

//   // place ship

//   placeShips(ships) {
//     for (let i = 0; i < ships; i++) {
//       this.generateRandomLocation("S", this.myGrid, this.gridSize);
//     }
//   }

//   getRandomInt(max) {
//     return Math.floor(Math.random() * Math.floor(max));
//   }

//   generateRandomLocation(c, grid, max) {
//     let didPlace = false;
//     while (!didPlace) {
//       let x = this.getRandomInt(max);

//       let y = this.getRandomInt(max);

//       if (!this.shipLocations[`${x}-${y}`]) {
//         this.placeCharacterAtLocation(x, y, c, grid);

//         didPlace = true;
//         this.shipLocations[`${x}-${y}`] = true;
//       }
//     }
//   }

//   placeCharacterAtLocation(x, y, c, grid) {
//     grid[y][x] = c;
//   }

//   // attack(x, y, grid) {
//   //   if (grid[y][x] == "O") {
//   //     grid[y][x] = "!";
//   //     return true;
//   //   } else if (grid[y][x] == "-") {
//   //     grid[y][x] = "x";
//   //     return false;
//   //   } else {
//   //     return false;
//   //   }
//   // }
// }

// const newGame = new Game();

// newGame.beginGame();
// attackPlay(y, x, grid) {
//   if (grid[y][x] == "S") {
//     grid[y][x] = "!";
//     return (
//       true,
//       this.myShips--,
//       console.log(
//         `Hit. You have sunk a battleship. ${this.myShips} ship remaining.`
//       ),
//       this.getCoordinate()
//     );
//   } else if (grid[y][x] == "-") {
//     grid[y][x] = "x";
//     return false, console.log("You have missed!"), this.getCoordinate();
//   } else {
//     return (
//       false,
//       console.log("You have already picked this location. Miss!"),
//       this.getCoordinate()
//     );
//   }
// }
