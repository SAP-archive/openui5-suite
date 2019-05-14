sap.ui.define([
	"sap/suite/statusindicator/library",
	"sap/suite/statusindicator/Shape",
	"sap/suite/statusindicator/util/AnimationPropertiesResolver",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (library, Shape, AnimationPropertiesResolver, sinon) {
	"use strict";

	// add svg element to document.body
	var svgElem = document.createElement("svg");
	svgElem.id = "svg-container";
	svgElem.version = "1.1";
	svgElem.xlmns =  "http://www.w3.org/2000/svg";
	document.body.appendChild(svgElem);

	var oCore = sap.ui.getCore();

	var FillingType = library.FillingType;

	var FillingDirectionType = library.FillingDirectionType;

	QUnit.module("Shape", {
		beforeEach: function () {
			this.sandbox = sinon.sandbox.create();
		},
		afterEach: function () {
			this.sandbox.verifyAndRestore();
			if (this.oShape) {
				this.oShape.destroy();
			}
		}
	});

	QUnit.test("Test default values", function (assert) {
		// Given
		var oShape = new Shape();

		// Then
		assert.equal(oShape.getFullAnimationDuration(), 250, "Default full animation duration of group is 250ms.");
		assert.equal(oShape.getFillColor(), "Neutral", "Default value of fillColor is blue");
	});

	QUnit.test("Test set initial and runtime values", function (assert) {
		// Given
		var oShape1 = new Shape({
			fullAnimationDuration: 1000,
			fillColor: "red"
		});

		var oShape2 = new Shape();

		// When
		oShape2.setFullAnimationDuration(2000);
		oShape2.setFillColor("green");

		// Then
		assert.equal(oShape1.getFullAnimationDuration(), 250, "Full animation duration of group is always 250ms");
		assert.equal(oShape2.getFullAnimationDuration(), 250, "Full animation duration of group is always 250ms");
		assert.equal(oShape1.getFillColor(), "red", "FillColor is correctly set to red");
		assert.equal(oShape2.getFillColor(), "green", "FillColor is correctly set to green");
	});

	QUnit.test("Test _getPolygonPoints for linear filling and angle in the first quadrant", function (assert) {
		var oShape = new Shape({
			fillingType: FillingType.Linear,
			fillingAngle: 10
		});

		this.sandbox.stub(oShape, "_getBoundingBox", function () {
			return {x: 1, y: 5, height: 150, width: 240};
		});

		var points1 = oShape._getPolygonPoints(0);
		var points2 = oShape._getPolygonPoints(40);
		var points3 = oShape._getPolygonPoints(100);

		assert.deepEqual(points1, [{x: 241.000, y: 155.000}, {x: 241.000, y: 155.000}, {x: 241.000, y: 155.000}]);
		assert.deepEqual(points2, [{x: 241.000, y: 155.000}, {x: 241.000, y: 78.073}, {x: -195.277, y: 155.000}]);
		assert.deepEqual(points3, [{x: 241.000, y: 155.000}, {x: 241.000, y: -37.318}, {x: -849.692, y: 155.000}]);
	});

	QUnit.test("Test _getPolygonPoints for linear filling and angle in the second quadrant", function (assert) {
		var oShape = new Shape({
			fillingType: FillingType.Linear,
			fillingAngle: 100
		});

		this.sandbox.stub(oShape, "_getBoundingBox", function () {
			return {x: 1, y: 5, height: 150, width: 240};
		});

		var points1 = oShape._getPolygonPoints(0);
		var points2 = oShape._getPolygonPoints(40);
		var points3 = oShape._getPolygonPoints(100);

		assert.deepEqual(points1, [{x: 241.000, y: 5.000}, {x: 241.000, y: 5.000}, {x: 241.000, y: 5.000}]);
		assert.deepEqual(points2, [{x: 241.000, y: 5.000}, {x: 241.000, y: 609.443}, {x: 134.420, y: 5.000}]);
		assert.deepEqual(points3, [{x: 241.000, y: 5.000}, {x: 241.000, y: 1516.108}, {x: -25.449, y: 5.000}]);
	});

	QUnit.test("Test _getPolygonPoints for linear filling and angle in the third quadrant", function (assert) {
		var oShape = new Shape({
			fillingType: FillingType.Linear,
			fillingAngle: 190
		});

		this.sandbox.stub(oShape, "_getBoundingBox", function () {
			return {x: 1, y: 5, height: 150, width: 240};
		});

		var points1 = oShape._getPolygonPoints(0);
		var points2 = oShape._getPolygonPoints(40);
		var points3 = oShape._getPolygonPoints(100);

		assert.deepEqual(points1, [{x: 1.000, y: 5.000}, {x: 1.000, y: 5.000}, {x: 1.000, y: 5.000}]);
		assert.deepEqual(points2, [{x: 1.000, y: 5.000}, {x: 1.000, y: 81.927}, {x: 437.277, y: 5.000}]);
		assert.deepEqual(points3, [{x: 1.000, y: 5.000}, {x: 1.000, y: 197.318}, {x: 1091.692, y: 5.000}]);
	});

	QUnit.test("Test _getPolygonPoints for linear filling and angle in the forth quadrant", function (assert) {
		var oShape = new Shape({
			fillingType: FillingType.Linear,
			fillingAngle: 280
		});

		this.sandbox.stub(oShape, "_getBoundingBox", function () {
			return {x: 1, y: 5, height: 150, width: 240};
		});

		var points1 = oShape._getPolygonPoints(0);
		var points2 = oShape._getPolygonPoints(40);
		var points3 = oShape._getPolygonPoints(100);

		assert.deepEqual(points1, [{x: 1.000, y: 155.000}, {x: 1.000, y: 155.000}, {x: 1.000, y: 155.000}]);
		assert.deepEqual(points2, [{x: 1.000, y: 155.000}, {x: 1.000, y: -449.443}, {x: 107.58, y: 155.000}]);
		assert.deepEqual(points3, [{x: 1.000, y: 155.000}, {x: 1.000, y: -1356.108}, {x: 267.449, y: 155.000}]);
	});

	QUnit.test("Test _getPolygonPoints for linear filling and negative angle", function (assert) {
		var oShape = new Shape({
			fillingType: FillingType.Linear,
			fillingAngle: -20
		});

		this.sandbox.stub(oShape, "_getBoundingBox", function () {
			return {x: 1, y: 5, height: 150, width: 240};
		});

		var points1 = oShape._getPolygonPoints(0);
		var points2 = oShape._getPolygonPoints(40);
		var points3 = oShape._getPolygonPoints(100);

		// should be same as 340 degrees (-20 + 360 = 340)
		assert.deepEqual(points1, [{x: 1.000, y: 155.000}, {x: 1.000, y: 155.000}, {x: 1.000, y: 155.000}]);
		assert.deepEqual(points2, [{x: 1.000, y: 155.000}, {x: 1.000, y: 60.059}, {x: 261.849, y: 155.000}]);
		assert.deepEqual(points3, [{x: 1.000, y: 155.000}, {x: 1.000, y: -82.353}, {x: 653.122, y: 155.000}]);
	});

	QUnit.test("Test _getPolygonPoints for linear filling and angle > 360", function (assert) {
		var oShape = new Shape({
			fillingType: FillingType.Linear,
			fillingAngle: 460 // it should be same as 100
		});

		this.sandbox.stub(oShape, "_getBoundingBox", function () {
			return {x: 1, y: 5, height: 150, width: 240};
		});

		var points1 = oShape._getPolygonPoints(0);
		var points2 = oShape._getPolygonPoints(40);
		var points3 = oShape._getPolygonPoints(100);

		assert.deepEqual(points1, [{x: 241.000, y: 5.000}, {x: 241.000, y: 5.000}, {x: 241.000, y: 5.000}]);
		assert.deepEqual(points2, [{x: 241.000, y: 5.000}, {x: 241.000, y: 609.443}, {x: 134.420, y: 5.000}]);
		assert.deepEqual(points3, [{x: 241.000, y: 5.000}, {x: 241.000, y: 1516.108}, {x: -25.449, y: 5.000}]);
	});

	QUnit.test("Test _getPolygonPoints for linear filling and angle < -360", function (assert) {
		var oShape = new Shape({
			fillingType: FillingType.Linear,
			fillingAngle: -620 // it should be same as 100
		});

		this.sandbox.stub(oShape, "_getBoundingBox", function () {
			return {x: 1, y: 5, height: 150, width: 240};
		});

		var points1 = oShape._getPolygonPoints(0);
		var points2 = oShape._getPolygonPoints(40);
		var points3 = oShape._getPolygonPoints(100);

		assert.deepEqual(points1, [{x: 241.000, y: 5.000}, {x: 241.000, y: 5.000}, {x: 241.000, y: 5.000}]);
		assert.deepEqual(points2, [{x: 241.000, y: 5.000}, {x: 241.000, y: 609.443}, {x: 134.420, y: 5.000}]);
		assert.deepEqual(points3, [{x: 241.000, y: 5.000}, {x: 241.000, y: 1516.108}, {x: -25.449, y: 5.000}]);
	});

	QUnit.test("Test _getPolygonPoints for circular filling", function (assert) {
		var oShape = new Shape({
			fillingType: FillingType.Circular
		});

		this.sandbox.stub(oShape, "_getBoundingBox", function () {
			return {x: 1, y: 5, height: 150, width: 240};
		});

		var points1 = oShape._getPolygonPoints(0);
		var points2 = oShape._getPolygonPoints(11); // ≈ 45 degrees
		var points3 = oShape._getPolygonPoints(20); // ≈ 75 degrees
		var points4 = oShape._getPolygonPoints(25); // = 90 degrees
		var points5 = oShape._getPolygonPoints(32); // ≈ 115 degrees
		var points6 = oShape._getPolygonPoints(41); // ≈ 150 degrees
		var points7 = oShape._getPolygonPoints(50); // = 180 degrees
		var points8 = oShape._getPolygonPoints(55.5); // ≈ 200 degrees
		var points9 = oShape._getPolygonPoints(67); // ≈ 240 degrees
		var points10 = oShape._getPolygonPoints(75); // = 270 degrees
		var points11 = oShape._getPolygonPoints(83); // ≈ 300 degrees
		var points12 = oShape._getPolygonPoints(95); // ≈ 345 degrees
		var points13 = oShape._getPolygonPoints(100); // ≈ 360 degrees

		assert.deepEqual(points1, [{x: 121, y: 5}, {x: 121, y: 80}]);
		assert.deepEqual(points2, [{x: 121, y: 5}, {x: 183.045, y: 5}, {x: 121, y: 80}]);
		assert.deepEqual(points3, [{x: 121, y: 5}, {x: 241, y: 5}, {x: 241, y: 41.01}, {x: 121, y: 80}]);
		assert.deepEqual(points4, [{x: 121, y: 5}, {x: 241, y: 5}, {x: 241, y: 80}, {x: 121, y: 80}]);
		assert.deepEqual(points5, [{x: 121, y: 5}, {x: 241, y: 5}, {x: 241, y: 136.468}, {x: 121, y: 80}]);
		assert.deepEqual(points6, [{x: 121, y: 5}, {x: 241, y: 5}, {x: 241, y: 155}, {x: 168.596, y: 155},
			{x: 121, y: 80}]);
		assert.deepEqual(points7, [{x: 121, y: 5}, {x: 241, y: 5}, {x: 241, y: 155},
			{x: 121, y: 155}, {x: 121, y: 80}]);
		assert.deepEqual(points8, [{x: 121, y: 5}, {x: 241, y: 5}, {x: 241, y: 155},
			{x: 93.998, y: 155}, {x: 121, y: 80}]);
		assert.deepEqual(points9, [{x: 121, y: 5}, {x: 241, y: 5}, {x: 241, y: 155},
			{x: 1, y: 155}, {x: 1, y: 145.971}, {x: 121, y: 80}]);
		assert.deepEqual(points10, [{x: 121, y: 5}, {x: 241, y: 5}, {x: 241, y: 155},
			{x: 1, y: 155}, {x: 1, y: 80}, {x: 121, y: 80}]);
		assert.deepEqual(points11, [{x: 121, y: 5}, {x: 241, y: 5}, {x: 241, y: 155},
			{x: 1, y: 155}, {x: 1, y: 14.029}, {x: 121, y: 80}]);
		assert.deepEqual(points12, [{x: 121, y: 5}, {x: 241, y: 5}, {x: 241, y: 155},
			{x: 1, y: 155}, {x: 1, y: 5}, {x: 96.631, y: 5}, {x: 121, y: 80}]);
		assert.deepEqual(points13, [{x: 121, y: 5}, {x: 241, y: 5}, {x: 241, y: 155},
			{x: 1, y: 155}, {x: 1, y: 5}, {x: 121, y: 5}, {x: 121, y: 80}]);
	});

	QUnit.test("Test _getPolygonPoints for circular filling and counter clockwise direction", function (assert) {
		var oShape = new Shape({
			fillingType: FillingType.Circular,
			fillingDirection: FillingDirectionType.CounterClockwise
		});

		this.sandbox.stub(oShape, "_getBoundingBox", function () {
			return {x: 1, y: 5, height: 150, width: 240};
		});

		var points1 = oShape._getPolygonPoints(0);
		var points2 = oShape._getPolygonPoints(11); // ≈ 45 degrees
		var points3 = oShape._getPolygonPoints(20); // ≈ 75 degrees
		var points4 = oShape._getPolygonPoints(25); // = 90 degrees
		var points5 = oShape._getPolygonPoints(32); // ≈ 115 degrees
		var points6 = oShape._getPolygonPoints(41); // ≈ 150 degrees
		var points7 = oShape._getPolygonPoints(50); // = 180 degrees
		var points8 = oShape._getPolygonPoints(55.5); // ≈ 200 degrees
		var points9 = oShape._getPolygonPoints(67); // ≈ 240 degrees
		var points10 = oShape._getPolygonPoints(75); // = 270 degrees
		var points11 = oShape._getPolygonPoints(83); // ≈ 300 degrees
		var points12 = oShape._getPolygonPoints(95); // ≈ 345 degrees
		var points13 = oShape._getPolygonPoints(100); // ≈ 360 degrees


		assert.deepEqual(points1, [{x: 121, y: 5}, {x: 121, y: 80}]);
		assert.deepEqual(points2, [{x: 121, y: 5}, {x: 58.955, y: 5}, {x: 121, y: 80}]);
		assert.deepEqual(points3, [{x: 121, y: 5}, {x: 1, y: 5}, {x: 1, y: 41.01}, {x: 121, y: 80}]);
		assert.deepEqual(points4, [{x: 121, y: 5}, {x: 1, y: 5}, {x: 1, y: 80}, {x: 121, y: 80}]);
		assert.deepEqual(points5, [{x: 121, y: 5}, {x: 1, y: 5}, {x: 1, y: 136.468}, {x: 121, y: 80}]);
		assert.deepEqual(points6, [{x: 121, y: 5}, {x: 1, y: 5}, {x: 1, y: 155}, {x: 73.404, y: 155},
			{x: 121, y: 80}]);
		assert.deepEqual(points7, [{x: 121, y: 5}, {x: 1, y: 5}, {x: 1, y: 155}, {x: 121, y: 155},
			{x: 121, y: 80}]);
		assert.deepEqual(points8, [{x: 121, y: 5}, {x: 1, y: 5}, {x: 1, y: 155},
			{x: 148.002, y: 155}, {x: 121, y: 80}]);
		assert.deepEqual(points9, [{x: 121, y: 5}, {x: 1, y: 5}, {x: 1, y: 155},
			{x: 241, y: 155}, {x: 241, y: 145.971}, {x: 121, y: 80}]);
		assert.deepEqual(points10, [{x: 121, y: 5}, {x: 1, y: 5}, {x: 1, y: 155},
			{x: 241, y: 155}, {x: 241, y: 80}, {x: 121, y: 80}]);
		assert.deepEqual(points11, [{x: 121, y: 5}, {x: 1, y: 5}, {x: 1, y: 155},
			{x: 241, y: 155}, {x: 241, y: 14.029}, {x: 121, y: 80}]);
		assert.deepEqual(points12, [{x: 121, y: 5}, {x: 1, y: 5}, {x: 1, y: 155},
			{x: 241, y: 155}, {x: 241, y: 5}, {x: 145.369, y: 5}, {x: 121, y: 80}]);
		assert.deepEqual(points13, [{x: 121, y: 5}, {x: 1, y: 5}, {x: 1, y: 155},
			{x: 241, y: 155}, {x: 241, y: 5}, {x: 121, y: 5}, {x: 121, y: 80}]);
	});

	QUnit.test("Test bounding box cache", function (assert) {
		var that = this;
		var oShape = new Shape({
			fillingType: FillingType.Linear,
			fillingAngle: -20
		});
		var oGetBBoxStub = that.sandbox.stub();
		oGetBBoxStub.returns({x: 10, y: 5, width: 45, height: 85});

		this.sandbox.stub(oShape, "$", function () {
			return [{
				getBBox: oGetBBoxStub
			}];
		});

		oShape._getBoundingBox();
		oShape._getBoundingBox();

		assert.ok(oGetBBoxStub.calledOnce, "Getting bouding box from DOM is cached and called only when needed.");
	});

	QUnit.test("Test invalidating cache", function (assert) {
		var that = this;
		var oShape = new Shape({
			fillingType: FillingType.Linear,
			fillingAngle: -20
		});
		var oGetBBoxStub = that.sandbox.stub();
		oGetBBoxStub.onFirstCall().returns({x: 10, y: 5, width: 45, height: 85});
		var oExpectedBBox = {x: 2, y: 10, width: 25, height: 50};
		oGetBBoxStub.onSecondCall().returns(oExpectedBBox);

		this.sandbox.stub(oShape, "$", function () {
			return [{
				getBBox: oGetBBoxStub
			}];
		});

		oShape._getBoundingBox();
		oShape._clearBoundingBox();
		var oBBox = oShape._getBoundingBox();

		assert.ok(oGetBBoxStub.calledTwice, "Getting bouding is called again after invalidating");
		assert.deepEqual(oBBox, oExpectedBBox, "Returned bounding box is the second one.");
	});

	QUnit.test("Test clearing cache before rendering", function (assert) {
		this.oShape = new Shape({
			fillingType: FillingType.Linear,
			fillingAngle: -20
		});

		var oClearBoundingBoxStub = this.sandbox.stub(this.oShape, "_clearBoundingBox");

		this.oShape.placeAt("svg-container");
		oCore.applyChanges();

		assert.ok(oClearBoundingBoxStub.calledOnce, "Bounding box is cleared before rendering");
	});

});
