import { spawn } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

const env = { ...process.env };
const javaRoot = path.resolve(".tools/java");
if (existsSync(javaRoot)) {
  const installation = readdirSync(javaRoot).find(name => existsSync(path.join(javaRoot, name, "bin", "java.exe")));
  if (installation) env.PATH = `${path.join(javaRoot, installation, "bin")}${path.delimiter}${env.PATH}`;
}
const args = process.argv.slice(2);
const nodeRoot = path.resolve(".tools/node22");
let runtime = process.execPath;
if (existsSync(nodeRoot)) {
  const installation = readdirSync(nodeRoot).find(name => existsSync(path.join(nodeRoot, name, "node.exe")));
  if (installation) {
    const bin = path.join(nodeRoot, installation);
    runtime = path.join(bin, "node.exe");
    env.PATH = `${bin}${path.delimiter}${env.PATH}`;
  }
}
const command = args.length ? ["emulators:exec", ...args] : ["emulators:start"];
// A demo-* project has no live backing resources; never accept a project override.
if (args.some(arg => arg.includes("--project"))) throw new Error("Project override is not allowed");
const child = spawn(runtime, ["node_modules/firebase-tools/lib/bin/firebase.js", ...command, "--project", "demo-tech-thela", "--only", "auth,firestore,functions"], { env, stdio: "inherit" });
child.on("exit", code => process.exit(code ?? 1));
