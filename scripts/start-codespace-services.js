const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");

function start(name, script, args = []) {
  const log = fs.openSync(`/tmp/binocart-${name}.log`, "w");
  const child = spawn(process.execPath, [path.join(root, script), ...args], {
    cwd: root,
    detached: true,
    stdio: ["ignore", log, log]
  });
  child.unref();
  console.log(`${name} started on pid ${child.pid}`);
}

start("web", "scripts/serve-static.js", ["4173"]);
start("receipt-api", "scripts/receipt-api.js");
