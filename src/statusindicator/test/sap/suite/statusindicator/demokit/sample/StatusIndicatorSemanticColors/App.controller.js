sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function (JSONModel, Controller, MessageToast) {
	"use strict";

	var INDICATOR_IDS = ["indicator0", "indicator1"];

	return Controller.extend("sap.suite.statusindicator.sample.StatusIndicatorSemanticColors.App", {
		valueChanged: function (oEvent) {
			var iValue = oEvent.getParameter("value"),
				oView = this.getView();
			INDICATOR_IDS.forEach(function (sId) {
				oView.byId(sId).setValue(iValue);
			});
		},
		onElementPress: function (oEvent) {
			MessageToast.show("press event triggered for " + oEvent.getSource().getId());
		}
	});
});
