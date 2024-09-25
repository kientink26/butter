const http = require("http");
const fs = require("fs/promises");

class Butter {
  constructor() {
    this.server = http.createServer();
    this.routers = {};
    this.middlewares = [];

    this.server.on("request", (req, res) => {
      res.sendFile = async (path, mime) => {
        const fd = await fs.open(path, "r");
        const stream = fd.createReadStream();
        res.setHeader("Content-Type", mime);
        stream.pipe(res);
        stream.on("end", () => {
          fd?.close();
        });
      };

      res.status = (code) => {
        res.statusCode = code;
        return res;
      };

      res.json = (obj) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(obj));
      };

      runMiddlewares.call(this, req, res, 0);

      function runMiddlewares(req, res, index) {
        if (index === this.middlewares.length) {
          if (!this.routers[req.method.toLowerCase() + req.url]) {
            return res.status(404).json({ error: "resource not found" });
          }
          return this.routers[req.method.toLowerCase() + req.url](req, res);
        }
        this.middlewares[index](req, res, () => {
          runMiddlewares.call(this, req, res, index + 1);
        });
      }
    });
  }

  route(method, path, cb) {
    this.routers[method + path] = cb;
  }

  beforeEach(cb) {
    this.middlewares.push(cb);
  }

  listen(port, cb) {
    this.server.listen(port, cb);
  }
}

module.exports = Butter;
