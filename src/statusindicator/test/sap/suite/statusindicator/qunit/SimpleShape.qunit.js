sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/suite/statusindicator/SimpleShape",
	"sap/suite/statusindicator/SimpleShapeRenderer",
	"sap/suite/statusindicator/FillingType",
	"./StubsFactory",
	"./Utils",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (jQuery, SimpleShape, SimpleShapeRenderer, FillingType, StubsFactory, Utils, sinon, sinon_qunit,
             createAndAppendDiv) {
	"use strict";

	// add svg element to document.body
	var svgElem = document.createElement("svg");
	svgElem.id = "svg-container";
	svgElem.version = "1.1";
	svgElem.xlmns = "http://www.w3.org/2000/svg";
	document.body.appendChild(svgElem);

	createAndAppendDiv("content");

	var oCore = sap.ui.getCore();

	QUnit.module("SimpleShape", {
		beforeEach: function () {
			this.sandbox = sinon.sandbox.create();
		},
		afterEach: function () {
			this.sandbox.verifyAndRestore();
			this.oSimpleShape && this.oSimpleShape.destroy();
		}
	});

	QUnit.test("Test default values", function (assert) {
		// Given
		var oShape = new SimpleShape();

		// Then
		assert.equal(oShape.getStrokeWidth(), 0.25, "Default value of strokeWidth is 0.25");
		assert.equal(oShape.getStrokeColor(), "Neutral", "Default value of strokeColor is Neutral");
	});

	QUnit.test("Test set initial and runtime values", function (assert) {
		// Given
		var oShape1 = new SimpleShape({
			fillColor: "red",
			strokeWidth: 1,
			strokeColor: "green"
		});

		var oShape2 = new SimpleShape();

		// When
		oShape2.setFillColor("green");
		oShape2.setStrokeWidth(2);
		oShape2.setStrokeColor("pink");

		// Then
		assert.equal(oShape1.getFillColor(), "red", "FillColor is correctly set to red");
		assert.equal(oShape2.getFillColor(), "green", "FillColor is correctly set to green");
		assert.equal(oShape1.getStrokeWidth(), 1, "Value of strokeWidth is correctly set to 1");
		assert.equal(oShape2.getStrokeWidth(), 2, "Value of strokeWidth is correctly set to 2");
		assert.equal(oShape1.getStrokeColor(), "green", "Value of strokeColor is correctly set to green");
		assert.equal(oShape2.getStrokeColor(), "pink", "Value of strokeColor is correctly set to pink");
	});

	QUnit.test("Test html structure", function (assert) {
		this.oSimpleShape = new SimpleShape({
			fillColor: "#182931"
		});
		var oAnimationPropertiesResolver = StubsFactory.createDummyPropertiesResolver();
		this.oSimpleShape._injectAnimationPropertiesResolver(oAnimationPropertiesResolver);

		this.sandbox.stub(this.oSimpleShape, "_renderSimpleShapeElement", function (oRm, mAttributes) {
			// having own dummy implementation of simple shape for testing cases only should be better then just stubbing parts
			oRm.voidStart("rect");
			this._renderElementAttributes(oRm, mAttributes);
			oRm.attr("stroke-width", 2);
			oRm.voidEnd();
		});

		this.oSimpleShape.placeAt("content");
		oCore.applyChanges();

		var oRootElement = this.oSimpleShape.$()[0];

		assert.equal(oRootElement.tagName, "svg");
		assert.equal(oRootElement.getAttribute("xlmns"), "http://www.w3.org/2000/svg");

		var oShapeElement = oRootElement.childNodes[1];
		assert.equal(oShapeElement.tagName, "rect");
		assert.equal(oShapeElement.getAttribute("fill"), "#123456");
		assert.equal(Utils.getUrlId(oShapeElement.getAttribute("mask")), this.oSimpleShape.getId() + "-mask");
		assert.equal(oShapeElement.getAttribute("stroke-width"), 0);

		var oBorderElement = oRootElement.childNodes[2];
		assert.equal(oBorderElement.tagName, "rect");
		assert.equal(oBorderElement.getAttribute("fill"), "transparent");
		assert.equal(oBorderElement.getAttribute("stroke-width"), 2);
	});

	QUnit.test("Test custom viewBox in html structure", function (assert) {
		this.oSimpleShape = new SimpleShape();
		this.oSimpleShape._sViewBox = "1 5 10 50";
		this.oSimpleShape._injectAnimationPropertiesResolver(StubsFactory.createDummyPropertiesResolver());

		this.sandbox.stub(this.oSimpleShape, "_renderSimpleShapeElement", function (oRm, mAttributes) {
			// having own dummy implementation of simple shape for testing cases only should be better then just stubbing parts
			oRm.voidStart("rect");
			this._renderElementAttributes(oRm, mAttributes);
			oRm.voidEnd();
		});

		this.oSimpleShape.placeAt("content");
		oCore.applyChanges();

		var oRootElement = this.oSimpleShape.$()[0];

		assert.equal(oRootElement.tagName, "svg");
		assert.equal(oRootElement.getAttribute("xlmns"), "http://www.w3.org/2000/svg");
		assert.equal(oRootElement.getAttribute("viewBox"), this.oSimpleShape._sViewBox);
	});

	QUnit.test("Update DOM Test ", function (assert) {
		// Given
		var oSimpleShape = new SimpleShape({
			fillingType: FillingType.Linear
		});
		var oAnimationPropertiesResolver = StubsFactory.createDummyPropertiesResolver();
		oAnimationPropertiesResolver.getColor.returns("#123456");
		oAnimationPropertiesResolver.getValue.withArgs(oSimpleShape, 50).returns(50);
		oSimpleShape._injectAnimationPropertiesResolver(oAnimationPropertiesResolver);

		var getDisplayedFillColorStub = this.sandbox.stub(oSimpleShape,'getDisplayedFillColor').returns("abcd");
		var simpleShape$Stub = this.sandbox.stub(oSimpleShape,'$');
		var findNodes = {
			attr: this.sandbox.stub()
		};
		var simpleShapeUpdateObject = {
			find: this.sandbox.stub().withArgs("stop").returns(findNodes),
			attr: this.sandbox.spy()
		};
		simpleShape$Stub.returns(simpleShapeUpdateObject);

		oSimpleShape._updateDom(50);

		assert.ok(simpleShape$Stub.calledWith("gradient"), "$(gradient) called");
		assert.ok(simpleShapeUpdateObject.find.calledWith("stop"), "find called with right arguments");
		assert.ok(getDisplayedFillColorStub.called, "getDisplayedFillColor called");
		assert.ok(simpleShapeUpdateObject.attr.calledWith("fill", "abcd"), "fill is set to correct color");
		assert.ok(findNodes.attr.calledWith("offset", 0.5), "attr  called with right arguments");
	});

	QUnit.test("Update DOM with polygon based filling", function (assert) {
		var oShape = new SimpleShape({
			fillingType: FillingType.Linear,
			fillingAngle: 45
		});
		var oAnimationPropertiesResolver = StubsFactory.createDummyPropertiesResolver();
		oAnimationPropertiesResolver.getValue.returns(50);
		oShape._injectAnimationPropertiesResolver(oAnimationPropertiesResolver);

		var shape$Stub = this.sandbox.stub(oShape,'$');
		var polygonAttrStub = this.sandbox.stub();
		var shapeUpdateObject = {
			attr: polygonAttrStub
		};
		shape$Stub.returns(shapeUpdateObject);


		var points = [{x: 10, y: 20}, {x: 100, y: 200}, {x: 1000, y: 2000}];

		var getPolygonPointsStub = this.sandbox.stub(oShape, "_getPolygonPoints").returns(points);

		oShape._updateDom(50);

		assert.ok(shape$Stub.withArgs("polygon").calledOnce, "$('polygon') called");
		assert.ok(getPolygonPointsStub.calledOnce, "getPolygonPoints called");
		assert.ok(polygonAttrStub.withArgs("points", points.reduce(function (acc, point) {
			return acc + point.x + "," + point.y + " ";
		}, "")).calledOnce, "points specified by getPolygonPoints passed to DOM");
	});

	QUnit.test("Check usage of polygon mask", function (assert) {
		this.oSimpleShape = new SimpleShape({
			fillingType: FillingType.Linear,
			fillingAngle: 10
		});
		var oAnimationPropertiesResolver = StubsFactory.createDummyPropertiesResolver();
		this.oSimpleShape._injectAnimationPropertiesResolver(oAnimationPropertiesResolver);

		this.sandbox.stub(this.oSimpleShape, "_renderSimpleShapeElement", function (oRm, mAttributes) {
			oRm.voidStart("rect");
			this._renderElementAttributes(oRm, mAttributes);
			oRm.voidEnd();
		});


		this.oSimpleShape.placeAt("svg-container", "last");
		oCore.applyChanges();

		var htmlElements = this.oSimpleShape.$()[0];
		var defsElement = htmlElements.childNodes[0];
		var maskElement = defsElement.childNodes[0];

		assert.equal(maskElement.childNodes.length, 1);

		var polygonElement = maskElement.childNodes[0];
		assert.equal(polygonElement.tagName, "polygon");
		assert.ok(polygonElement.getAttribute("id").endsWith("-polygon"));
		assert.equal(polygonElement.getAttribute("fill"), "white");
	});

	function testFillingUnderAngleSupportedByGradient(testing, expected) {
		var fillingAngle = testing.fillingAngle;
		var gradientVector = expected.vector;

		QUnit.test("Filling under " + fillingAngle + "\u00B0 angle should use gradient filling", function (assert) {

			this.oSimpleShape = new SimpleShape({
				fillingType: FillingType.Linear,
				fillingAngle: fillingAngle
			});
			var oAnimationPropertiesResolver = StubsFactory.createDummyPropertiesResolver();
			this.oSimpleShape._injectAnimationPropertiesResolver(oAnimationPropertiesResolver);

			this.sandbox.stub(this.oSimpleShape, "_renderSimpleShapeElement", function (oRm, mAttributes) {
				oRm.voidStart("rect");
				this._renderElementAttributes(oRm, mAttributes);
				oRm.voidEnd();
			});

			this.oSimpleShape.placeAt("svg-container", "last");
			oCore.applyChanges();

			var defsElement = this.oSimpleShape.$()[0].childNodes[0];
			assert.equal(defsElement.childNodes.length, 2);

			var gradientElement = defsElement.childNodes[0];
			assert.equal(gradientElement.tagName, "linearGradient");
			assert.equal(gradientElement.getAttribute("x1"), gradientVector.x1);
			assert.equal(gradientElement.getAttribute("y1"), gradientVector.y1);
			assert.equal(gradientElement.getAttribute("x2"), gradientVector.x2);
			assert.equal(gradientElement.getAttribute("y2"), gradientVector.y2);

			var maskElement = defsElement.childNodes[1];
			assert.equal(maskElement.childNodes.length, 1);

			var rectElement = maskElement.childNodes[0];
			assert.equal(rectElement.tagName, "rect");
			assert.equal(rectElement.getAttribute("fill"), "url(#" + this.oSimpleShape.getId() + "-gradient)");
		});
	}

	testFillingUnderAngleSupportedByGradient({fillingAngle: 0}, {vector: {x1: 0, y1: 1, x2: 0, y2: 0}});
	testFillingUnderAngleSupportedByGradient({fillingAngle: 90}, {vector: {x1: 1, y1: 0, x2: 0, y2: 0}});
	testFillingUnderAngleSupportedByGradient({fillingAngle: 180}, {vector: {x1: 0, y1: 0, x2: 0, y2: 1}});
	testFillingUnderAngleSupportedByGradient({fillingAngle: 270}, {vector: {x1: 0, y1: 0, x2: 1, y2: 0}});


	QUnit.test("Test invalidation of references before rendering", function (assert) {
		this.oSimpleShape = new SimpleShape();

		this.sandbox.stub(this.oSimpleShape, "_renderSimpleShapeElement", function (oRm, mAttributes) {
			oRm.voidStart("rect");
			this._renderElementAttributes(oRm, mAttributes);
			oRm.voidEnd();
		});


		var oClearDomReferencesSpy = this.sandbox.spy(SimpleShapeRenderer, "_clearDomReferences");

		this.oSimpleShape.onBeforeRendering();

		assert.ok(oClearDomReferencesSpy.calledOnce);
	});

	QUnit.test("Test clearing dom references", function (assert) {
		this.oSimpleShape = new SimpleShape();

		assert.equal(this.oSimpleShape.$polygon, null);
		assert.equal(this.oSimpleShape.$stopNodes, null);

		this.oSimpleShape.$polygon = jQuery();
		this.oSimpleShape.$stopNodes = jQuery();

		this.oSimpleShape.onBeforeRendering();

		assert.equal(this.oSimpleShape.$polygon, null);
		assert.equal(this.oSimpleShape.$stopNodes, null);
	});

});
