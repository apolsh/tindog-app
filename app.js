const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('config');
const db = require('./database');
var cors = require('cors')

const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const directoryRouter = require('./routes/directory');
const petsRouter = require('./routes/pets');


const app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/directory', directoryRouter);
app.use('/pets', petsRouter);

if(process.env.NODE_ENV === "production"){
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}else{
    app.use(express.static(path.join(__dirname, 'public')));
}

async function start(){
    await db;
}
start();
module.exports = app;
