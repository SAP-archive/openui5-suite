const ui5Server = require("@ui5/server").server;
const projectPreprocessor = require("@ui5/project").projectPreprocessor;
const getModules = require("./moduleLoader").getModules;

async function serve(dependencyTree) {
	const port = process.env.OPENUI5_SRV_PORT || 8080;
	let tree = await projectPreprocessor.processTree(dependencyTree["@openui5/sap.suite.testsuite"]);

	await ui5Server.serve(tree, {
		port: port,
		changePortIfInUse: true,
	});
	console.log("TestSuite server started");
	console.log(`URL: https://localhost:${port}`);
}

async function main() {
	let modules = await getModules();
	await serve(modules);
}

main();