sap.ui.define([
	"sap/suite/statusindicator/util/ThemingUtil",
	"sap/ui/core/theming/Parameters",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (ThemingUtil, Parameters, sinon) {
	"use strict";

	QUnit.module("ThemingUtil");

	QUnit.test("Not instantiable", function (assert) {
		try {
			new ThemingUtil(); // eslint-disable-line no-new
			assert.fail("ThemingUtil should not be instantiable.");
		} catch (ex) {
			assert.ok("ThemingUtil is not instantiable.");
		}
	});

	QUnit.test("Test successful finish", function (assert) {
		var getCssParamStub = sinon.stub(Parameters, "get");
		getCssParamStub.withArgs("sapPositiveColor").returns("#111");
		getCssParamStub.withArgs("sapCriticalColor").returns("#222");
		getCssParamStub.withArgs("sapNeutralColor").returns("#333");
		getCssParamStub.withArgs("sapNegativeColor").returns("#444");
		getCssParamStub.withArgs("sapAccentColor2").returns("#555");

		assert.equal(ThemingUtil.resolveColor("red"), "red");
		assert.equal(ThemingUtil.resolveColor("#fff"), "#fff");
		assert.equal(ThemingUtil.resolveColor("Good"), "#111");
		assert.equal(ThemingUtil.resolveColor("Critical"), "#222");
		assert.equal(ThemingUtil.resolveColor("Neutral"), "#333");
		assert.equal(ThemingUtil.resolveColor("Error"), "#444");
		assert.equal(ThemingUtil.resolveColor("sapAccentColor2"), "#555");

		getCssParamStub.restore();
	});

});
