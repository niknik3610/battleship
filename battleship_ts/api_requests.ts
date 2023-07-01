export async function sendJSON(r_type: string, to_send: string) {
    fetch(r_type, {
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        method: 'POST',
        body: to_send,
    });   
}

export async function fetchUrl(url: string) {
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

