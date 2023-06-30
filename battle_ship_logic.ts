export const MAX_BOARD_SIZE = {
    x: 10,
    y: 10
};

export enum SquareState {
    Empty,
    Alive,
    Dead
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
    game_board: SquareState[][];

    constructor() {
        this.game_board = [...Array(MAX_BOARD_SIZE.x)].map(_ => Array(MAX_BOARD_SIZE.y).fill(SquareState.Empty));
    }

    add_alive_square(coords: Vector2) {
        if (coords.x >= MAX_BOARD_SIZE.x || coords.y >= MAX_BOARD_SIZE.y) {
            return;
        }

        this.game_board[coords.x][coords.y] = SquareState.Alive;
    }

    kill_square(coords: Vector2): boolean {
        this.game_board[coords.x][coords.y] = SquareState.Dead;
        return true;
    }
}

