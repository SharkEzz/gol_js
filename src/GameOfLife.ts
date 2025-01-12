type Board = boolean[][];

export class GameOfLife {
  #board: Board;

  constructor(public readonly boardSize: [number, number]) {
    this.#board = new Array(this.boardSize[1]);
    for (let i = 0; i < this.boardSize[1]; i += 1) {
      this.board[i] = new Array(this.boardSize[0]).fill(undefined).map(
        () => Math.random() > 0.5,
      );
    }
  }

  get board(): Board {
    return this.#board;
  }

  getNeighborsCount(x: number, y: number): number {
    let neighbors = 0;

    for (let i = -1; i <= 1; i += 1) {
      if (this.#board[y - 1]?.[x + i]) {
        neighbors++;
      }
      if (this.#board[y]?.[x + i] && i !== 0) {
        neighbors++;
      }
      if (this.#board[y + 1]?.[x + i]) {
        neighbors++;
      }
    }
    return neighbors;
  }

  get stats(): { aliveCells: number; deadCells: number } {
    let aliveCells = 0;
    let deadCells = 0;
    this.#loopBoard(({ cell }) => cell ? aliveCells++ : deadCells++);
    return { aliveCells, deadCells };
  }

  get deadCells(): number {
    let count = 0;
    this.#loopBoard(({ cell }) => !cell ? count++ : count);
    return count;
  }

  computeNextGeneration(): void {
    const newBoard: Board = new Array(this.boardSize[1]);
    for (let i = 0; i < this.boardSize[1]; i += 1) {
      newBoard[i] = new Array(this.boardSize[0]);
    }

    for (const [y, row] of this.#board.entries()) {
      for (const [x, cell] of row.entries()) {
        const neighbors = this.getNeighborsCount(x, y);
        let newCell = cell;
        if (neighbors === 3 && !newCell) {
          newCell = true;
        } else if (newCell && (neighbors < 2 || neighbors > 3)) {
          newCell = false;
        }
        newBoard[y]![x] = newCell;
      }
    }

    this.#board = newBoard;
  }

  #loopBoard(
    callback: (
      data: { x: number; y: number; cell: boolean },
    ) => unknown,
  ): void {
    for (const [y, row] of this.#board.entries()) {
      for (const [x, cell] of row.entries()) {
        callback({ x, y, cell });
      }
    }
  }
}
