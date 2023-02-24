// let ORIGIN = `http://localhost:3000`
let ORIGIN = `https://Synergy.blazingknightog.repl.co`

export function POST(endpoint,data,callback=()=>{}){
    fetch(ORIGIN+endpoint, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => callback(response))
}

export function GET(endpoint,callback=()=>{}){
    fetch(ORIGIN+endpoint)
    .then(response => response.json())
    .then(response => callback(response))
}