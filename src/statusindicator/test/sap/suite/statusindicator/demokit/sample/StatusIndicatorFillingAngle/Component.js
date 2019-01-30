sap.ui.define(["sap/ui/core/UIComponent"], function (UIComponent) {
	"use strict";

	return UIComponent.extend("sap.suite.statusindicator.sample.StatusIndicatorFillingAngle.Component", {

		metadata: {
			rootView: "sap.suite.statusindicator.sample.StatusIndicatorFillingAngle.App",
			dependencies: {
				libs: [
					"sap.m",
					"sap.suite.statusindicator"
				]
			},
			config: {
				stretch: true,
				sample: {
					files: [
						"App.view.xml",
						"App.controller.js"
					]
				}
			}
		}
	});

}, true);
