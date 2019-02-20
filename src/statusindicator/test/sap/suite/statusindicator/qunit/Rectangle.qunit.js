sap.ui.define([
	"sap/suite/statusindicator/FillingType",
	"sap/suite/statusindicator/FillingDirectionType",
	"sap/suite/statusindicator/Rectangle",
	"sap/ui/core/theming/Parameters",
	"./StubsFactory",
	"./Utils",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (FillingType, FillingDirectionType, Rectangle, Parameters, StubsFactory, Utils, sinon) {
	"use strict";

	// add svg element to document.body
	var svgElem = document.createElement("svg");
	svgElem.id = "svg-container";
	svgElem.version = "1.1";
	svgElem.xlmns = "http://www.w3.org/2000/svg";
	document.body.appendChild(svgElem);

	var oCore = sap.ui.getCore();

	QUnit.module("Rectangle Test", {
		beforeEach: function () {
			this.sandbox = sinon.sandbox.create();
		},
		afterEach: function () {
			this.sandbox.verifyAndRestore();
		}
	});

	function prepareRectangle(oRectangle){
		oRectangle.setX(20);
		oRectangle.setY(10);
		oRectangle.setRx(50);
		oRectangle.setRy(55);
		oRectangle.setWidth(100);
		oRectangle.setHeight(200);
		oRectangle.setStrokeWidth(2);
		oRectangle.setStrokeColor("red");
		oRectangle.setFillColor("black");
		oRectangle.setFillingType(FillingType.Linear);
		oRectangle._injectAnimationPropertiesResolver(StubsFactory.createDummyPropertiesResolver());
		return oRectangle;
	}
	QUnit.test("Test default values", function (assert) {
		// Given
		var oRectangle = new Rectangle();
		// Then
		assert.equal(oRectangle.getX(), 0, "Default value of x is 0");
		assert.equal(oRectangle.getY(), 0, "Default value of y is 0");
		assert.equal(oRectangle.getRx(), 0, "Default value of Rx is 0");
		assert.equal(oRectangle.getRy(), 0, "Default value of Ry is 0");
		assert.equal(oRectangle.getWidth(), 0, "Default value of Width is 0");
		assert.equal(oRectangle.getHeight(), 0, "Default value of Height is 0");
	});
	QUnit.test("Changing values", function (assert) {
		// Given
		var oRectangle = new Rectangle();
		oRectangle = prepareRectangle(oRectangle);
		// Then
		assert.equal(oRectangle.getX(), 20, "Value of x is 20");
		assert.equal(oRectangle.getY(), 10, "Value of y is 10");
		assert.equal(oRectangle.getRx(), 50, "Value of Rx is 50");
		assert.equal(oRectangle.getRy(), 55, "Value of Ry is 55");
		assert.equal(oRectangle.getWidth(), 100, "Value of Width is 100");
		assert.equal(oRectangle.getHeight(), 200, "Value of Height is 200");
		assert.equal(oRectangle.getStrokeWidth(), 2, "Value of StrokeWidth is 2");
		assert.equal(oRectangle.getStrokeColor(), "red", "Value of StrokeColor is red");
		assert.equal(oRectangle.getFillColor(), "black", "Value of FillColor is black");

	});
	QUnit.test("Test of Rendering", function (assert) {
		// Given
		var oRectangle = new Rectangle();
		oRectangle = prepareRectangle(oRectangle);
		oRectangle._oAnimationPropertiesResolver.getValue.returns(20);

		var getCssParamStub = this.sandbox.stub(Parameters, "get");
		getCssParamStub.withArgs("sapCriticalColor").returns("#111");
		getCssParamStub.withArgs("sapNeutralColor").returns("#222");
		oRectangle.setFillColor("Critical");
		oRectangle.setStrokeColor("Neutral");

		// When
		oRectangle.placeAt("svg-container");
		oCore.applyChanges();

		// Then
		var oRootElement = oRectangle.$()[0];
		var oRectangleElement = oRootElement.childNodes[1];

		assert.equal(3, oRootElement.childNodes.length, "Rectangle should have 2 children");
		assert.equal(oRootElement.tagName, "svg", "The wrapping element should be group");

		assert.equal(oRectangleElement.getAttribute("x"), 20, "Value of x is 20");
		assert.equal(oRectangleElement.getAttribute("y"), 10, "Value of y is 10");
		assert.equal(oRectangleElement.getAttribute("rx"), 50, "Value of Rx is 50");
		assert.equal(oRectangleElement.getAttribute("ry"), 55, "Value of Ry is 55");
		assert.equal(oRectangleElement.getAttribute("width"), 100, "Value of width is 100");
		assert.equal(oRectangleElement.getAttribute("height"), 200, "Value of height is 200");
		assert.equal(oRectangleElement.getAttribute("stroke-width"), 0, "Value of strokeWidth is 0");
		assert.equal(oRectangleElement.getAttribute("stroke"), "#222", "Value of stroke has been converted according to theme");
		assert.equal(oRectangleElement.getAttribute("fill"), "#123456", "Value of fill has been determined by resolver");

		var oRectangleBorderElement = oRootElement.childNodes[2];
		assert.equal(oRectangleBorderElement.tagName, "rect");
		assert.equal(oRectangleBorderElement.getAttribute("stroke-width"), 2);
		assert.equal(oRectangleBorderElement.getAttribute("fill"), "transparent");
	});

	QUnit.test("Test of Rendering Mask", function (assert) {
		// Given
		var oRectangle = new Rectangle();
		oRectangle = prepareRectangle(oRectangle);
		oRectangle._oAnimationPropertiesResolver.getValue.returns(20);
		oRectangle._setInitialValue(20);

		oRectangle.placeAt("svg-container");
		oCore.applyChanges();

		var oRootElement = oRectangle.$()[0];
		var defsChildren = oRootElement.childNodes[0].childNodes;
		var gradientElement = defsChildren[0];
		var gradientElementChildren = gradientElement.childNodes;
		var maskElement = defsChildren[1];
		var maskShapeElement = maskElement.childNodes[0];
		var rectangleElement = oRootElement.childNodes[1];

		assert.ok(oRectangle._oAnimationPropertiesResolver.getValue.withArgs(oRectangle, 20));

		assert.equal(defsChildren.length, 2, "Length of defs is 2");
		assert.equal(maskElement.tagName, "mask", "sName of Second element is mask");
		assert.equal(gradientElementChildren[0].tagName, "stop", "Filling : First sName is equal to stop");
		assert.equal(gradientElementChildren[1].tagName, "stop", "Filling : Second sName is equal to stop");
		assert.equal(gradientElementChildren[0].getAttribute("offset"), 0.2, "Offset is equal to 0.2");
		assert.equal(gradientElementChildren[1].getAttribute("offset"), 0.2, "Second Offset is equal to 0.2");
		assert.equal(gradientElementChildren[0].getAttribute("stop-color"), "white", "First StopColor is White");
		assert.equal(gradientElementChildren[1].getAttribute("stop-color"), "transparent", "Second StopColor is transparent");

		assert.equal(maskShapeElement.tagName, "rect", "Mask shape is rectangle element");
		assert.equal(Utils.getUrlId(rectangleElement.getAttribute("mask")), maskElement.getAttribute("id"), "Mask of rectangle points to Mask element");

		assert.equal(maskShapeElement.getAttribute("x"), 20, "Value of x is 20");
		assert.equal(maskShapeElement.getAttribute("y"), 10, "Value of y is 10");
		assert.equal(maskShapeElement.getAttribute("rx"), 50, "Value of Rx is 50");
		assert.equal(maskShapeElement.getAttribute("ry"), 55, "Value of Ry is 55");
		assert.equal(maskShapeElement.getAttribute("width"), 100, "Value of width is 100");
		assert.equal(maskShapeElement.getAttribute("height"), 200, "Value of height is 200");
		assert.equal(maskShapeElement.getAttribute("stroke-width"), 0, "Value of strokeWidth is 2");
		assert.equal(maskShapeElement.getAttribute("stroke"), "white", "Shape inside mask has to have always white stroke");
		assert.equal(maskShapeElement.getAttribute("fill"), "url(#" + gradientElement.getAttribute("id") + ")", "Value of fill is correct");
	});

	function directionTest (direction, x1, x2, y1, y2) {
		QUnit.test("Test of Filling Direction " + direction, function (assert) {
			// Given
			var oRectangle = new Rectangle();
			oRectangle = prepareRectangle(oRectangle);
			oRectangle._oAnimationPropertiesResolver.getValue.returns(20);
			oRectangle.setFillingDirection(direction);
			oRectangle.setFillingType(FillingType.Linear);

			oRectangle.placeAt("svg-container");
			oCore.applyChanges();

			var oGradientElement = oRectangle.$()[0].childNodes[0].childNodes[0];

			assert.equal(oGradientElement.getAttribute("x1"), x1, x1 === 1 ? "Filling Direction is Left " : "Filling Direction is not Left ");
			assert.equal(oGradientElement.getAttribute("x2"), x2, x2 === 1 ? "Filling Direction is Right " : "Filling Direction is not Right ");
			assert.equal(oGradientElement.getAttribute("y1"), y1, y1 === 1 ? "Filling Direction is Up " : "Filling Direction is not Up ");
			assert.equal(oGradientElement.getAttribute("y2"), y2, y2 === 1 ? "Filling Direction is Down " : "Filling Direction is not Down ");
		});
	}

	directionTest(FillingDirectionType.Left, 1, 0, 0, 0);
	directionTest(FillingDirectionType.Right, 0, 1, 0, 0);
	directionTest(FillingDirectionType.Up, 0, 0, 1, 0);
	directionTest(FillingDirectionType.Down, 0, 0, 0, 1);

});
