const ui5Server = require("@ui5/server").server;
const moduleLoader = require("./moduleLoader");

async function serve(dependencyTree) {
	const port = process.env.OPENUI5_SRV_PORT || 8080;
	let tree = dependencyTree[moduleLoader.TESTSUITE_ID];

	await ui5Server.serve(tree, {
		port: port,
		changePortIfInUse: true,
	});
	console.log("TestSuite server started");
	console.log(`URL: https://localhost:${port}`);
}

async function main() {
	let modules = await moduleLoader.getModules();
	await serve(modules);
}

main();