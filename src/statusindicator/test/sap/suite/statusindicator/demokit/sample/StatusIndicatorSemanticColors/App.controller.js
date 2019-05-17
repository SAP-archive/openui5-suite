sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function (JSONModel, Controller, MessageToast) {
	"use strict";

	return Controller.extend("sap.suite.statusindicator.sample.StatusIndicatorSemanticColors.App", {
		valueChanged: function (oEvent) {
			var iValue = oEvent.getParameter("value"),
				oView = this.getView();
			oView.byId("indicator0").setValue(iValue);
		},
		onElementPress: function (oEvent) {
			MessageToast.show("press event triggered for " + oEvent.getSource().getId());
		}
	});
});
