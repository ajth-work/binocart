const { spawnSync } = require("node:child_process");
const path = require("node:path");

const args = process.argv.slice(2);
const major = Number(process.versions.node.split(".")[0]);
const root = path.resolve(__dirname, "..");

function run(command, commandArgs) {
  const gradleJdk = "C:\\Program Files\\Android\\Android Studio\\jbr";
  const sdkRoot = path.join(process.env.LOCALAPPDATA, "Android", "Sdk");

  const env = {
    ...process.env,
    JAVA_HOME: gradleJdk,
    ANDROID_HOME: sdkRoot,
    ANDROID_SDK_ROOT: sdkRoot,
    PATH: `${gradleJdk}\\bin;${sdkRoot}\\platform-tools;${process.env.PATH}`
  };

  const result = spawnSync(command, commandArgs, {
    cwd: root,
    stdio: "inherit",
    env
  });
  if (result.status !== null) {
    process.exit(result.status);
  }
}

if (major < 20) {
  run(process.platform === "win32" ? "npx.cmd" : "npx", ["-p", "node@20", "node", __filename, ...args]);
}

run(process.execPath, [path.join(root, "node_modules/@capacitor/cli/bin/capacitor"), ...args]);
