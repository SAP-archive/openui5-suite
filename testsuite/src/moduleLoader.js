const fsp = require("fsp");
const path = require("path");

const BASE_PATH = path.join(__dirname, "..", "..");

async function getLibraryDirectories() {
	let libPath = path.join(BASE_PATH, "src");
	let content = await fsp.readdirP(libPath, {withFileTypes: true});
	return content.filter(c => c.isDirectory()).map(c => c.name);
}

function fixDependencies(modules) {
	for (let module of Object.values(modules)) {
		let dependencies = module.dependencies || {};
		module.dependencies = [];
		for (let dependencyName of Object.keys(dependencies)) {
			if (modules[dependencyName]) {
				module.dependencies.push(modules[dependencyName]);
			}
		}
	}
}

function loadModuleConfig(modulePath) {
	let pkg = require(path.join(modulePath, "package.json"));
	return {
		id: pkg.name,
		version: pkg.version,
		path: modulePath,
		dependencies: pkg.dependencies
	};
}

async function getModules() {
	let modules = {};
	let directories = await getLibraryDirectories();
	directories = directories.map(dir => path.join(BASE_PATH, "src", dir));
	directories.push(path.join(BASE_PATH, "testsuite"));
	for (let modulePath of directories) {
		let moduleInfo = loadModuleConfig(modulePath);
		modules[moduleInfo.id] = moduleInfo;
	}
	fixDependencies(modules);
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
	getModules: getModules
};
