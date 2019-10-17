// imports
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const fs = require('fs');

// constants
const app = express();
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const serverDomain = '192.168.1.3';

// creds harcoded
const creds = {
    'tgl': {
        password: '90828723',
        dir: '/home/thegeekylad/HDD500G/Notes/thegeekylad/'
    },
    'shadows': {
        password: 'shimmy',
        dir: '/home/thegeekylad/HDD500G/Notes/shadow_resources/'
    },
    'piggie': {
        password: 'cutiepie',
        dir: '/home/thegeekylad/HDD500G/Notes/piggie/'
    }
}

// allow cross origin requests
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// test service to check if the server is running (useful on public networks with forwarded ports)
app.get('/test/', (req, res) => {
    res.end(JSON.stringify(JSON.parse('{"status":"All good!"}')));
});

// responds with the content of a certain note
app.post('/fetchNote/', jsonParser, (req, res) => {
    if (!(creds.hasOwnProperty(req.body.u) && req.body.p == creds[req.body.u].password)) {
        res.end(JSON.stringify(JSON.parse('{"status":"Bad creds."}')));
        return;
    }
    console.log('File served: ' + creds[req.body.u].dir + req.body.path);
    res.download(creds[req.body.u].dir + req.body.path);
});

// deletes a certain note
app.post('/deleteNote', jsonParser, (req, res) => {
    if (!(creds.hasOwnProperty(req.body.u) && req.body.p == creds[req.body.u].password)) {
        res.end(JSON.stringify(JSON.parse('{"status":"Bad creds."}')));
        return;
    }
    fs.unlinkSync(creds[req.body.u].dir + JSON.parse(JSON.stringify(req.body)).note + '.md');
    res.end(JSON.stringify(JSON.parse('{"status":"File delete request honoured."}')));
    console.log('File delete request received.');
});

// repsonds with a list of all notes for a certain user
app.post('/listNotes/', jsonParser, (req, res) => {
    if (!(creds.hasOwnProperty(req.body.u) && req.body.p == creds[req.body.u].password)) {
        res.end(JSON.stringify(JSON.parse('{"status":"Bad creds."}')));
        return;
    }
    if (!fs.existsSync(creds[req.body.u].dir))
        fs.mkdirSync(creds[req.body.u].dir);
    var items = fs.readdirSync(creds[req.body.u].dir);
    list = [];
    for (let item of items)
        list.push(item);
    listAsJson = '{"list": "' + list.join(',') + '"}';
    res.end(JSON.stringify(JSON.parse(listAsJson)));
    console.log('List served');
});

// saves the content into a certain note
app.post('/setNote/', jsonParser, (req, res) => {
    if (!(creds.hasOwnProperty(req.body.u) && req.body.p == creds[req.body.u].password)) {
        res.end(JSON.stringify(JSON.parse('{"status":"Bad creds."}')));
        return;
    }
    fs.writeFileSync(creds[req.body.u].dir + req.body.file + '.md', req.body.content);
    res.end(JSON.stringify(JSON.parse('{"status":"File saved request honoured."}')));
    console.log('File save request received.');
});

// runs the server on localhost with port 8080 (to be replaced with the ip of the system it's running on)
app.listen(8000, serverDomain, () => {
    console.log('application is running at: http://' + serverDomain + ':8000');
});