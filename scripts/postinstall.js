#!/usr/bin/env node

const path = require("node:path");
const process = require("node:process");
const { spawnSync } = require("node:child_process");

// Check if the current working directory is the root of the project.
const isRootInstall = path.resolve(process.cwd()) === path.dirname(path.resolve(__dirname));

if (isRootInstall) {
  console.log("Building dependency packages...");

  spawnSync("pnpm", ["run", "build:deps"]);
}
