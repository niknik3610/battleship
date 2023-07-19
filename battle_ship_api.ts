import { IncomingMessage, ServerResponse } from "http";
import { GameBoard, SquareState, Vector2 } from "./battle_ship_logic";

export enum UpdateType {
    Kill,
    Alive
}

export class GameApiRequest {
    c_id: number;
    r_type: string;
    body: string | undefined = undefined;

    constructor(c_id: number, r_type: string) {
        this.c_id = c_id;
        this.body = r_type;
    }

    add_body(body: string) {
        this.body = body;
    }
}

export class BattleShipGame {
    board: GameBoard[]; 
    current_turn: number;
    player_attacking: number;

    constructor() {
        this.board = [new GameBoard(), new GameBoard()];
        this.current_turn = 0;
        this.player_attacking = 0;
    } 
    kill_square(coords: Vector2, c_id: number): number { 
        this.board[c_id].kill_square(coords);
        console.log("turn: " + this.current_turn);
        return this.current_turn;
    }
    add_alive_square(coords: Vector2, c_id:number) {
        this.board[c_id].add_alive_square(coords);
    }
}

export function init_game(): BattleShipGame {
    let game = new BattleShipGame();
    return game;
}

export function serve_board(res: ServerResponse, requesting_player: number, game: BattleShipGame, attacking_player: number) { 
    let curr_board: SquareState[][];
    
    if (attacking_player == requesting_player) {
        curr_board = game.board[attacking_player + 1 % 2].attack_board;
    }
    else {
        curr_board = game.board[attacking_player + 1 % 2].ship_board;
    }

    let header = JSON.stringify(curr_board);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'json');
    res.end(header);
}

export function update_board(req: IncomingMessage, requesting_player: number, game: BattleShipGame, update_type: UpdateType) {
    req.on('data', (data) => {
        let parsed_coords = JSON.parse(data);
        switch (update_type) {
            case UpdateType.Kill:
                game.kill_square(parsed_coords, requesting_player);
            break;
            case UpdateType.Alive:
                game.add_alive_square(parsed_coords, requesting_player);
            break;
        } 
    });
}
