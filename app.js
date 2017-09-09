const http = require("http");
const fs = require("fs");
// const request = require("request");
const querystring = require('querystring');

const host = "localhost";
const port = "8080"

let server = http.createServer((req, res) => {
    let path = req.url;

    switch (path) {
        case "/":
            index(res);
            break;
        case "/request":
            request(req, res);
            break;
        default:
            res.writeHead(302, {"Location": `${host}:${port}`});
            res.end();
            break;
    }
}).listen(port, host);

function index(res) {
    fs.readFile("./main.html", "utf-8", doReard);
    
    function doReard(err, data){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    }
}

function request(req, res) {
    var data = "";
    req.on("readable", function(chunk) {
        const d = req.read();
        if (d !== null) {
            data += d;
        }
    });
    req.on("end", function() {
        let request_data = data.split("&");

        const data_object = querystring.parse(data);
        const url = data_object.url.replace("http://", "");

        const options = {
            host: url,
            port: data_object.port,
            method: data_object.type
        }

        console.log(options);

        http.get(options, (h_res) => {
            let result = "";
            h_res.setEncoding('utf8');
            h_res.on("data", (chunk) => {
                result += chunk;
            });
            h_res.on("end", () => {
                res.end(result);
            })
        }).on("error", () => {
            res.end("");
        });
    });
}

console.log(`Server Start ${host}:${port}`)