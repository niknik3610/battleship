export async function sendJSON(r_type: string, to_send: string) {
    await fetch(r_type, {
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        method: 'PUT',
        body: to_send,
    }).catch(e => console.log(e));    
}

export async function fetchUrl(url: string) {
    let response = await fetch(url);
    console.log("response: " + response);
    let data = await response.json();
    return data;
}

