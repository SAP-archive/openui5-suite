/*!
 * ${copyright}
 */

/**
 * Initialization Code and shared classes of library sap.suite.controls.
 */
sap.ui.define([],function() {
	"use strict";


	/**
	 * UI5 library: sap.suite.controls.
	 *
	 * @namespace
	 * @name sap.suite.controls
	 * @public
	 */

	// library dependencies

	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "sap.suite.controls",
		dependencies : ["sap.ui.core"],
		types: [
		],
		interfaces: [],
		controls: [
		],
		elements: [],
		noLibraryCSS: false,
		version: "${version}"
	});

	return sap.suite.controls;

});
