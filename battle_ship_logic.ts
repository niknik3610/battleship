export const MAX_BOARD_SIZE = {
    x: 10,
    y: 10
};

export enum SquareState {
    Empty,
    Alive,
    HitSuccess,
    HitMiss,
}

export class Vector2 {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class GameBoard {
    ship_board: SquareState[][];
    attack_board: SquareState[][];

    constructor() {
        this.ship_board = [...Array(MAX_BOARD_SIZE.x)].map(_ => Array(MAX_BOARD_SIZE.y).fill(SquareState.Empty));
        this.attack_board= [...Array(MAX_BOARD_SIZE.x)].map(_ => Array(MAX_BOARD_SIZE.y).fill(SquareState.Empty));
    }

    add_alive_square(coords: Vector2) {
        if (coords.x >= MAX_BOARD_SIZE.x || coords.y >= MAX_BOARD_SIZE.y) {
            return;
        }
        this.ship_board[coords.x][coords.y] = SquareState.Alive;
    }
    kill_square(coords: Vector2): boolean {
        if (this.ship_board[coords.x][coords.y] == SquareState.Alive) {
            this.attack_board[coords.x][coords.y] = SquareState.HitSuccess;
        }
        else {
            this.attack_board[coords.x][coords.y] = SquareState.HitMiss;
        }
        return true;
    }
}
