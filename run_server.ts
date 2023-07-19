export const FILE_PATH = "battleship_ts";
import * as qs from 'querystring';

import * as http from "http" ;
import {promises as fs} from 'fs';
import * as response_handler from "./response_handler";
import { BattleShipGame, GameApiRequest, init_game, serve_board, update_board, UpdateType } from "./battle_ship_api";
import { json } from "stream/consumers";

const OUT_PORT: number = 8000;
const HOST_NAME = '127.0.0.1';
const HEADER_PATH = FILE_PATH + "/index.html";
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

async function handle_get_request(req: http.IncomingMessage, res: http.ServerResponse, game: BattleShipGame) {
    let raw_data = "";
    let r_body: GameApiRequest | undefined = undefined;
 
    let req_url = req.url; 
    if (req_url === undefined) {
        throw "Undefined URL";
    }

    try {
        console.log("Raw Data: " + raw_data);
        r_body = JSON.parse(raw_data);
    }
    catch (e) {
        console.log("Received Request Page Request");
        fufill_file_request(req_url, res);            
        return;
    }

    if (r_body === undefined) {
        throw "Malformed API Request";
    }

    let request = r_body.r_type;
    let request_type = match_request(request);

    switch (request_type) { 
        case RequestType.CID:
            response_handler.serve_c_id(connected_clients, res);
        console.log("Assigned Client: " + connected_clients);
        connected_clients++;
        break;
        case RequestType.Board:
            let requesting_player = r_body?.c_id;
        serve_board(res, requesting_player, game, game.player_attacking);
        break;
        default:
            console.error("Unknown Request Type for Get Request");
    }
}

async function handle_post_request(req: http.IncomingMessage, res: http.ServerResponse, game: BattleShipGame) {
    let raw_data = "";
    let r_body: GameApiRequest | undefined = undefined;

    let parsed_req = get_message_body(req);
    if (parsed_req === undefined) {
        console.error("Error Parsing Request");
    }
    raw_data = parsed_req.body;

    r_body = JSON.parse(raw_data);
    let req_url = req.url; 
    if (req_url === undefined) {
        throw "Undefined URL";
    }

    if (r_body === undefined) {
        throw "Malformed API Request";
    }

    let requesting_player = r_body.c_id; 
    let request = r_body.r_type;
    let request_type = match_request(request);

    console.log("Received Request");
    switch (request_type) {
            case RequestType.KillSquare:
                update_board(req, requesting_player, game, UpdateType.Kill);
                break;
            case RequestType.AliveSquare:
                update_board(req, requesting_player, game, UpdateType.Alive);
                break;
            case RequestType.SwitchTurn:
                game.current_turn += 1;
                game.player_attacking = game.current_turn % 2;
                break;
            case RequestType.Reset:
                game = init_game();
                break;
            default:
                console.error("Unknown RequestType: " + req_url);
                return;
        }
        response_handler.serve_200_ok(res);
}

function get_message_body(res: http.IncomingMessage): qs.ParsedUrlQuery | undefined {
    let body = '';
    let post: qs.ParsedUrlQuery | undefined = undefined;
    res.on('data', function (data) {
        body += data;
    });
    res.on('end', function () {
        post = qs.parse(body);
    });
    return post;
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

        switch (req_method) {
            case "GET":
                handle_get_request(req, res, game).catch(e => console.log(e));
                break;
            case "POST":
                handle_post_request(req, res, game).catch(e => console.log(e));
                break;
            default:
                console.error("Unsupported Method Type");
        }
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
