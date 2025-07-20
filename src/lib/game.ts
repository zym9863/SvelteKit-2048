export type Direction = 'up' | 'down' | 'left' | 'right';

export interface GameState {
  grid: number[][];
  score: number;
  gameOver: boolean;
  won: boolean;
}

export class Game2048 {
  private grid: number[][];
  private score: number;
  private size: number;

  constructor(size: number = 4) {
    this.size = size;
    this.grid = [];
    this.score = 0;
    this.initializeGrid();
    this.addRandomTile();
    this.addRandomTile();
  }

  private initializeGrid(): void {
    this.grid = Array(this.size).fill(null).map(() => Array(this.size).fill(0));
  }

  private addRandomTile(): void {
    const emptyCells: [number, number][] = [];
    
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const [row, col] = emptyCells[randomIndex];
      this.grid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  public move(direction: Direction): boolean {
    const previousGrid = this.grid.map(row => [...row]);
    const previousScore = this.score;

    switch (direction) {
      case 'left':
        this.moveLeft();
        break;
      case 'right':
        this.moveRight();
        break;
      case 'up':
        this.moveUp();
        break;
      case 'down':
        this.moveDown();
        break;
    }

    const moved = !this.gridsEqual(previousGrid, this.grid);
    
    if (moved) {
      this.addRandomTile();
    }

    return moved;
  }

  private moveLeft(): void {
    for (let i = 0; i < this.size; i++) {
      const row = this.grid[i].filter(val => val !== 0);
      const merged = this.mergeRow(row);
      this.grid[i] = merged.concat(Array(this.size - merged.length).fill(0));
    }
  }

  private moveRight(): void {
    for (let i = 0; i < this.size; i++) {
      const row = this.grid[i].filter(val => val !== 0).reverse();
      const merged = this.mergeRow(row);
      this.grid[i] = Array(this.size - merged.length).fill(0).concat(merged.reverse());
    }
  }

  private moveUp(): void {
    for (let j = 0; j < this.size; j++) {
      const column = [];
      for (let i = 0; i < this.size; i++) {
        if (this.grid[i][j] !== 0) {
          column.push(this.grid[i][j]);
        }
      }
      const merged = this.mergeRow(column);
      for (let i = 0; i < this.size; i++) {
        this.grid[i][j] = merged[i] || 0;
      }
    }
  }

  private moveDown(): void {
    for (let j = 0; j < this.size; j++) {
      const column = [];
      for (let i = this.size - 1; i >= 0; i--) {
        if (this.grid[i][j] !== 0) {
          column.push(this.grid[i][j]);
        }
      }
      const merged = this.mergeRow(column);
      for (let i = 0; i < this.size; i++) {
        this.grid[this.size - 1 - i][j] = merged[i] || 0;
      }
    }
  }

  private mergeRow(row: number[]): number[] {
    const result: number[] = [];
    let i = 0;

    while (i < row.length) {
      if (i < row.length - 1 && row[i] === row[i + 1]) {
        const mergedValue = row[i] * 2;
        result.push(mergedValue);
        this.score += mergedValue;
        i += 2;
      } else {
        result.push(row[i]);
        i++;
      }
    }

    return result;
  }

  private gridsEqual(grid1: number[][], grid2: number[][]): boolean {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (grid1[i][j] !== grid2[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  public canMove(): boolean {
    // Check for empty cells
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j] === 0) {
          return true;
        }
      }
    }

    // Check for possible merges
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const current = this.grid[i][j];
        if (
          (i < this.size - 1 && this.grid[i + 1][j] === current) ||
          (j < this.size - 1 && this.grid[i][j + 1] === current)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  public hasWon(): boolean {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j] === 2048) {
          return true;
        }
      }
    }
    return false;
  }

  public getState(): GameState {
    return {
      grid: this.grid.map(row => [...row]),
      score: this.score,
      gameOver: !this.canMove(),
      won: this.hasWon()
    };
  }

  public reset(): void {
    this.score = 0;
    this.initializeGrid();
    this.addRandomTile();
    this.addRandomTile();
  }
}
