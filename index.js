if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const redis = require("redis");
const connectRedis = require("connect-redis");
const flash = require("connect-flash");
const path = require("path");
const expressSanitizer = require("express-sanitizer");
const contactRoutes = require("./routes/contact.js");
const pageData = require("./data/pageData.js");

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(expressSanitizer());

//configure store
const RedisStore = connectRedis(session);
//configure redis
const localRedisConfig = {
  port: 6379,
  host: "localhost",
};
const redisClient = redis.createClient(
  process.env.REDIS_URL || localRedisConfig
);
//configure session
const sessionOptions = {
  store: new RedisStore({ client: redisClient }),
  secret: `${process.env.SESSION_SECRET}`,
  saveUninitialized: false,
  resave: false,
  cookie: {
    secure: false, //if true, only transmit cookie over https
    httpOnly: true, //if true, prevents client side JS from reading the cookie
    maxAge: 1000 * 60 * 30, //session max in milliseconds
  },
};
app.use(session(sessionOptions));
//configure flash
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//routes
app.use("/contact", contactRoutes);

app.get("/", (req, res) => {
  let page = pageData["home"];
  res.render("home", { ...page });
});

app.get("/game", (req, res) => {
  let page = pageData["game"];
  res.render("game", { ...page });
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serving on ${PORT}...`);
});
