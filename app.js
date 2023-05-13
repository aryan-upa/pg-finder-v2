const express = require("express");
const app = express();
const {port, databaseURL, sessionSecret} = require('./config.js');
require('./utils/database_connect');
const logins = require('./models/login');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const path = require('path');
const {addRoleID} = require("./middlewares/common");
const cron = require('node-cron');

/* SERVER CONFIGURATIONS */
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.set('view engine', "ejs");
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, 'public')));


/* SESSION STORE */
const store = new MongoDBStore({
    uri: databaseURL,
    collection: 'sessionStore'
});


/* SESSION & COOKIE SETUP */
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week,
        secure: false
    },
    store: store
}));


/* PASSPORT SETUP */
const passport = require('passport');
const LocalStrategy = require('passport-local');

passport.use('passport-local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pass'
}, logins.authenticate()));
app.use(passport.initialize({}));
app.use(passport.session({}));
passport.serializeUser(logins.serializeUser());
passport.deserializeUser(logins.deserializeUser());


/* MIDDLEWARES */
app.use(addRoleID);
app.use((req, res, next) => {
    res.locals.userRoleID = req.session.userRoleID || null;
    res.locals.userDet = req.session.userDet || null;
    res.locals.user = req.user;
    next();
});


/* HOME ROUTE */
app.get('/', (req, res) => {
    res.render('home',{
        message: "Jai shree ram!",
        user: req.user || null,
        userRoleID: req.session.userRoleID || null,
        userDet: req.session.userDet || null,
    });
});

const {stateUTList, cityMap} = require('./utils/state_city_provider');
app.get('/state-list', (req, res) => {
    res.send(stateUTList);
});

app.get('/city/:state', (req, res) => {
    const {state} = req.params;
    res.send(cityMap[state]);
});


/* ROUTER CONFIGURATION */
const authRouter = require('./routes/auth');
const riderRouter = require('./routes/rider');
const providerRouter = require('./routes/provider');
const propertyRouter = require('./routes/property');
const bookingRouter = require('./routes/booking');
const reviewRouter = require('./routes/review');
const adminRouter = require('./routes/admin');
const contactRouter = require('./routes/contact');

app.use('/auth', authRouter);
app.use('/rider', riderRouter);
app.use('/provider', providerRouter);
app.use('/property', propertyRouter);
app.use('/booking', bookingRouter);
app.use('/review', reviewRouter);
app.use('/admin', adminRouter);
app.use('/contact', contactRouter);


/* LISTENING TO PORT */
app.listen (port, () => {
    console.log("Listening to port : " + port);
});

/* CRON JOBS */
const {fetchTopProperties} = require('./utils/cron_jobs');

cron.schedule('0 0 * * * *', () => {
    fetchTopProperties();
}, {});
