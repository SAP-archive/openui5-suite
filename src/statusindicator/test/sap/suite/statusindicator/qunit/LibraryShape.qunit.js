sap.ui.define([
	"sap/suite/statusindicator/LibraryShape",
	"sap/suite/statusindicator/shapes/ShapeFactory"
], function (LibraryShape, ShapeFactory) {
	"use strict";

	var sCarSvg = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 43 25\">" +
			"<path d=\"M42.3,14.2l0-0.2c0-0.6-0.3-1.2-0.9-1.5L32.8,9c-0.2-0.1-0.4-0.3-0.5-0.3L21.8,0.9c-0.3-0.2-0.7-0.4-1.2-0.4" +
			"H5.9c-0.8,0-1.5,0.6-1.5,1.4l-2,7C2,9.2,0.7,10.2,0.7,11.2v6.9c0,1,0.7,1.9,1.7,2.3l2.1,0c0,0,0,0.1,0,0.1c0.2,2.1,2,3.8,4.1,3.8" +
			"c2.2,0,3.9-1.7,4.1-3.8c0,0,0-0.1,0-0.1l15.7,0.1c0.2,2.1,2,3.8,4.1,3.8c2.2,0,3.9-1.7,4.1-3.8l0.8,0h1.8c1.6,0,2.9-1.1,2.9-2.6" +
			"l0-1.1c-0.8-0.4-1.3-0.9-1.3-1.5C41,15,41.5,14.5,42.3,14.2z\"/>" +
			"</svg>",
		sWarehouseSvg = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 28 25\">" +
			"<path d=\"M27.2,11.6l-13-11.1c-0.1-0.1-0.2-0.1-0.3,0L0.8,11.6c-0.1,0.1-0.1,0.2-0.1,0.3S0.9,12,0.9,12l3,0l0,12.2" +
			"c0,0.1,0,0.1,0.1,0.2c0,0,0.1,0.1,0.2,0.1h3.1h0.9h11.5h0.6h3.4c0.1,0,0.1,0,0.2-0.1c0,0,0.1-0.1,0.1-0.2L24,12l3.1,0" +
			"c0.1,0,0.2-0.1,0.2-0.2C27.3,11.8,27.3,11.7,27.2,11.6z M8.4,14.7h11.3c0.1,0,0.1,0.1,0.1,0.1v1.8H8.3v-1.8" +
			"C8.3,14.8,8.3,14.7,8.4,14.7z M19.8,18.1v1.8H8.3v-1.8H19.8z M8.3,23.1v-1.8h11.5v1.8H8.3z\"/>" +
			"</svg>";

	QUnit.module("LibraryShape", {
		afterEach: function () {
			new ShapeFactory()._removeAllLoadedShapes();
			if (this.oLibraryShape) {
				this.oLibraryShape.destroy();
			}
		}
	});

	QUnit.test("Loading and setting SVG", function (assert) {
		var fnDone = assert.async();

		this.oLibraryShape = new LibraryShape({
			afterShapeLoaded: function () {
				assert.equal(this.oLibraryShape.getDefinition().replace(/\s/g,''), sCarSvg.replace(/\s/g,''), "Set correct definition");
				fnDone();
			}.bind(this)
		});

		assert.expect(4);
		assert.equal(this.oLibraryShape.getDefinition(), "");
		assert.equal(this.oLibraryShape._getValidShapeId("../te\\st/string.test/str\\.ing"), "teststringteststring", "Test validation: dots and slashes are not allowed");

		this.oLibraryShape.setShapeId("car");
		assert.equal(this.oLibraryShape.getShapeId(), "car");
	});

	QUnit.test("Test loading and saving shapes by ShapeFactory", function (assert) {
		var oShapeFactory = new ShapeFactory(),
			fnDone1 = assert.async(),
			fnDone2 = assert.async(),
			fnDone3 = assert.async();

		assert.expect(4);

		// Set loaded shape
		oShapeFactory._getLoadedShapes().warehouse = sWarehouseSvg;
		oShapeFactory.getShapeById("warehouse");
		assert.equal(Object.keys(new ShapeFactory()._getLoadedShapes()).length, 1, "Use loaded shape");

		// Set not loaded shapes
		oShapeFactory.getShapeById("car").then(function (sData) {
			assert.equal(sData.replace(/\s/g,''), sCarSvg.replace(/\s/g,''), "Get correct shape");
			fnDone1();

			return oShapeFactory.getShapeById("bull");
		}).then(function () {
			assert.ok(Object.keys(new ShapeFactory()._getLoadedShapes()).length === 3, "3 shapes are loaded");
			fnDone2();

			return oShapeFactory.getShapeById("wrongShapeId123456789");
		}).then(function () {
			assert.ok(false, "Shape ID 'wrongShapeId123456789' is correct");
			fnDone3();
		}, function (oError) {
			assert.ok(oError, "Set wrong shape ID");
			fnDone3();
		});

	});

});
