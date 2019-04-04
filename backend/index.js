const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const rooms = [{
    id: 1,
    state: 'pending',
    size: 4,
    players: 2,
    },
    {
        id: 2,
        state: 'pending',
        size: 4,
        players: 0,
    }];

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/rooms', (req, res) => {
    res.json(rooms);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));