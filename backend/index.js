const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// set a cookie
app.use(function (req, res, next) {
    // check if client sent cookie
    const cookie = req.cookies.id;
    if (cookie === undefined) {
        // no: set a new cookie
        let randomNumber = Math.random().toString();
        randomNumber = randomNumber.substring(2,randomNumber.length);
        res.cookie('id', randomNumber);
        console.log('cookie created successfully');
    }
    else {
        console.log('cookie exists', cookie);
    }
    next(); // <-- important!
});

const allowedOrigins = ['http://localhost:3000',
    'http://localhost:8080',
    'http://yourapp.com'];
app.use(cors({
    credentials: true,
    origin: function(origin, callback){
        // allow requests with no origin
        // (like mobile apps or curl requests)
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            const msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

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