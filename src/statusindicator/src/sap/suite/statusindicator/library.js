/*!
 * ${copyright}
 */

/**
 * Initialization Code and shared classes of library sap.suite.statusindicator.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/core/library'],
	function(jQuery, library1) {
	"use strict";


	/**
	 * UI5 library: sap.suite.statusindicator.
	 *
	 * @namespace
	 * @name sap.suite.statusindicator
	 * @public
	 */

	// library dependencies

	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "sap.suite.statusindicator",
		dependencies : ["sap.ui.core"],
		types: [
			"sap.suite.statusindicator.ExampleType"
		],
		interfaces: [],
		controls: [
			"sap.suite.statusindicator.Example"
		],
		elements: [],
		noLibraryCSS: false,
		version: "${version}"
	});


	/**
	 * Example type.
	 *
	 * @enum {string}
	 * @public
	 */
	sap.suite.statusindicator.ExampleType = {

		/**
		 * A value.
		 * @public
		 */
		Value1 : "Value1",

		/**
		 * Another value.
		 * @public
		 */
		Value2 : "Value2"

	};


	return sap.suite.statusindicator;

});
