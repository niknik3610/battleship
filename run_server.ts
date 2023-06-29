import * as http from "http" ;
import {promises as fs} from 'fs';
import * as response_handler from "./response_handler";

const OUT_PORT: number = 8000;
const HOST_NAME = '127.0.0.1';
const FILE_PATH = "battleship_ts/";
const HEADER_PATH = FILE_PATH + "header.html";

export async function read_file(path: string) {
    try {
        const file_contents = await fs.readFile(path);
        return file_contents.toString();
    }
    catch (e){
        throw `Error Reading file: ${e}`;
    }
}

async function main() {
    const server = http.createServer(async (req, res) => {
        console.log("Received Request");
        let req_url = req.url;
        let path: string;

        if (req_url !== '/') {
            path = FILE_PATH + req_url + '.html';
        }
        else {
            path = HEADER_PATH
        }

        response_handler.serve_file(path, res)
        .catch((e) => {
            response_handler.serve_404_error(res);
            console.log(e);
        });
        
    });    

    server.listen(OUT_PORT, HOST_NAME, () => {
        console.log(`Server Running on http://${HOST_NAME}:${OUT_PORT}/`);
    });
}

main();
