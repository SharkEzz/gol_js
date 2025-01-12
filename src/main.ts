import { GameOfLife } from "./GameOfLife";
import p5, { Element } from "p5";

const SIZE = 700;

const s = (sketch: p5) => {
  let generation = 0;
  let lastUpdate = Date.now();
  let gol: GameOfLife;
  let slider: Element;

  sketch.setup = () => {
    sketch.createCanvas(SIZE, SIZE + 60);
    gol = new GameOfLife([Math.floor(SIZE / 8.5), Math.floor(SIZE / 8.5)]);

    slider = sketch.createSlider(0, 1000, 100, 1);
    slider.position(250, 20);
  };

  sketch.draw = () => {
    sketch.textSize(10);
    sketch.background(0);
    sketch.stroke(100, 100, 100);
    sketch.fill(255, 255, 255);
    sketch.text(`Generation: ${generation}`, 5, 15);
    const { aliveCells, deadCells } = gol.stats;
    sketch.text(`Alive cells: ${aliveCells}`, 5, 35);
    sketch.text(`Dead cells: ${deadCells}`, 5, 55);
    sketch.text(`Total cells: ${gol.boardSize[0] * gol.boardSize[1]}`, 5, 75);
    
    sketch.text(`Sleep time: ${slider.value()}ms`, 155, 25);

    // Draw cells
    for (const [y, row] of gol.board.entries()) {
      for (const [x, cell] of row.entries()) {
        if (cell) {
          sketch.fill(255, 255, 255);
        } else {
          sketch.fill(0, 0, 0);
        }
        sketch.square(x * 8, 90 + (y * 8), 8);
      }
    }

    // Update the board every 100 ms
    if (Date.now() - lastUpdate > +(slider!).value()) {
      gol.computeNextGeneration();
      generation += 1;
      lastUpdate = Date.now();
    }
  };
};

new p5(s, document.querySelector<HTMLDivElement>("#app")!);
