const { spawnSync } = require("node:child_process");
const path = require("node:path");

const args = process.argv.slice(2);
const major = Number(process.versions.node.split(".")[0]);
const root = path.resolve(__dirname, "..");

function run(command, commandArgs) {
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    stdio: "inherit"
  });
  process.exit(result.status ?? 1);
}

if (major < 20) {
  run(process.platform === "win32" ? "npx.cmd" : "npx", ["-p", "node@20", "node", __filename, ...args]);
}

run(process.execPath, [path.join(root, "node_modules/@capacitor/cli/bin/capacitor"), ...args]);
