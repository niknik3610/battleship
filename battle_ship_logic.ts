export const MAX_BOARD_SIZE = {
    x: 10,
    y: 10
};

export enum SquareState {
    Empty,
    Alive,
    Dead
}

export class GameBoard {
    game_board: SquareState[][];

    constructor() {
        this.game_board = [...Array(MAX_BOARD_SIZE.x)].map(_ => Array(MAX_BOARD_SIZE.y).fill(SquareState.Empty));
    }

    add_alive_square(x: number, y: number) {
        if (x >= MAX_BOARD_SIZE.x || y >= MAX_BOARD_SIZE.y) {
            return;
        }

        this.game_board[x][y] = SquareState.Alive;
    }

    kill_square(x: number, y: number): boolean {
        if (this.game_board[x][y] === SquareState.Empty) {
            return false;
        }

        this.game_board[x][y] = SquareState.Dead;
        return true;
    }
}

