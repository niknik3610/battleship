import { read_file, FILE_PATH  } from "./run_server";
import * as http from "http" ;

const ERROR_404 = FILE_PATH +  "/404.html";

export const serve_404_error = async (res: http.ServerResponse) => {
    let e_header: string;
    e_header = await read_file(ERROR_404); 
    res.statusCode = 404;
    res.setHeader('Content-Type', 'html');
    res.end(e_header);
}

export const serve_file = async (file_path: string, res: http.ServerResponse) => {
    let header: string;
    try {
        header = await read_file(file_path);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'html');
        res.end(header);
    }
    catch {
        throw `File Not Found: ${file_path}`;
    }
}
