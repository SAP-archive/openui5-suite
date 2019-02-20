sap.ui.define(
	[
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageToast"
	],
	function (JSONModel, Controller, MessageToast) {
		"use strict";

		var sCerealsSvg = "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"" +
			"viewBox=\"6.951000213623047 0.7209998965263367 15.062000274658203 29.104000091552734\" xml:space=\"preserve\">" +
			"<path data-shape-id=\"cereal-1\" d=\"M14.664,29.825c-0.133,0-0.217-0.004-0.236-0.005l-0.202-0.01l-0.032-0.2" +
			"c-0.021-0.137-0.515-3.368,1.238-5.323c1.754-1.954,5.02-1.814,5.158-1.806l0.202,0.01l0.032,0.2" +
			"c0.021,0.137,0.516,3.368-1.238,5.323C18.082,29.69,15.467,29.825,14.664,29.825z\" />" +
			"<path data-shape-id=\"cereal-2\" d=\"M13.626,25.116c-0.803,0-3.417-0.135-4.922-1.811c-1.753-1.955-1.26-5.186-1.238-5.322l0.032-0.2l0.202-0.01" +
			"c0.14-0.004,3.404-0.148,5.158,1.806l0,0c1.754,1.955,1.26,5.186,1.238,5.323l-0.032,0.2l-0.202,0.01" +
			"C13.843,25.112,13.759,25.116,13.626,25.116z\" />" +
			"<path data-shape-id=\"cereal-3\" d=\"M15.337,21.752c-0.133,0-0.217-0.004-0.236-0.005l-0.202-0.01l-0.032-0.2" +
			"c-0.021-0.137-0.515-3.368,1.238-5.323c1.754-1.954,5.018-1.813,5.158-1.806l0.202,0.01l0.032,0.2" +
			"c0.021,0.137,0.516,3.368-1.238,5.323C18.755,21.617,16.14,21.752,15.337,21.752z \" />" +
			"<path data-shape-id=\"cereal-4\" d=\"M13.626,17.432c-0.803,0-3.417-0.135-4.922-1.811c-1.753-1.955-1.26-5.186-1.238-5.322l0.032-0.2l0.202-0.01" +
			"c0.14-0.005,3.404-0.148,5.158,1.806l0,0c1.754,1.955,1.26,5.186,1.238,5.323l-0.032,0.2l-0.202,0.01" +
			"C13.843,17.428,13.759,17.432,13.626,17.432z\" />" +
			"<path data-shape-id=\"cereal-5\" d=\"M15.337,14.068c-0.133,0-0.217-0.004-0.236-0.005l-0.202-0.01l-0.032-0.2" +
			"c-0.021-0.137-0.515-3.368,1.238-5.323c1.754-1.954,5.018-1.814,5.158-1.806l0.202,0.01l0.032,0.2" +
			"c0.021,0.137,0.516,3.368-1.238,5.323C18.755,13.933,16.14,14.068,15.337,14.068z \" />" +
			"<path data-shape-id=\"cereal-6\" d=\"M13.107,10.54l-0.164-0.119c-0.112-0.081-2.747-2.017-2.889-4.64c-0.143-2.623,2.268-4.832,2.37-4.924" +
			"l0.15-0.136l0.164,0.119c0.112,0.081,2.746,2.017,2.888,4.64c0.143,2.623-2.267,4.832-2.369,4.924L13.107,10.54z \" />" +
			"</svg>";

		var INDICATOR_IDS = ["indicator0", "indicator1", "indicator2", "indicator3", "indicator4"];

		return Controller.extend("sap.suite.statusindicator.sample.StatusIndicatorFillingAngle.App", {
			_setCustomShapeDefinition:  function (sShapeId, sSvg) {
				var oCustomShape = this.getView().byId(sShapeId);
				oCustomShape.setDefinition(sSvg);
			},
			onInit: function () {
				this._setCustomShapeDefinition("customShape0", sCerealsSvg);
			},
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
