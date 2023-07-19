import { GameApiRequest } from "../battle_ship_api";
import * as bs from "../battle_ship_logic";
import { fetchUrl, sendJSON } from "./api_requests";
import { update_board } from "./board_handler";

const BOARD_REQUEST = "/request_board";
const KILL_SQUARE = "/kill_square";
const ALIVE_SQUARE = "/alive_square";
const SWITCH_TURNS = "/switch_turn";
const RESET_GAME = "/reset";
const REQUEST_C_ID = "/c_id";
    
export const CLIENT_ID = request_c_id();

const BOARD_CANVAS = <HTMLCanvasElement> document.getElementById("game_board");
const MODE_BUTTON = <HTMLButtonElement> document.getElementById("mode_button");
const MODE_DISPLAY = <HTMLParagraphElement> document.getElementById("curr_mode");
const RESET_BUTTON = <HTMLButtonElement> document.getElementById("reset");

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

    const board_canvas_context = BOARD_CANVAS.getContext('2d')!; 

    board_canvas_context.fillStyle= 'black';
    board_canvas_context.fillRect(0, 0,BOARD_CANVAS.width, BOARD_CANVAS.height);

    MODE_DISPLAY.textContent = "Select you battleships";
    
    let p_mode = PlayerMode.ChoosingShip;

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

    RESET_BUTTON.addEventListener('click', (_) => {    
        MODE_DISPLAY.textContent = "Select you battleships";
        p_mode = PlayerMode.ChoosingShip;
        sendJSON(RESET_GAME, "");
    })

    const BOARD_OFFSET = {
        x: BOARD_CANVAS.width / bs.MAX_BOARD_SIZE.x,
        y: BOARD_CANVAS.height / bs.MAX_BOARD_SIZE.y
    }

    window.setInterval(() => update_board(board_canvas_context, BOARD_OFFSET), 100);
}

function request_c_id(): number {
    let result: number = 0; 
    fetchUrl(REQUEST_C_ID).then(r => result = r);
    return result;
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


export function request_game_board() {
    let result = fetchUrl(BOARD_REQUEST);
    return result;
}
