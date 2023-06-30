import * as bs from "../battle_ship_logic";

const BOARD_REQUEST = "/request_board";
const KILL_SQUARE = "/kill_square";
const ALIVE_SQUARE = "/alive_square";

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

    alive_square(new bs.Vector2(0, 0));
    alive_square(new bs.Vector2(2, 5));

    kill_square(new bs.Vector2(4, 4));
    kill_square(new bs.Vector2(5, 7));

    window.setInterval(() => update_board(board_canvas_context, BOARD_OFFSET), 1000);
}

async function update_board(canvas_context: CanvasRenderingContext2D, offsets: {x: number, y: number}) {
    let to_render = await request_game_board();
    render_board(to_render, canvas_context, offsets);
}

async function alive_square(coords: bs.Vector2) {
    sendJSON(ALIVE_SQUARE, JSON.stringify(coords));
}

async function kill_square(coords: bs.Vector2) {
    sendJSON(KILL_SQUARE, JSON.stringify(coords));
}

function request_game_board() {
    let result = fetchUrl(BOARD_REQUEST)
    return result;
}

async function sendJSON(r_type: string, to_send: string) {
    await fetch(r_type, {
        headers: {"Content-Type": "application/json; charset=utf-8"},
        method: 'PUT',
        body: to_send
    });
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
            else if (board.game_board[x][y] === bs.SquareState.Dead) {
                canvas_context.fillStyle = 'red';
                canvas_context.fillRect(x * offsets.x, y * offsets.y, offsets.x, offsets.y)
            }
        }
    }

}
