export const FILE_PATH = "battleship_ts";

import * as http from "http" ;
import {promises as fs} from 'fs';
import * as response_handler from "./response_handler";
import { BattleShipGame, init_game, serve_board } from "./battle_ship_api";

const OUT_PORT: number = 8000;
const HOST_NAME = '127.0.0.1';
const HEADER_PATH = FILE_PATH + "/index.html";

enum RequestType {
    UpdatedBoard,
    File,
}

export async function read_file(path: string) {
    try {
        const file_contents = await fs.readFile(path);
        return file_contents.toString();
    }
    catch (e){
        throw `Error Reading file: ${e}`;
    }
}

function temp_func(x:number, y: number, game: BattleShipGame) {
}

async function main() {
    let game = init_game();
    let x = 0;
    let y = 0;
    setInterval(() => {
        game.board.add_alive_square(x, y);
        x++;
        y++;
    }, 1000)

    const server = http.createServer(async (req, res) => {
        console.log("Received Request");
        let req_url = req.url!;
        console.log(req_url);
        let request = match_request(req_url);

        switch (request) {
            case RequestType.UpdatedBoard:
                serve_board(res, game.board);
                break;
            case RequestType.File:
                fufill_file_request(req_url, res);
                break;
            default:
                console.log("Unknown RequestType: " + req_url);
                break;
        } 
    });    

    server.listen(OUT_PORT, HOST_NAME, () => {
        console.log(`Server Running on http://${HOST_NAME}:${OUT_PORT}/`);
    });
}

function match_request(request_url: string): RequestType {
    switch (request_url) {
        case "/request_board":
            return RequestType.UpdatedBoard;
        default:
            return RequestType.File;
    }
}

function fufill_file_request(req_url: string, res: http.ServerResponse) {
    let path: string;

    if (req_url !== '/') {
        path = FILE_PATH + req_url;
    } 
    else {
        path = HEADER_PATH
    }

    response_handler.serve_file(path, res)
    .catch((e) => {
        response_handler.serve_404_error(res);
        console.log(e);
    });
}

main();
