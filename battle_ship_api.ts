import { ServerResponse } from "http";
import { GameBoard } from "./battle_ship_logic";

export class BattleShipGame {
    board: GameBoard;
    current_turn: number;

    constructor() {
        this.board = new GameBoard();
        this.current_turn = 0;
    }
    next_turn(x: number, y: number): number {
        this.current_turn++;
        this.board.kill_square(x, y);
        return this.current_turn;
    }
}

export function init_game(): BattleShipGame {
    let game = new BattleShipGame();
    return game;
}

export function serve_board(res: ServerResponse, board: GameBoard) {
    let header = JSON.stringify(board);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'json');
    res.end(header);
}
