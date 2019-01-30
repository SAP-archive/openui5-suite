sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/suite/statusindicator/Rectangle",
	"sap/suite/statusindicator/Circle",
	"sap/suite/statusindicator/Path",
	"sap/suite/statusindicator/CustomShape",
	"sap/suite/statusindicator/FillingType",
	"sap/suite/statusindicator/FillingOption",
	"./StubsFactory",
	"sap/base/Log",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (jQuery, Rectangle, Circle, Path, CustomShape, FillingType, FillingOption,
						 StubsFactory, Log, sinon, sinon_qunit, createAndAppendDiv) {
	"use strict";

	// add svg element to document.body
	var svgElem = document.createElement("svg");
	svgElem.id = "svg-container";
	svgElem.version = "1.1";
	svgElem.xlmns = "http://www.w3.org/2000/svg";
	document.body.appendChild(svgElem);

	createAndAppendDiv("content");

	function injectAnimationPropetiesResolver(oCustomShape) {
		var oResolver = StubsFactory.createDummyPropertiesResolver();
		oCustomShape._injectAnimationPropertiesResolver(oResolver);
		return oCustomShape;
	}

	function getOffset(oElem){
		return jQuery(oElem).find("stop")[0].getAttribute("offset");
	}

	var oSandbox = null;
	var oCore = sap.ui.getCore();

	QUnit.module("CustomShape", {
		beforeEach: function () {
			oSandbox = sinon.sandbox.create();
		},
		afterEach: function () {
			oSandbox.verifyAndRestore();
			this.oCustomShape && this.oCustomShape.destroy();
		}
	});

	var bulbSvg =
		"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-0.5 0 23 29.48\">" +
		"<title>Asset 23</title>" +
		"<path d=\"M10.9,29.48a10.89,10.89,0,0,1-3-21.37v-7A1.1,1.1,0,0,1,9,0h3.66A1.24,1.24,0,0,1,13.9,1.24V8.11a10.89,10.89,0,0,1-3,21.37Z\"/>" +
		"<path style=\"fill:#c2b4f8\" d=\"M15.93,24.44a1.83,1.83,0,1,1,1.83-1.83A1.83,1.83,0,0,1,15.93,24.44Z\"/>" +
		"<path style=\"fill:#c2b4f8\" d=\"M13.1,21.17a1.26,1.26,0,1,1,1.26-1.26A1.26,1.26,0,0,1,13.1,21.17Z\"/>" +
		"<path style=\"fill:#c2b4f8\" d=\"M16.26,19.62a1.26,1.26,0,1,1,1.26-1.26A1.26,1.26,0,0,1,16.26,19.62Z\"/>" +
		"</svg>";

	QUnit.test("Test default values for attributes", function (assert) {
		this.oCustomShape = new CustomShape({
			definition: bulbSvg
		});
		injectAnimationPropetiesResolver(this.oCustomShape);

		this.oCustomShape.placeAt("content");
		oCore.applyChanges();

		var oRootElement = this.oCustomShape.$()[0];
		assert.equal(oRootElement.getAttribute("x"), "0");
		assert.equal(oRootElement.getAttribute("y"), "0");
		assert.equal(oRootElement.getAttribute("height"), "100%");
		assert.equal(oRootElement.getAttribute("width"), "100%");
		assert.equal(this.oCustomShape.getShapes()[0].getStrokeWidth(), "0.25");
		assert.equal(this.oCustomShape.getShapes()[1].getStrokeWidth(), "0.25");
		assert.equal(this.oCustomShape.getShapes()[2].getStrokeWidth(), "0.25");
		assert.equal(this.oCustomShape.getShapes()[3].getStrokeWidth(), "0.25");
	});

	QUnit.test("Test custom attributes", function (assert) {
		this.oCustomShape = new CustomShape({
			x: 10,
			y: 20,
			height: "300px",
			width: "100px",
			definition: bulbSvg,
			strokeWidth: 4
		});
		injectAnimationPropetiesResolver(this.oCustomShape);

		this.oCustomShape.placeAt("content");
		oCore.applyChanges();

		var oRootElement = this.oCustomShape.$()[0];
		assert.equal(oRootElement.getAttribute("x"), "10");
		assert.equal(oRootElement.getAttribute("y"), "20");
		assert.equal(oRootElement.getAttribute("height"), "300px");
		assert.equal(oRootElement.getAttribute("width"), "100px");
		assert.equal(this.oCustomShape.getShapes()[0].getStrokeWidth(), "4");
		assert.equal(this.oCustomShape.getShapes()[1].getStrokeWidth(), "4");
		assert.equal(this.oCustomShape.getShapes()[2].getStrokeWidth(), "4");
		assert.equal(this.oCustomShape.getShapes()[3].getStrokeWidth(), "4");
	});

	QUnit.test("Test no viewBox attribute in definition", function (assert) {
		this.oCustomShape = new CustomShape({
			fillingType: FillingType.None,
			definition: "<svg>" +
			"<circle cx='1' cy='2' r='2'></circle>" +
			"</svg>"
		});
		injectAnimationPropetiesResolver(this.oCustomShape);

		this.oCustomShape.placeAt("content");
		oCore.applyChanges();

		var oRootElement = this.oCustomShape.$()[0];
		assert.equal(oRootElement.getAttribute("viewBox"), null);
	});

	QUnit.test("Test viewBox attribute in definition", function (assert) {
		this.oCustomShape = new CustomShape({
			fillingType: FillingType.None,
			definition: "<svg viewBox='1 2 20 50'>" +
			"<circle cx='1' cy='2' r='2'></circle>" +
			"</svg>"
		});
		injectAnimationPropetiesResolver(this.oCustomShape);

		this.oCustomShape.placeAt("content");
		oCore.applyChanges();

		var oRootElement = this.oCustomShape.$()[0];
		assert.equal(oRootElement.tagName, "svg");
		assert.equal(oRootElement.getAttribute("viewBox"), "1 2 20 50");
	});

	QUnit.test("Test parsing of SVG with one fillable object (Path)", function (assert) {
		var sPathD = "M 15.93 24.44 a 1.83 1.83 0 1 1 1.83 -1.83 A 1.83 1.83 0 0 1 15.93 24.44 Z";
		var iCircleCx = 1;
		var iCircleCy = 2;
		var iCircleR = 4;
		var sCircleStyle = "some: style";
		var oCustomShape = new CustomShape({
			strokeColor: "blue",
			fillColor: "violet",
			fillingType: FillingType.Linear,
			definition: "<svg>" +
			"<path d='" + sPathD + "'></path>" +
			"<circle style='" + sCircleStyle + "' cx='" + iCircleCx + "' cy='" + iCircleCy + "' r='" + iCircleR + "'></circle>" +
			"</svg>"
		});
		injectAnimationPropetiesResolver(oCustomShape);

		oCustomShape._refreshInternalStructure();

		assert.equal(oCustomShape._aFillableSubShapes.length, 1, "SVG markup contains one fillable shape");

		var oFillableShape = oCustomShape._aFillableSubShapes[0].shape;
		assert.ok(oFillableShape instanceof Path, "Fillable shape is instance of Path");
		assert.equal(oFillableShape.getFillColor(), oCustomShape.getFillColor(), "Fillable shape have the color specified by custom shape");
		assert.equal(oFillableShape.getFillingType(), oCustomShape.getFillingType(), "Fillable shape have the fillingType specified by custom shape");
		assert.equal(oFillableShape.getD(), sPathD, "Fillable shape has definition from SVG");

		var aShapes = oCustomShape.getShapes();
		var oCreatedPath = aShapes[0];

		assert.equal(aShapes.length, 2, "SVG markup contains specification for two objects");
		assert.ok(oCreatedPath === oFillableShape, "The created path is the fillable one");
	});

	QUnit.test("Test parsing of SVG with one fillable object (Circle)", function (assert) {
		var sPathD = "M 15.93 24.44 a 1.83 1.83 0 1 1 1.83 -1.83 A 1.83 1.83 0 0 1 15.93 24.44 Z";
		var iCircleCx = 1;
		var iCircleCy = 2;
		var iCircleR = 4;
		var sPathStyle = "some: style";
		var oCustomShape = new CustomShape({
			strokeColor: "blue",
			fillColor: "violet",
			fillingType: FillingType.Linear,
			definition: "<svg>" +
			"<path style='" + sPathStyle + "' d='" + sPathD + "'></path>" +
			"<circle cx='" + iCircleCx + "' cy='" + iCircleCy + "' r='" + iCircleR + "'></circle>" +
			"</svg>"
		});
		injectAnimationPropetiesResolver(oCustomShape);

		oCustomShape._refreshInternalStructure();

		assert.equal(oCustomShape._aFillableSubShapes.length, 1, "SVG markup contains one fillable shape");

		var oFillableShape = oCustomShape._aFillableSubShapes[0].shape;
		assert.ok(oFillableShape instanceof Circle, "Fillable shape is instance of Circle");
		assert.equal(oFillableShape.getFillColor(), oCustomShape.getFillColor(), "Fillable shape have the color specified by custom shape");
		assert.equal(oFillableShape.getFillingType(), oCustomShape.getFillingType(), "Fillable shape have the fillingType specified by custom shape");

		var aShapes = oCustomShape.getShapes();
		var oCreatedCircle = aShapes[1];

		assert.equal(aShapes.length, 2, "SVG markup contains specification for two objects");
		assert.ok(oCreatedCircle === oFillableShape, "The created circle is the fillable one");
	});

	QUnit.test("Test parsing of SVG with one fillable object (Rectangle)", function (assert) {
		var sPathD = "M 15.93 24.44 a 1.83 1.83 0 1 1 1.83 -1.83 A 1.83 1.83 0 0 1 15.93 24.44 Z";
		var iRectX = 1;
		var iRectY = 2;
		var iRectWidth = 4;
		var iRectHeight = 8;
		var sPathStyle = "some: style";
		var oCustomShape = new CustomShape({
			strokeColor: "blue",
			fillColor: "violet",
			fillingType: FillingType.Linear,
			definition: "<svg>" +
			"<path style='" + sPathStyle + "' d='" + sPathD + "'></path>" +
			"<rect x='" + iRectX + "' y='" + iRectY + "' width='" + iRectWidth + "' height='" + iRectHeight + "'></rect>" +
			"</svg>"
		});
		injectAnimationPropetiesResolver(oCustomShape);

		oCustomShape._refreshInternalStructure();

		assert.equal(oCustomShape._aFillableSubShapes.length, 1, "SVG markup contains one fillable shape");

		var oFillableShape = oCustomShape._aFillableSubShapes[0].shape;
		assert.ok(oFillableShape instanceof Rectangle, "Fillable shape is instance of Rect");
		assert.equal(oFillableShape.getFillColor(), oCustomShape.getFillColor(), "Fillable shape have the color specified by custom shape");
		assert.equal(oFillableShape.getFillingType(), oCustomShape.getFillingType(), "Fillable shape have the fillingType specified by custom shape");

		var aShapes = oCustomShape.getShapes();
		var oCreatedRect = aShapes[1];

		assert.equal(aShapes.length, 2, "SVG markup contains specification for two objects");
		assert.ok(oCreatedRect === oFillableShape, "The created rect is the fillable one");
	});

	QUnit.test("Test passing parameters from SVG markup", function (assert) {
		var sPathD = "M 15.93 24.44 a 1.83 1.83 0 1 1 1.83 -1.83 A 1.83 1.83 0 0 1 15.93 24.44 Z";
		var iCircleCx = 1;
		var iCircleCy = 2;
		var iCircleR = 4;
		var iRectX = 10;
		var iRectY = 20;
		var iRectWidth = 40;
		var iRectHeight = 80;
		var sCircleStyle = "color: blue;";
		var sPathStyle = "color: white;";
		var sRectStyle = "color: violet;";
		var oCustomShape = new CustomShape({
			fillColor: "violet",
			fillingType: FillingType.Linear,
			definition: "<svg>" +
			"<circle style='" + sCircleStyle + "' cx='" + iCircleCx + "' cy='" + iCircleCy + "' r='" + iCircleR + "'>" +
			"</circle>" +
			"<path style='" + sPathStyle + "' d='" + sPathD + "'>" +
			"</path>" +
			"<rect style='" + sRectStyle + "' x='" + iRectX + "' y='" + iRectY + "' width='" + iRectWidth + "' height='" + iRectHeight + "'>" +
			"</rect>" +
			"</svg>"
		});
		injectAnimationPropetiesResolver(oCustomShape);

		oCustomShape._refreshInternalStructure();

		assert.equal(oCustomShape._aFillableSubShapes.length, 0, "SVG markup contains no fillable shape");

		var aShapes = oCustomShape.getShapes();
		var oCreatedCircle = aShapes[0];
		var oCreatedPath = aShapes[1];
		var oCreatedRect = aShapes[2];

		assert.equal(oCreatedCircle._sStyleAttribute, sCircleStyle, "Circle should have style from SVG markup");
		assert.equal(oCreatedCircle.getCx(), iCircleCx, "Circle should have cx attribute from SVG markup");
		assert.equal(oCreatedCircle.getCy(), iCircleCy, "Circle should have cy attribute from SVG markup");
		assert.equal(oCreatedCircle.getR(), iCircleR, "Circle should have r attribute from SVG markup");

		assert.equal(oCreatedPath._sStyleAttribute, sPathStyle, "Path should have style from SVG markup");
		assert.equal(oCreatedPath.getD(), sPathD, "Path should have D attribute from SVG markup");

		assert.equal(oCreatedRect._sStyleAttribute, sRectStyle, "Rectangle should have style from SVG markup");
		assert.equal(oCreatedRect.getX(), iRectX, "Rectangle should have x attribute from SVG markup");
		assert.equal(oCreatedRect.getY(), iRectY, "Rectangle should have y attribute from SVG markup");
		assert.equal(oCreatedRect.getHeight(), iRectHeight, "Rectangle should have height attribute from SVG markup");
		assert.equal(oCreatedRect.getWidth(), iRectWidth, "Rectangle should have width attribute from SVG markup");
	});

	QUnit.test("Test multiple fillable shapes", function (assert) {
		var sPathD = "M 15.93 24.44 a 1.83 1.83 0 1 1 1.83 -1.83 A 1.83 1.83 0 0 1 15.93 24.44 Z";
		var oCustomShape = new CustomShape({
			fillColor: "violet",
			fillingType: FillingType.Linear,
			definition: "<svg>" +
			"<circle cx='1' cy='2' r='4'></circle>" +
			"<path d='" + sPathD + "'></path>" +
			"<rect x='2' y='3' width='5' height='7'></rect>" +
			"<circle cx='5' cy='10' r='80'></circle>" +
			"</svg>"
		});
		injectAnimationPropetiesResolver(oCustomShape);

		oCustomShape._refreshInternalStructure();
		assert.equal(oCustomShape._aFillableSubShapes.length, 4, "The SVG markup contains 4 fillable shapes");

		assert.ok(oCustomShape._aFillableSubShapes[0].shape instanceof Circle, "The first fillable shape is circle");
		assert.equal(oCustomShape._aFillableSubShapes[0].shape.getCx(), 1, "The first fillable shape is circle");
		assert.equal(oCustomShape._aFillableSubShapes[0].fillingOption, null, "The first fillable shape has no filling option");

		assert.ok(oCustomShape._aFillableSubShapes[1].shape instanceof Path, "The second fillable shape is circle");
		assert.equal(oCustomShape._aFillableSubShapes[1].shape.getD(), sPathD, "The second fillable shape is circle");
		assert.equal(oCustomShape._aFillableSubShapes[1].fillingOption, null, "The second fillable shape has no filling option");

		assert.ok(oCustomShape._aFillableSubShapes[2].shape instanceof Rectangle, "The third fillable shape is circle");
		assert.equal(oCustomShape._aFillableSubShapes[2].shape.getX(), 2, "The third fillable shape is circle");
		assert.equal(oCustomShape._aFillableSubShapes[2].fillingOption, null, "The third fillable shape has no filling option");

		assert.ok(oCustomShape._aFillableSubShapes[3].shape instanceof Circle, "The forth fillable shape is circle");
		assert.equal(oCustomShape._aFillableSubShapes[3].shape.getCx(), 5, "The forth fillable shape is circle");
		assert.equal(oCustomShape._aFillableSubShapes[3].fillingOption, null, "The forth fillable shape has no filling option");
	});

	QUnit.test("Test updateDom with multiple shapes in default setup", function (assert) {
		var sPathD = "M 15.93 24.44 a 1.83 1.83 0 1 1 1.83 -1.83 A 1.83 1.83 0 0 1 15.93 24.44 Z";
		var oCustomShape = new CustomShape({
			fillColor: "violet",
			fillingType: FillingType.Linear,
			definition: "<svg>" +
			"<circle cx='1' cy='2' r='4'></circle>" +
			"<path d='" + sPathD + "'></path>" +
			"<rect x='2' y='3' width='5' height='7'></rect>" +
			"<circle cx='5' cy='10' r='80'></circle>" +
			"</svg>"
		});
		injectAnimationPropetiesResolver(oCustomShape);

		oCustomShape._refreshInternalStructure();

		var oFillableShape1 = oCustomShape._aFillableSubShapes[0].shape;
		var oFillableShape2 = oCustomShape._aFillableSubShapes[1].shape;
		var oFillableShape3 = oCustomShape._aFillableSubShapes[2].shape;
		var oFillableShape4 = oCustomShape._aFillableSubShapes[3].shape;
		var oShape1UpdateDomStub = sinon.stub(oFillableShape1, "_updateDom");
		var oShape2UpdateDomStub = sinon.stub(oFillableShape2, "_updateDom");
		var oShape3UpdateDomStub = sinon.stub(oFillableShape3, "_updateDom");
		var oShape4UpdateDomStub = sinon.stub(oFillableShape4, "_updateDom");
		oCustomShape._oAnimationPropertiesResolver.getValue.returns(60);

		oCustomShape._updateDom(60);

		assert.ok(oShape1UpdateDomStub.calledWith(100, true), "The first shape should be fully filled.");
		assert.ok(oShape2UpdateDomStub.calledWith(100, true), "The second shape should be fully filled.");
		assert.ok(oShape3UpdateDomStub.calledWith(40, true), "The third shape should be partially filled.");
		assert.ok(oShape4UpdateDomStub.calledWith(0, true), "The third shape should be unfilled.");
		assert.ok(oCustomShape._oAnimationPropertiesResolver.getValue.withArgs(oCustomShape, 60).called, "getValue should be called only from CustomShape");
		assert.ok(oCustomShape._oAnimationPropertiesResolver.getValue.calledOnce, "getValue on AnimationPropertiesResolver should be called once");
	});

	QUnit.test("Test FillingOption with no order", function (assert) {
		var oLogFatalStub = oSandbox.stub(Log, "fatal");

		var oCustomShape = new CustomShape({
			definition: "<svg>" +
			"<circle data-shape-id='circle-1' cx='1' cy='2' r='4'></circle>" +
			"</svg>",
			fillingOptions: [
				new FillingOption({
					shapeId: "circle-1"
				})
			]
		});

		assert.ok(oLogFatalStub.called, "There should be fatal error log for FillingOption with no order");
		assert.equal(oCustomShape.getFillingOptions().length, 0, "Invalid FillingOption is not inserted");
	});

	QUnit.test("Test explicitly setup order", function (assert) {
		var sPathD = "M 15.93 24.44 a 1.83 1.83 0 1 1 1.83 -1.83 A 1.83 1.83 0 0 1 15.93 24.44 Z";
		var oCustomShape = new CustomShape({
			fillColor: "violet",
			fillingType: FillingType.Linear,
			definition: "<svg>" +
			"<circle data-shape-id='circle-1' cx='1' cy='2' r='4'></circle>" +
			"<path data-shape-id='path-1' d='" + sPathD + "'></path>" +
			"<rect data-shape-id='rect-1' x='2' y='3' width='5' height='7'></rect>" +
			"<circle data-shape-id='circle-2' cx='5' cy='10' r='80'></circle>" +
			"</svg>",
			fillingOptions: [
				new FillingOption({
					shapeId: "circle-1",
					order: 100
				}),
				new FillingOption({
					shapeId: "path-1",
					order: 10
				}),
				new FillingOption({
					shapeId: "rect-1",
					order: 50
				}),
				new FillingOption({
					shapeId: "circle-2",
					order: 25
				})
			]
		});

		injectAnimationPropetiesResolver(oCustomShape);
		oCustomShape._refreshInternalStructure();

		assert.equal(oCustomShape._aFillableSubShapes.length, 4, "The SVG markup contains 4 fillable shapes");

		var oPathSubShape = oCustomShape._aFillableSubShapes[0].shape;
		var oPathFillingOption = oCustomShape._aFillableSubShapes[0].fillingOption;
		assert.ok(oPathSubShape instanceof Path, "The first fillable shape is path");
		assert.equal(oPathSubShape.getD(), sPathD, "The path has correct D property");
		assert.ok(oPathFillingOption instanceof FillingOption, "The first fillable shape has filling option");
		assert.equal(oPathFillingOption.getOrder(), 10, "The first fillable shape has correct order");

		var oCircle1SubShape = oCustomShape._aFillableSubShapes[1].shape;
		var oCircle1FillingOption = oCustomShape._aFillableSubShapes[1].fillingOption;
		assert.ok(oCircle1SubShape instanceof Circle, "The second fillable shape is circle");
		assert.equal(oCircle1SubShape.getCx(), 5, "THe circle has correct cx property");
		assert.ok(oCircle1FillingOption instanceof FillingOption, "The second fillable shape has filling option");
		assert.equal(oCircle1FillingOption.getOrder(), 25, "The second fillable shape has correct order");

		var oRectangleSubShape = oCustomShape._aFillableSubShapes[2].shape;
		var oRectangleFillingOption = oCustomShape._aFillableSubShapes[2].fillingOption;
		assert.ok(oRectangleSubShape instanceof Rectangle, "The third fillable shape is rectangle");
		assert.equal(oRectangleSubShape.getX(), 2, "The rectangle has correct x property");
		assert.ok(oRectangleFillingOption instanceof FillingOption, "The third fillable shape has filling option");
		assert.equal(oRectangleFillingOption.getOrder(), 50, "The third fillable shape has correct order");

		var oCircle2SubShape = oCustomShape._aFillableSubShapes[3].shape;
		var oCircle2FillingOption = oCustomShape._aFillableSubShapes[3].fillingOption;
		assert.ok(oCircle2SubShape instanceof Circle, "The forth fillable shape is circle");
		assert.equal(oCircle2SubShape.getCx(), 1, "The circle has correct cx property");
		assert.ok(oCircle2FillingOption instanceof FillingOption, "The forth fillable shape has filling option");
		assert.equal(oCircle2FillingOption.getOrder(), 100, "The forth fillable shape has correct order");
	});

	QUnit.test("Test updateDom with different weight", function (assert) {
		var sPathD = "M 15.93 24.44 a 1.83 1.83 0 1 1 1.83 -1.83 A 1.83 1.83 0 0 1 15.93 24.44 Z";
		var oCustomShape = new CustomShape({
			fillColor: "violet",
			fillingType: FillingType.Linear,
			definition: "<svg>" +
			"<circle data-shape-id='circle-1' cx='1' cy='2' r='4'></circle>" +
			"<path data-shape-id='path-1' d='" + sPathD + "'></path>" +
			"<rect data-shape-id='rect-1' x='2' y='3' width='5' height='7'></rect>" +
			"</svg>",
			fillingOptions: [
				new FillingOption({
					shapeId: "circle-1",
					order: 100
				}),
				new FillingOption({
					shapeId: "path-1",
					order: 10
				}),
				new FillingOption({
					shapeId: "rect-1",
					order: 50,
					weight: 2
				})
			]
		});
		injectAnimationPropetiesResolver(oCustomShape);
		oCustomShape._refreshInternalStructure();
		var oShape1UpdateDomStub = sinon.stub(oCustomShape._aFillableSubShapes[0].shape, "_updateDom");
		var oShape2UpdateDomStub = sinon.stub(oCustomShape._aFillableSubShapes[1].shape, "_updateDom");
		var oShape3UpdateDomStub = sinon.stub(oCustomShape._aFillableSubShapes[2].shape, "_updateDom");
		oCustomShape._oAnimationPropertiesResolver.getValue.withArgs(oCustomShape, 40).returns(40);

		oCustomShape._updateDom(40);

		assert.ok(oShape1UpdateDomStub.calledWith(100, true), "The first shape should be fully filled.");
		assert.ok(oShape2UpdateDomStub.calledWith(30, true), "The second shape should be partially filled.");
		assert.ok(oShape3UpdateDomStub.calledWith(0, true), "The third shape should be unfilled.");
	});

	QUnit.test("Test updateDom explicitly setup order", function (assert) {
		var sPathD = "M 15.93 24.44 a 1.83 1.83 0 1 1 1.83 -1.83 A 1.83 1.83 0 0 1 15.93 24.44 Z";
		var oCustomShape = new CustomShape({
			fillColor: "violet",
			fillingType: FillingType.Linear,
			definition: "<svg>" +
			"<circle data-shape-id='circle-1' cx='1' cy='2' r='4'></circle>" +
			"<path data-shape-id='path-1' d='" + sPathD + "'></path>" +
			"<rect data-shape-id='rect-1' x='2' y='3' width='5' height='7'></rect>" +
			"<circle data-shape-id='circle-2' cx='5' cy='10' r='80'></circle>" +
			"</svg>",
			fillingOptions: [
				new FillingOption({
					shapeId: "circle-1",
					order: 100
				}),
				new FillingOption({
					shapeId: "path-1",
					order: 10
				}),
				new FillingOption({
					shapeId: "rect-1",
					order: 50
				}),
				new FillingOption({
					shapeId: "circle-2",
					order: 25
				})
			]
		});
		injectAnimationPropetiesResolver(oCustomShape);
		oCustomShape._refreshInternalStructure();
		var oShape1UpdateDomStub = sinon.stub(oCustomShape._aFillableSubShapes[0].shape, "_updateDom");
		var oShape2UpdateDomStub = sinon.stub(oCustomShape._aFillableSubShapes[1].shape, "_updateDom");
		var oShape3UpdateDomStub = sinon.stub(oCustomShape._aFillableSubShapes[2].shape, "_updateDom");
		var oShape4UpdateDomStub = sinon.stub(oCustomShape._aFillableSubShapes[3].shape, "_updateDom");
		oCustomShape._oAnimationPropertiesResolver.getValue.withArgs(oCustomShape, 60).returns(60);

		oCustomShape._updateDom(60);

		assert.ok(oShape1UpdateDomStub.calledWith(100, true), "The first shape should be fully filled.");
		assert.ok(oShape2UpdateDomStub.calledWith(100, true), "The second shape should be fully filled.");
		assert.ok(oShape3UpdateDomStub.calledWith(40, true), "The third shape should be partially filled.");
		assert.ok(oShape4UpdateDomStub.calledWith(0, true), "The third shape should be unfilled.");
	});

	QUnit.test("Test FillingOptions with same order", function (assert) {
		var sPathD = "M 15.93 24.44 a 1.83 1.83 0 1 1 1.83 -1.83 A 1.83 1.83 0 0 1 15.93 24.44 Z";
		var oCustomShape = new CustomShape({
			fillColor: "violet",
			fillingType: FillingType.Linear,
			definition: "<svg>" +
			"<circle data-shape-id='circle-1' cx='1' cy='2' r='4'></circle>" +
			"<path data-shape-id='path-1' d='" + sPathD + "'></path>" +
			"<rect data-shape-id='rect-1' x='2' y='3' width='5' height='7'></rect>" +
			"<circle data-shape-id='circle-2' cx='5' cy='10' r='80'></circle>" +
			"</svg>",
			fillingOptions: [
				new FillingOption({
					shapeId: "circle-1",
					order: 100
				}),
				new FillingOption({
					shapeId: "path-1",
					order: 50
				}),
				new FillingOption({
					shapeId: "rect-1",
					order: 50
				}),
				new FillingOption({
					shapeId: "circle-2",
					order: 25
				})
			]
		});

		var oFillingOptions = oCustomShape.getFillingOptions();

		assert.equal(oFillingOptions.length, 3, "CustomShape has only 3 FillingOptions");
		assert.equal(oFillingOptions[0].getOrder(), 100, "The first FillingOption has correct order");
		assert.equal(oFillingOptions[1].getOrder(), 50, "The second FillingOption has correct order");
		assert.equal(oFillingOptions[1].getShapeId(), "path-1", "The first FillingOption with same order has higher priority");
		assert.equal(oFillingOptions[2].getOrder(), 25, "The third has correct order");
	});

	QUnit.test("Test Distribution of filling", function (assert) {
		var sPathD = "M 15.93 24.44 a 1.83 1.83 0 1 1 1.83 -1.83 A 1.83 1.83 0 0 1 15.93 24.44 Z";
		var oCustomShape = new CustomShape({
			fillColor: "violet",
			fillingType: FillingType.Linear,
			definition: "<svg>" +
			"<circle data-shape-id='circle-1' cx='1' cy='2' r='4'></circle>" +
			"<path data-shape-id='path-1' d='" + sPathD + "'></path>" +
			"<rect data-shape-id='rect-1' x='2' y='3' width='5' height='7'></rect>" +
			"<circle data-shape-id='circle-2' cx='5' cy='10' r='80'></circle>" +
			"<circle data-shape-id='circle-3' cx='5' cy='10' r='80'></circle>" +
			"<rect data-shape-id='rect-2' x='2' y='3' width='5' height='7'></rect>" +
			"</svg>",
			fillingOptions: [
				new FillingOption({
					shapeId: "circle-1",
					order: 100
				}),
				new FillingOption({
					shapeId: "path-1",
					order: 50
				}),
				new FillingOption({
					shapeId: "rect-1",
					order: 50
				}),
				new FillingOption({
					shapeId: "circle-2",
					order: 25
				})
			]
		});
		injectAnimationPropetiesResolver(oCustomShape);
		oCustomShape._refreshInternalStructure();
		var oShape1UpdateDomStub = sinon.stub(oCustomShape._aFillableSubShapes[0].shape, "_updateDom");
		var oShape2UpdateDomStub = sinon.stub(oCustomShape._aFillableSubShapes[1].shape, "_updateDom");
		var oShape3UpdateDomStub = sinon.stub(oCustomShape._aFillableSubShapes[2].shape, "_updateDom");
		var oShape4UpdateDomStub = sinon.stub(oCustomShape._aFillableSubShapes[3].shape, "_updateDom");
		var oShape5UpdateDomStub = sinon.stub(oCustomShape._aFillableSubShapes[4].shape, "_updateDom");
		var oShape6UpdateDomStub = sinon.stub(oCustomShape._aFillableSubShapes[5].shape, "_updateDom");
		oCustomShape._oAnimationPropertiesResolver.getValue.withArgs(oCustomShape, 100).returns(100);

		oCustomShape._updateDom(100);

		assert.ok(oShape1UpdateDomStub.calledWith(100, true), "The first shape should be fully filled.");
		assert.ok(oShape2UpdateDomStub.calledWith(100, true), "The second shape should be fully filled.");
		assert.ok(oShape3UpdateDomStub.calledWith(100, true), "The third shape should be fully filled.");
		assert.ok(oShape4UpdateDomStub.calledWith(100, true), "The forth shape should be fully filled.");
		assert.ok(oShape5UpdateDomStub.calledWith(100, true), "The fifth shape should be fully filled.");
		assert.ok(oShape6UpdateDomStub.calledWith(100, true), "The sixth shape should be fully filled.");
	});

	QUnit.test("Shapes is correctly filled after re-rendering", function (assert) {
		this.oCustomShape = new CustomShape({
			definition: bulbSvg
		});
		injectAnimationPropetiesResolver(this.oCustomShape);

		this.oCustomShape.placeAt("content");
		oCore.applyChanges();

		var oRootElement = this.oCustomShape.$()[0];

		var fOffset = getOffset(oRootElement);
		assert.equal(fOffset, "0.2", "initial offset is correct");

		this.oCustomShape.invalidate();

		fOffset = getOffset(oRootElement);
		assert.equal(fOffset, "0.2", "offset is still correct after rerendering");
	});

	QUnit.test("Shapes is correctly filled after changing strokeWidth", function (assert) {
		this.oCustomShape = new CustomShape({
			definition: bulbSvg
		});
		injectAnimationPropetiesResolver(this.oCustomShape);

		this.oCustomShape.placeAt("content");
		oCore.applyChanges();


		var oRootElement = this.oCustomShape.$()[0];

		var fOffset = getOffset(oRootElement);
		assert.equal(fOffset, "0.2", "initial offset is correct");

		this.oCustomShape.setStrokeWidth(0.1);
		oCore.applyChanges();
		oRootElement = this.oCustomShape.$()[0];

		fOffset = getOffset(oRootElement);
		assert.equal(fOffset, "0.2", "offset is still correct after rerendering");
		assert.equal(this.oCustomShape.getShapes()[0].$("shape-border").attr("stroke-width"), "0.1", "stroke width set correctly");
	});

});
