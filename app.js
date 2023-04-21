const express = require("express");
const app = express();
const {port} = require('./config.js');
require('./utils/database_connect');

app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send("Jai shree ram!");
});

/* router configurations */
const authRouter = require('./routes/auth');

app.use('/auth', authRouter);

app.listen (port, () => {
    console.log("Listening to port : " + port);
});
