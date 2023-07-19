import {request_game_board} from "./index";
import * as bs from "../battle_ship_logic";

export async function update_board(canvas_context: CanvasRenderingContext2D, offsets: {x: number, y: number}) {
    request_game_board()
    .then((to_render) => render_board(to_render, canvas_context, offsets)); 
}

function render_board(board: bs.SquareState[][], canvas_context: CanvasRenderingContext2D, offsets: {x: number, y: number}) {
    for (let x = 0; x < bs.MAX_BOARD_SIZE.x; x++) {
        for (let y = 0; y < bs.MAX_BOARD_SIZE.y; y++) {
            if (board[x][y] === bs.SquareState.Alive) {
                canvas_context.fillStyle = 'black';
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
                canvas_context.fillStyle = 'blue';
                canvas_context.fillRect(x * offsets.x, y * offsets.y, offsets.x, offsets.y)
            }
        }
    }
}

