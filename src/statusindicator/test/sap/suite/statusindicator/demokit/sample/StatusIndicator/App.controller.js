sap.ui.define(
	[
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageToast"
	],
	function (JSONModel, Controller, MessageToast) {
		"use strict";

		var bulbSvg =
			"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-0.5 0 23 29.48\">" +
			"<title>Asset 23</title>" +
			"<path d=\"M10.9,29.48a10.89,10.89,0,0,1-3-21.37v-7A1.1,1.1,0,0,1,9,0h3.66A1.24,1.24,0,0,1,13.9,1.24V8.11a10.89,10.89,0,0,1-3,21.37Z\"/>" +
			"<path style=\"fill:#c2b4f8\" d=\"M15.93,24.44a1.83,1.83,0,1,1,1.83-1.83A1.83,1.83,0,0,1,15.93,24.44Z\"/>" +
			"<path style=\"fill:#c2b4f8\" d=\"M13.1,21.17a1.26,1.26,0,1,1,1.26-1.26A1.26,1.26,0,0,1,13.1,21.17Z\"/>" +
			"<path style=\"fill:#c2b4f8\" d=\"M16.26,19.62a1.26,1.26,0,1,1,1.26-1.26A1.26,1.26,0,0,1,16.26,19.62Z\"/>" +
			"</svg>";

		var cerealsSvg = "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"" +
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

		var INDICATOR_IDS = ["indicator11", "indicator12", "indicator13", "indicator21", "indicator22", "indicator23",
			"indicator24", "indicator25", "indicator31", "indicator32"];

		return Controller.extend("sap.suite.statusindicator.sample.StatusIndicator.App", {
			onInit: function() {
				this._setCustomShapeDefinition("customShape1", cerealsSvg);
				this._setCustomShapeDefinition("customShape2", cerealsSvg);
				this._setCustomShapeDefinition("customShape3", cerealsSvg);
				this._setCustomShapeDefinition("customShape4", bulbSvg);
				this._setCustomShapeDefinition("customShape5", cerealsSvg);
				this._setCustomShapeDefinition("customShape6", cerealsSvg);
			},
			_setCustomShapeDefinition:  function (sShapeId, sSvg) {
				var oCustomShape = this.getView().byId(sShapeId);
				oCustomShape.setDefinition(sSvg);
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
