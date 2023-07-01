import { on } from "events";
import * as bs from "../battle_ship_logic";
import { fetchUrl, sendJSON } from "./api_requests";

const BOARD_REQUEST = "/request_board";
const KILL_SQUARE = "/kill_square";
const ALIVE_SQUARE = "/alive_square";
const SWITCH_TURNS = "/switch_turn"

const BOARD_CANVAS = <HTMLCanvasElement> document.getElementById("game_board");
const MODE_BUTTON = <HTMLButtonElement> document.getElementById("mode_button");
const MODE_DISPLAY = <HTMLParagraphElement> document.getElementById("curr_mode");

document.addEventListener('readystatechange', () => {    
  if (document.readyState == 'complete') main();
});

enum PlayerMode {
    Kill =  0,
    Watching = 1,
    ChoosingShip = 2
}

async function main() {
    console.log("initilized");
    let p_mode = PlayerMode.ChoosingShip;

    const board_canvas_context = BOARD_CANVAS.getContext('2d')!; 

    board_canvas_context.fillStyle= 'black';
    board_canvas_context.fillRect(0, 0,BOARD_CANVAS.width, BOARD_CANVAS.height);

    MODE_DISPLAY.textContent = "Select you battleships";

    BOARD_CANVAS.addEventListener('mousedown', (e) => {
        let pos = get_cursor_pos(BOARD_CANVAS, e);
        switch (p_mode) {
            case PlayerMode.Watching:
            break;
            case PlayerMode.ChoosingShip:
                alive_square(pos);
            break;
            case PlayerMode.Kill:
                kill_square(pos);
            break;
        }
    })

    MODE_BUTTON.addEventListener('click', (_) => {
        switch_turn();
        p_mode = p_mode + 1;
        if (p_mode > 1) {
            p_mode = 0;
            MODE_DISPLAY.textContent = "Kill your opponents battleships";
            return;
        }
        MODE_DISPLAY.textContent = "Watch your opponent";
    })

    const BOARD_OFFSET = {
        x: BOARD_CANVAS.width / bs.MAX_BOARD_SIZE.x,
        y: BOARD_CANVAS.height / bs.MAX_BOARD_SIZE.y
    }

    window.setInterval(() => update_board(board_canvas_context, BOARD_OFFSET), 100);
}

async function alive_square(coords: bs.Vector2) {
    sendJSON(ALIVE_SQUARE, JSON.stringify(coords));
}

async function kill_square(coords: bs.Vector2) {
    sendJSON(KILL_SQUARE, JSON.stringify(coords));
}

async function switch_turn() {
    sendJSON(SWITCH_TURNS, "");
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

function render_board(board: bs.SquareState[][], canvas_context: CanvasRenderingContext2D, offsets: {x: number, y: number}) {
    for (let x = 0; x < bs.MAX_BOARD_SIZE.x; x++) {
        for (let y = 0; y < bs.MAX_BOARD_SIZE.y; y++) {
            if (board[x][y] === bs.SquareState.Alive) {
                canvas_context.fillStyle = 'blue';
                canvas_context.fillRect(x * offsets.x, y * offsets.y, offsets.x, offsets.y)
            }
            else if (board[x][y] === bs.SquareState.HitSuccess) {
                canvas_context.fillStyle = 'green';
                canvas_context.fillRect(x * offsets.x, y * offsets.y, offsets.x, offsets.y)
            }
            else if (board[x][y] === bs.SquareState.HitMiss) {
                canvas_context.fillStyle = 'red';
                canvas_context.fillRect(x * offsets.x, y * offsets.y, offsets.x, offsets.y)
            }
            else {
                canvas_context.fillStyle = 'black';
                canvas_context.fillRect(x * offsets.x, y * offsets.y, offsets.x, offsets.y)
            }
        }
    }
}
