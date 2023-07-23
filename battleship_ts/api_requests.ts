import { CLIENT_ID } from ".";
import { GameApiRequest } from "../battle_ship_api";
import { API_REQUEST_TYPES } from "../battle_ship_logic";

export async function postRequest(r_type: string, body: string) {
    let request = await createApiUpdate(r_type, body);
    console.log(request);

    fetch(API_REQUEST_TYPES.API_UPDATE, {
        method: "POST",
        body: request,
        headers: {
        "Content-type": "application/json; charset=UTF-8"
        }
    });
}

export async function getRequest(r_type: string) {
    let request = await createApiRequest(r_type);
    console.log(request);

    let response = await fetch(API_REQUEST_TYPES.API_REQUEST, {
        method: "GET",
        body: request,
        headers: {
        "Content-type": "application/json; charset=UTF-8"
        }
    });

    let data = response.json();
    return data;
}

async function createApiUpdate(r_type: string, body: string) {
    let request = new GameApiRequest(CLIENT_ID, r_type);
    request.add_body(body);
    let request_string = JSON.stringify(request);

    return request_string;
}

async function createApiRequest(r_type: string) {
    let request = new GameApiRequest(CLIENT_ID, r_type);
    let request_string = JSON.stringify(request);

    console.log(request_string);
    return request_string;
}
