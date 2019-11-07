"use strict";

const path = require("path");
const fs = require("fs");

const Minipass = require("minipass");
const { test } = require("tap");
const spawn = require("cross-spawn");

test("ntl run using an absolute path argument", t => {
	const cwd = t.testdir({
		"package.json": JSON.stringify({
			scripts: {
				build: 'echo "build"'
			}
		})
	});

	spawn("tree", [cwd], { cwd: __dirname }).stdout.pipe(process.stdout);
	const run = spawn("node", ["../../cli.js", cwd], { cwd: __dirname });
	run.stderr.on("data", data => {
		console.error(data.toString());
		t.fail("should not have stderr output");
	});

	const ministream = new Minipass();
	run.stdout.pipe(ministream);
	ministream.collect().then(res => {
		const taskOutput = res[res.length - 1].toString().trim();
		t.equal(taskOutput, "build", "should be able to run task");
		t.end();
	});

	run.stdin.write("\n");
	run.stdin.end();
});
