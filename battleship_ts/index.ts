document.addEventListener('readystatechange', () => {    
  if (document.readyState == 'complete') main();
});

function main() {
    console.log("initilized");
    const board_canvas = <HTMLCanvasElement> document.getElementById("game_board");
    const board_canvas_context = board_canvas.getContext('2d')!;

    board_canvas_context.fillStyle= 'black';
    board_canvas_context.fillRect(0, 0,board_canvas.width, board_canvas.height);

    const BOARD_OFFSET = {
        x: board_canvas.width / MAX_BOARD_SIZE.x,
        y: board_canvas.height / MAX_BOARD_SIZE.y
    }
    let board = new GameBoard();
    board.add_alive_square(0,0);

    render_board(board, board_canvas_context, BOARD_OFFSET);
}

function render_board(board: GameBoard, canvas_context: CanvasRenderingContext2D, offsets: {x: number, y: number}) {
    for (let x = 0; x < MAX_BOARD_SIZE.x; x++) {
        for (let y = 0; y < MAX_BOARD_SIZE.y; y++) {
            if (board.game_board[x][y] === SquareState.Alive) {
                canvas_context.fillStyle = 'blue';
                canvas_context.fillRect(x * offsets.x, y * offsets.y, offsets.x, offsets.y)
            }
        }
    }
}

const MAX_BOARD_SIZE = {
    x: 10,
    y: 10
};

enum SquareState {
    Empty,
    Alive,
    Dead
}

class GameBoard {
    game_board: [[SquareState]] = [[SquareState.Empty]];

    constructor() {
        for (let x = 0; x < MAX_BOARD_SIZE.x; x++) {
            for (let y = 0; y < MAX_BOARD_SIZE.y; y++) { 
                this.game_board[x][y] = SquareState.Empty;
            }
        }
    }

    add_alive_square(x: number, y: number) {
        this.game_board[x][y] = SquareState.Alive;
    }

    kill_square(x: number, y: number): boolean {
        if (this.game_board[x][y] === SquareState.Empty) {
            return false;
        }

        this.game_board[x][y] = SquareState.Dead;
        return true;
    }
}

