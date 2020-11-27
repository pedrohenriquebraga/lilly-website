const express = require("express");
const cors = require("cors");
const path = require("path");
const nunjucks = require("nunjucks");
const compression = require("compression");
const zlib = require("zlib");
const routes = require("./routes");
const cookieParser = require("cookie-parser")

const app = express();

app.use(cookieParser())
app.use(cors());
app.disable("x-powered-by");
app.use(compression({ level: 9 }));
app.use(express.static(path.join(__dirname, "..", "public")));
nunjucks.configure(path.join(__dirname, "views"), {
  express: app,
  noCache: true,
});
app.use(routes)


app.listen(process.env.PORT || 3000);
