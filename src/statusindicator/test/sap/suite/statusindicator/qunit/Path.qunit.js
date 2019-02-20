sap.ui.define([
	"sap/suite/statusindicator/Path",
	"sap/suite/statusindicator/FillingType",
	"./StubsFactory",
	"sap/ui/core/theming/Parameters",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (Path, FillingType, StubsFactory, Parameters, sinon) {
	"use strict";

	// add svg element to document.body
	var svgElem = document.createElement("svg");
	svgElem.id = "svg-container";
	svgElem.version = "1.1";
	svgElem.xlmns = "http://www.w3.org/2000/svg";
	document.body.appendChild(svgElem);

	var oCore = sap.ui.getCore();

	QUnit.module("Path", {
		beforeEach: function () {
			this.sandbox = sinon.sandbox.create();
		},
		afterEach: function () {
			this.sandbox.verifyAndRestore();
		}
	});

	QUnit.test("Test setting the path", function (assert) {
		var sPath1D = "M10,29.27c-5.5,0-10-4.89-10-10.9C0";
		var oPath1 = new Path({
			d: sPath1D
		});
		oPath1._injectAnimationPropertiesResolver(StubsFactory.createDummyPropertiesResolver());
		var oPath2 = new Path();
		oPath2._injectAnimationPropertiesResolver(StubsFactory.createDummyPropertiesResolver());

		var sPath2D = "M11.51,26.19a1.28,1.28,0,0,1-.62-2.4c2-1.1";
		oPath2.setD(sPath2D);

		assert.equal(oPath1.getD(), sPath1D, "Parameter D contains previously set path.");
		assert.equal(oPath2.getD(), sPath2D, "Parameter D contains previously set path.");
	});

	QUnit.test("Test html structure", function (assert) {
		var sPath1D = "M 10 29.27 c -5.5 0 -10 -4.89 -10 -10.9";
		var oPath1 = new Path({
			d: sPath1D,
			fillingType: FillingType.Linear,
			fillColor: "Critical",
			strokeColor: "Neutral"
		});
		oPath1._injectAnimationPropertiesResolver(StubsFactory.createDummyPropertiesResolver());
		this.sandbox.stub(oPath1, "_getDisplayedGradientOffset").returns(20);

		var getCssParamStub = this.sandbox.stub(Parameters, "get");
		getCssParamStub.withArgs("sapNeutralColor").returns("#222");

		oPath1.placeAt("svg-container");
		oCore.applyChanges();
		var oGroupElement = oPath1.$()[0];

		var oDefsElement = oGroupElement.childNodes[0];
		assert.equal(oDefsElement.tagName, "defs", "Html structure contains 'defs' element");

		var oPathElement = oGroupElement.childNodes[1];
		assert.equal(oPathElement.tagName, "path", "Html structure contains 'path' element");
		assert.equal(oPathElement.getAttribute("d"), sPath1D, "Path HtmlElement contains correct 'D' attribute");

		assert.equal(oPathElement.getAttribute("stroke"), "#222", "Value of stroke has been converted according to theme");
		assert.equal(oPathElement.getAttribute("stroke-width"), 0);
		assert.equal(oPathElement.getAttribute("fill"), "#123456", "Value of fill has been determined by resolver");

		var oBorderElement = oGroupElement.childNodes[2];
		assert.equal(oBorderElement.getAttribute("stroke-width"), 0.25);
		assert.equal(oBorderElement.getAttribute("fill"), "transparent");
	});


});
