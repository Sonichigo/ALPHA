/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");
const expressSession = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
require("dotenv").config();
const authRouter = require("./auth");

/**
 * App Variables
*/
const app = express();
const port = process.env.PORT || "8000";


/**
 * Passport Configuration
*/

const strategy = new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: process.env.AUTH0_CALLBACK_URL
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
        return done(null, profile);
  }
);
/**
 * Session Configuration
*/
const session = {
    secret: process.env.SESSION_SECRET,
    cookie: {},
    resave: false,
    saveUninitialized: false
};
  
if (app.get("env") === "production") {
    session.cookie.secure = true;
}
if (app.get("env") === "production") {
    // Serve secure cookies, requires HTTPS
    session.cookie.secure = true; 
}


/**
 * Routes Definitions
 */

app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});
app.get("/user", (req, res) => {
    res.render("user", { title: "Resources", userProfile: { 
        vaccination: 'https://www.cowin.gov.in/home',
        bed : 'https://covid.army/',
        update : 'https://www.worldometers.info/coronavirus/' } });
});
/**app.get("/chatbot", (req, res) => {
    res.sendFile(path.join(__dirname+'/views/chatbot.html'));
});**/

/**
 *  App Configuration
 */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
    done(null, user);
});
  
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.use('/',(req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});
app.use("/", authRouter);