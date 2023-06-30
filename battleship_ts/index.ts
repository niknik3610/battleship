import * as bs from "../battle_ship_logic";

const BOARD_REQUEST = "/request_board";

document.addEventListener('readystatechange', () => {    
  if (document.readyState == 'complete') main();
});

async function main() {
    console.log("initilized");
    const board_canvas = <HTMLCanvasElement> document.getElementById("game_board");
    const board_canvas_context = board_canvas.getContext('2d')!;

    board_canvas_context.fillStyle= 'black';
    board_canvas_context.fillRect(0, 0,board_canvas.width, board_canvas.height);

    const BOARD_OFFSET = {
        x: board_canvas.width / bs.MAX_BOARD_SIZE.x,
        y: board_canvas.height / bs.MAX_BOARD_SIZE.y
    }

    window.setInterval(() => update_board(board_canvas_context, BOARD_OFFSET), 1000);
}

async function update_board(canvas_context: CanvasRenderingContext2D, offsets: {x: number, y: number}) {
    let to_render = await request_game_board();
    render_board(to_render, canvas_context, offsets);
}

function request_game_board() {
    let result = fetchUrl(BOARD_REQUEST)
    return result;
}

async function fetchUrl(url: string) {
    let response = await fetch(url);
    let data = await response.json();
    console.log(data);
    return data;
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
