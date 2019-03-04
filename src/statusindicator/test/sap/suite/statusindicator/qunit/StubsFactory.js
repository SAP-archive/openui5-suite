sap.ui.define([
	"sap/suite/statusindicator/util/AnimationPropertiesResolver",
	"sap/suite/statusindicator/StatusIndicator",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (AnimationPropertiesResolver, StatusIndicator, sinon) {
	"use strict";

	var Factory = function () {};

	Factory.prototype.createStatusIndicator = function () {
		return sinon.createStubInstance(StatusIndicator);
	};

	Factory.prototype.createDummyPropertiesResolver = function () {
		var oInstance = sinon.createStubInstance(AnimationPropertiesResolver);
		oInstance._getStatusIndicatorValue.returns(20);
		oInstance.getValue.returns(20);
		oInstance.getColor.returns("#123456");
		return oInstance;
	};

	return new Factory();
});