// Original JavaScript code by Chirp Internet: chirpinternet.eu
// Please acknowledge use of this code by including this header.

class FancyMazeBuilder extends MazeBuilder {

  constructor(width, height) {

    super(width, height);

    this.removeNubbins();
    this.joinNubbins();
    this.placeSentinels(100);
    this.placeKey();

  }

  isA(value, ...cells) {
    return cells.every((array) => {
      let row, col;
      [row, col] = array;
      if((this.maze[row][col].length == 0) || !this.maze[row][col].includes(value)) {
        return false;
      }
      return true;
    });
  }

  removeNubbins() {

    this.maze.slice(2, -2).forEach((row, idx) => {

      let r = idx + 2;

      row.slice(2, -2).forEach((cell, idx) => {

        let c = idx + 2;

        if(!this.isA("wall", [r, c])) {
          return;
        }

        if(this.isA("wall", [r-1, c-1], [r-1, c], [r-1, c+1], [r+1, c]) && this.isGap([r+1, c-1], [r+1, c+1], [r+2, c])) {
          this.maze[r][c] = [];
          this.maze[r+1][c] = ["nubbin"];
        }

        if(this.isA("wall", [r-1, c+1], [r, c-1], [r, c+1], [r+1, c+1]) && this.isGap([r-1, c-1], [r, c-2], [r+1, c-1])) {
          this.maze[r][c] = [];
          this.maze[r][c-1] = ["nubbin"];
        }

        if(this.isA("wall", [r-1, c-1], [r, c-1], [r+1, c-1], [r, c+1]) && this.isGap([r-1, c+1], [r, c+2], [r+1, c+1])) {
          this.maze[r][c] = [];
          this.maze[r][c+1] = ["nubbin"];
        }

        if(this.isA("wall", [r-1, c], [r+1, c-1], [r+1, c], [r+1, c+1]) && this.isGap([r-1, c-1], [r-2, c], [r-1, c+1])) {
          this.maze[r][c] = [];
          this.maze[r-1][c] = ["nubbin"];
        }

      });

    });

  }

  joinNubbins() {

    this.maze.slice(2, -2).forEach((row, idx) => {

      let r = idx + 2;

      row.slice(2, -2).forEach((cell, idx) => {

        let c = idx + 2;

        if(!this.isA("nubbin", [r, c])) {
          return;
        }

        if(this.isA("nubbin", [r-2, c])) {
          this.maze[r-2][c].push("wall");
          this.maze[r-1][c] = ["nubbin", "wall"];
          this.maze[r][c].push("wall");
        }

        if(this.isA("nubbin", [r, c-2])) {
          this.maze[r][c-2].push("wall");
          this.maze[r][c-1] = ["nubbin", "wall"];
          this.maze[r][c].push("wall");
        }

      });

    });

  }

  placeSentinels(percent = 100) {

    percent = parseInt(percent, 10);

    if((percent < 1) || (percent > 100)) {
      percent = 100;
    }

    this.maze.slice(1, -1).forEach((row, idx) => {

      let r = idx + 1;

      row.slice(1, -1).forEach((cell, idx) => {

        let c = idx + 1;

        if(!this.isA("wall", [r,c])) {
          return;
        }

        if(this.rand(1, 100) > percent) {
          return;
        }

        if(this.isA("wall", [r-1,c-1],[r-1,c],[r-1,c+1],[r+1,c-1],[r+1,c],[r+1,c+1])) {
          this.maze[r][c].push("sentinel");
        }

        if(this.isA("wall", [r-1,c-1],[r,c-1],[r+1,c-1],[r-1,c+1],[r,c+1],[r+1,c+1])) {
          this.maze[r][c].push("sentinel");
        }

      });

    });
  }

  placeKey() {

    let fr, fc;
    [fr, fc] = this.getKeyLocation();

    if(this.isA("nubbin", [fr-1,fc-1]) && !this.isA("wall", [fr-1,fc-1])) {
      this.maze[fr-1][fc-1] = ["key"];
    } else if(this.isA("nubbin", [fr-1,fc+1]) && !this.isA("wall", [fr-1,fc+1])) {
      this.maze[fr-1][fc+1] = ["key"];
    } else if(this.isA("nubbin", [fr+1,fc-1]) && !this.isA("wall", [fr+1,fc-1])) {
      this.maze[fr+1][fc-1] = ["key"];
    } else if(this.isA("nubbin", [fr+1,fc+1]) && !this.isA("wall", [fr+1,fc+1])) {
      this.maze[fr+1][fc+1] = ["key"];
    } else {
      this.maze[fr][fc] = ["key"];
    }

  }

}
