const express = require("express");
const app = express();
const {port} = require('./config.js');
require('./utils/database_connect');
const logins = require('./models/login');

app.use(express.urlencoded({extended: true}));

/* PASSPORT SETUP */
const passport = require('passport');
const LocalStrategy = require('passport-local');

passport.use('passport-local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pass'
}, logins.authenticate()));
app.use(passport.initialize({}));
passport.serializeUser(logins.serializeUser());
passport.deserializeUser(logins.deserializeUser());

app.get('/', (req, res) => {
    res.send("Jai shree ram!");
});

/* router configurations */
const authRouter = require('./routes/auth');

app.use('/auth', authRouter);

app.listen (port, () => {
    console.log("Listening to port : " + port);
});
