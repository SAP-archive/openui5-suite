sap.ui.define(function () {
	"use strict";

	return {
		// Just for a nice title on the pages
		name: "QUnit TestSuite for sap.suite.statusindicator",
		defaults: {
			ui5: {
				language: "en-US",
				// Libraries to load upfront in addition to the library which is tested (sap.ui.export), if null no libs are loaded
				libs: "sap.ui.core,sap.m,sap.suite.statusindicator",
				theme: "sap_belize",
				noConflict: true,
				preload: "auto",
				resourceroots: {"test": "../test-resources"}
			}, // Whether QUnit should be loaded and if so, what version
			qunit: {
				version: 2
			},
			// Whether Sinon should be loaded and if so, what version
			sinon: {
				version: 1,
				qunitBridge: true,
				useFakeTimers: false
			},
			coverage: {
				// Which files to show in the coverage report, if null, no files are excluded from coverage
				only: "//sap\/suite\/statusindicator\/.*/"
			},
			module: "./{name}.qunit"
		},
		tests: {
			/*
			 * StatusIndicator
			 */
			StatusIndicator: {
				group: "StatusIndicator",
				module: [
					"./StatusIndicator.basic.qunit",
					"./ShapeGroup.qunit",
					"./Shape.qunit",
					"./Path.qunit",
					"./Rectangle.qunit",
					"./Circle.qunit",
					"./CustomShape.qunit",
					"./SimpleShape.qunit",
					"./LibraryShape.qunit",
					"./util/ThemingUtil.qunit",
					"./util/ProgressHandler.qunit",
					"./util/AnimationPropertiesResolver.qunit"
				]
			}
		}
	};
});
