import * as bs from "./battle_ship_logic";

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
        x: board_canvas.width / bs.MAX_BOARD_SIZE.x,
        y: board_canvas.height / bs.MAX_BOARD_SIZE.y
    }

    let board = new bs.GameBoard();
    board.add_alive_square(0,0);
    board.add_alive_square(1,5);
    board.add_alive_square(1,8);

    render_board(board, board_canvas_context, BOARD_OFFSET);
}

function render_board(board: bs.GameBoard, canvas_context: CanvasRenderingContext2D, offsets: {x: number, y: number}) {
    for (let x = 0; x < bs.MAX_BOARD_SIZE.x; x++) {
        for (let y = 0; y < bs.MAX_BOARD_SIZE.y; y++) {
            if (board.game_board[x][y] === bs.SquareState.Alive) {
                canvas_context.fillStyle = 'blue';
                canvas_context.fillRect(x * offsets.x, y * offsets.y, offsets.x, offsets.y)
            }
        }
    }
}
