sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
	"sap/m/MessageToast"
], function (JSONModel, Controller, Fragment, MessageToast) {
	"use strict";

	var Ids = Object.freeze({
		INPUT_ID: "shapeIdInput",
		TEXT_AREA_FRAGMENT: "shapeFragmentTextArea",
		POPOVER_FRAGMENT: "popoverFragment"
	});

	return Controller.extend("sap.suite.statusindicator.sample.StatusIndicatorShapesLibrary.App", {
		onInit: function () {
			var oModel = new JSONModel(sap.ui.require.toUrl("sap/suite/statusindicator/sample/StatusIndicatorShapesLibrary") + "/Data.json"),
				oModelSettings = new JSONModel({
					value: 0
				});

			this.getView().setModel(oModel);
			this.getView().setModel(oModelSettings, "settingsData");
		},
		onPressStatusIndicator: function (oEvent) {
			var oSI = oEvent.getSource(),
				sShapeId = oSI.getGroups()[0].getShapes()[0].getShapeId();

			if (!this._oPopover) {
				Fragment.load({
					id: Ids.POPOVER_FRAGMENT,
					name: "sap.suite.statusindicator.sample.StatusIndicatorShapesLibrary.Popover",
					controller: this
				}).then(function (oPopover) {
					this._oPopover = oPopover;
					this.getView().addDependent(oPopover);
					this._byIdFromPopoverFragment(Ids.INPUT_ID).setValue(sShapeId);
					this._byIdFromPopoverFragment(Ids.TEXT_AREA_FRAGMENT).setValue("<StatusIndicator>\n<ShapeGroup>\n" +
						"<LibraryShape shapeId=\"" + sShapeId + "\" />\n</ShapeGroup>\n</StatusIndicator>");
					this._oPopover.openBy(oSI);
				}.bind(this));
			} else {
				this._byIdFromPopoverFragment(Ids.INPUT_ID).setValue(sShapeId);
				this._byIdFromPopoverFragment(Ids.TEXT_AREA_FRAGMENT).setValue("<StatusIndicator>\n<ShapeGroup>\n" +
					"<LibraryShape shapeId=\"" + sShapeId + "\" />\n</ShapeGroup>\n</StatusIndicator>");
				this._oPopover.openBy(oSI);
			}
		},
		onPressCloseButton: function () {
			this._oPopover.close();
		},
		onPressCopyButton: function (sId) {
			this._byIdFromPopoverFragment(sId).$("inner").select();
			document.execCommand("copy");
			MessageToast.show("Copied to clipboard");
		},
		_byIdFromPopoverFragment: function (sId) {
			return Fragment.byId(Ids.POPOVER_FRAGMENT, sId);
		}

	});
});
