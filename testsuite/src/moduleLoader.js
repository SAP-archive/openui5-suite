const fsp = require("fsp");
const path = require("path");
const normalizer = require("@ui5/project").normalizer;

const BASE_PATH = path.join(__dirname, "..", "..");
const TESTSUITE_ID = "@openui5/sap.suite.testsuite";

async function getLibraryDirectories() {
	let libPath = path.join(BASE_PATH, "src");
	let content = await fsp.readdirP(libPath, {withFileTypes: true});
	return content.filter(c => c.isDirectory()).map(c => c.name);
}

async function loadModuleConfig(modulePath) {
	let config = await normalizer.generateProjectTree({cwd: modulePath});
	return config;
}

function addTestsuiteDependencies(modules) {
	let testsuite = modules[TESTSUITE_ID];
	for (let key of Object.keys(modules)) {
		if (key !== TESTSUITE_ID) {
			testsuite.dependencies.push(modules[key]);
		}
	}
}

async function getModules() {
	let modules = {};
	let directories = await getLibraryDirectories();
	directories = directories.map(dir => path.join(BASE_PATH, "src", dir));
	directories.push(path.join(BASE_PATH, "testsuite"));
	for (let modulePath of directories) {
		let moduleInfo = await loadModuleConfig(modulePath);
		modules[moduleInfo.id] = moduleInfo;
	}
	addTestsuiteDependencies(modules);
	return modules;
}

if (require.main === module) {
	async function main() {
		try {
			let modules = await getModules();
			console.log(JSON.stringify(modules, null, 2));
		} catch (ex) {
			console.log(ex);
		}
	}
	main();
}

module.exports = {
	getModules: getModules,
	TESTSUITE_ID: TESTSUITE_ID
};
