import { IncomingMessage, ServerResponse } from "http";
import { GameBoard, SquareState, Vector2 } from "./battle_ship_logic";

export enum UpdateType {
    Kill,
    Alive
}

export class BattleShipGame {
    board: GameBoard;
    
    current_turn: number;
    player_turn: number;

    constructor() {
        this.board = new GameBoard();
        this.current_turn = 0;
    }
    kill_square(coords: Vector2): number { 
        this.board.kill_square(coords);
        console.log("turn: " + this.current_turn);
        return this.current_turn;
    }
    add_alive_square(coords: Vector2) {
        this.board.add_alive_square(coords);
    }
}

export function init_game(): BattleShipGame {
    let game = new BattleShipGame();
    return game;
}

export function serve_board(res: ServerResponse, board: GameBoard, player_turn: number) { 
    let curr_board: SquareState[][];
    if (player_turn == 0) {
        curr_board = board.ship_board;
    }
    else {
        curr_board = board.attack_board;
    }

    let header = JSON.stringify(curr_board);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'json');
    res.end(header);
}

export function update_board(req: IncomingMessage, game: BattleShipGame, update_type: UpdateType) {
    req.on('data', (data) => {
        let parsed_coords = JSON.parse(data);
        switch (update_type) {
            case UpdateType.Kill:
                game.kill_square(parsed_coords);
            break;
            case UpdateType.Alive:
                game.add_alive_square(parsed_coords);
            break;
        } 
    });
}
