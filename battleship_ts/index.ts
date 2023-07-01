import * as bs from "../battle_ship_logic";
import { fetchUrl, sendJSON } from "./api_requests";

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

    board_canvas.addEventListener('mousedown', (e) => {
        let pos = get_cursor_pos(board_canvas, e);
        kill_square(pos);
    })

    const BOARD_OFFSET = {
        x: board_canvas.width / bs.MAX_BOARD_SIZE.x,
        y: board_canvas.height / bs.MAX_BOARD_SIZE.y
    }

    window.setInterval(() => kill_square(new bs.Vector2(1,2)), 200);
    window.setInterval(() => update_board(board_canvas_context, BOARD_OFFSET), 100);
}

async function alive_square(coords: bs.Vector2) {
    sendJSON(ALIVE_SQUARE, JSON.stringify(coords));
}

async function kill_square(coords: bs.Vector2) {
    sendJSON(KILL_SQUARE, JSON.stringify(coords));
}

function get_cursor_pos(canvas: HTMLCanvasElement, event: MouseEvent): bs.Vector2 {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / canvas.width * bs.MAX_BOARD_SIZE.x);
    const y = Math.floor((event.clientY - rect.top) /  canvas.height* bs.MAX_BOARD_SIZE.y);
    console.log("x: " + x + " y: " + y);
    return new bs.Vector2(x, y);
}

async function update_board(canvas_context: CanvasRenderingContext2D, offsets: {x: number, y: number}) {
    let to_render = await request_game_board();
    render_board(to_render, canvas_context, offsets);
}

function request_game_board() {
    let result = fetchUrl(BOARD_REQUEST);
    return result;
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
