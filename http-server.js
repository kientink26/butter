const Butter = require("./butter");
const port = 4060;

const server = new Butter();

server.beforeEach((req, res, next) => {
  console.log(new Date().toLocaleString(), req.method, req.url);
  next();
});

server.beforeEach((req, res, next) => {
  if (req.headers["content-type"] === "application/json") {
    let body = "";
    req.on("data", (data) => {
      body += data.toString("utf-8");
    });
    req.on("end", () => {
      body = JSON.parse(body);
      req.body = body;
      next();
    });
    return;
  }
  next();
});

server.route("get", "/", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});

server.route("get", "/styles.css", (req, res) => {
  res.sendFile("./public/styles.css", "text/css");
});

server.route("get", "/scripts.js", (req, res) => {
  res.sendFile("./public/scripts.js", "text/js");
});

server.route("get", "/favicon.ico", (req, res) => {
  res.sendFile("./public/favicon.ico", "image/x-icon");
});

server.route("post", "/api/login", (req, res) => {
  console.log(req.body?.username, "logged in");
  res.status(200).json(req.body);
});

server.listen(port, () => {
  console.log("server running on port", port);
});
