export const FILE_PATH = "battleship_ts";
import * as qs from 'querystring';

import * as http from "http" ;
import {promises as fs} from 'fs';
import * as response_handler from "./response_handler";
import { BattleShipGame, GameApiRequest, init_game, serve_board, update_board, UpdateType } from "./battle_ship_api";
import { json } from "stream/consumers";

const OUT_PORT: number = 8000;
const HOST_NAME = '127.0.0.1';
export const HEADER_PATH = FILE_PATH + "/index.html";
let connected_clients = 0;

enum RequestType {
    Board,
    KillSquare,
    AliveSquare,
    File,
    SwitchTurn,
    CID,
    Reset,
}

main();

async function handle_get_request(url: string, res: http.ServerResponse) {
    console.log("Received Get Request");

    if (url === undefined) {
        throw "Undefined URL";
    }

    let request_type = match_request(url);

    switch (request_type) { 
        case RequestType.CID:
            response_handler.serve_c_id(connected_clients, res);
            console.log("Assigned Client: " + connected_clients);
            connected_clients++;
            break;
        default:
            response_handler.serve_file(url, res);
    }
}

async function handle_post_request(req: string, res: http.ServerResponse, game: BattleShipGame) {
    console.log("Received Post Request");

    let r_body: GameApiRequest | undefined = undefined;

    if (req === undefined) {
        console.error("Error Parsing Request");
        return;
    }
    
    r_body = JSON.parse(req);
    if (r_body === undefined) {
        console.error("Undefined Request Body");
        return;
    }

    let request = r_body.r_type;
    let request_type = match_request(request);
    let request_player = r_body.c_id; 

    console.log("Received Request");
    switch (request_type) {
        case RequestType.KillSquare:
            if (r_body.body === undefined) {
                console.error("Request Body is undefined");
                return;
            }
            update_board(r_body.body, request_player, game, UpdateType.Kill);
            break;
        case RequestType.AliveSquare:
            if (r_body.body === undefined) {
                console.error("Request Body is undefined");
                return;
            }
            update_board(r_body.body, request_player, game, UpdateType.Alive);
            break;
        case RequestType.SwitchTurn:
            game.current_turn += 1;
            game.player_attacking = game.current_turn % 2;
        break;
        case RequestType.Board: 
            serve_board(res, request_player, game, game.player_attacking);
            break;
        case RequestType.Reset:
            game = init_game();
            break;
        default:
            return;
    }
    response_handler.serve_200_ok(res);
}

async function main() {
    let game = init_game();

    const server = http.createServer(async (req, res) => {
        let url = req.url;
        console.log(`url: ${url}`); 
        
        let req_method = req.method;
        if (req_method === undefined) {
            console.error("Undefined Request Method");
            return;
        }

        let string_req = "";
        req.on('data', function(data) {
            string_req += data;
        });
        
        req.on('end', function() {
            switch (req_method) {
                case "GET":
                    if (url === undefined) {
                        console.error("URL is undefined");
                        return;
                    }
                    handle_get_request(url, res).catch(e => console.log(e));
                break;
                case "POST":
                    handle_post_request(string_req, res, game).catch(e => console.log(e));
                break;
                default:
                    console.error("Unsupported Method Type");
            }

        });
    });    

    server.listen(OUT_PORT, HOST_NAME, () => {
        console.log(`Server Running on http://${HOST_NAME}:${OUT_PORT}/`);
    });
}
const check_if_url = (request: string): boolean => request[0] === "/";

function receive_api_request(request: string) {
    let split_req = request.split(" ");
    let r_type = split_req[0];
    let r_body = split_req.splice(1);
    console.log(`req_type: ${r_type}, body: ${r_body}`);
}

function match_request(request_url: string): RequestType {
    switch (request_url) {
        case "/request_board":
            return RequestType.Board;
        case "/alive_square":
            return RequestType.AliveSquare;
        case "/kill_square":
            return RequestType.KillSquare;
        case "/switch_turn":
            return RequestType.SwitchTurn;
        case "/reset":
            return RequestType.Reset;
        case "/c_id":
            return RequestType.CID;
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
        console.error(e);
    });
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
