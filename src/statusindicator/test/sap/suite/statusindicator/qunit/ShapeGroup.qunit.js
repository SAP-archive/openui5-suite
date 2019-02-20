sap.ui.define([
	"sap/suite/statusindicator/ShapeGroup",
	"sap/suite/statusindicator/Shape",
	"sap/suite/statusindicator/Rectangle",
	"sap/ui/core/Core",
	"sap/ui/core/Configuration",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (ShapeGroup, Shape, Rectangle, Core, Configuration, sinon) {
	"use strict";

	var oSandbox = null;

	QUnit.module("Shape Group", {
		beforeEach: function () {
			oSandbox = sinon.sandbox.create();
		},
		afterEach: function () {
			oSandbox.verifyAndRestore();
		}
	});

	QUnit.test("Test default values", function (assert) {
		// Given
		var oGroup = new ShapeGroup();

		// Then
		assert.equal(oGroup.getWeight(), 10, "Default weight of group is 10.");
		assert.equal(oGroup.getShapes().length, 0, "Group contains no shapes by default.");
	});

	function prepareGroup(oShape1, oShape2) {
		return new ShapeGroup({
			weight: 15,
			shapes: [
				oShape1,
				oShape2
			]
		});
	}

	QUnit.test("Test presence of given shapes", function (assert) {
		// Given
		var oGroup = prepareGroup(new Rectangle(), new Rectangle());

		// Then
		assert.equal(oGroup.getWeight(), 15, "Weight of group is set to 15.");
		assert.equal(oGroup.getShapes().length, 2, "Group contains 2 shapes.");

		oGroup.destroy();
	});

	function _createProgressHandler(bCanceled) {
		return {
			isCanceled: sinon.stub().returns(bCanceled),
			stop: sinon.spy(),
			finish: sinon.spy()
		};
	}

	function _createShape(iDisplayedValue) {
		var oShape1 = new Shape();
		oShape1.getDisplayedValue = sinon.stub().returns(iDisplayedValue);
		oShape1._updateDom = sinon.spy();
		return oShape1;
	}

	QUnit.test("Test single animation step when animation is not yet finished", function (assert) {
		// Given
		var oShape1 = _createShape(10);
		var oShape2 = _createShape(10);

		var oGroup = new ShapeGroup({
			shapes: [oShape1, oShape2]
		});

		oGroup._iTargetValue = 60;
		var oRequestAnimationFrameStub = sinon.stub(window, "requestAnimationFrame");

		var oProgressHandler = _createProgressHandler(false);

		// When
		oGroup._animationStep(10000, oProgressHandler, 10062.5);

		// Then
		assert.ok(oShape1._updateDom.withArgs(35).calledOnce, "Shape 1 value set to 35.");
		assert.ok(oShape2._updateDom.withArgs(35).calledOnce, "Shape 2 value set to 35.");
		assert.ok(oProgressHandler.stop.notCalled, "Animation not stopped.");
		assert.ok(oProgressHandler.finish.notCalled, "Animation not finished.");

		oGroup.destroy();
		oRequestAnimationFrameStub.restore();
	});

	QUnit.test("Test single animation step when time is up for both shapes", function (assert) {
		// Given
		var oShape1 = _createShape(10);
		var oShape2 = _createShape(10);

		var oGroup = new ShapeGroup({
			shapes: [oShape1, oShape2]
		});

		oGroup._iTargetValue = 60;
		var oRequestAnimationFrameStub = sinon.stub(window, "requestAnimationFrame");

		var oProgressHandler = _createProgressHandler(false);

		// When
		oGroup._animationStep(10000, oProgressHandler, 13000);

		// Then
		assert.ok(oShape1._updateDom.withArgs(60).calledOnce, "Shape 1 value set to 60.");
		assert.ok(oShape2._updateDom.withArgs(60).calledOnce, "Shape 2 value set to 60.");
		assert.ok(oProgressHandler.stop.notCalled, "Animation not stopped.");
		assert.ok(oProgressHandler.finish.calledOnce, "Animation finished successfully.");

		oGroup.destroy();
		oRequestAnimationFrameStub.restore();
	});

	QUnit.test("Test single animation step stops when animation is canceled", function (assert) {
		// Given
		var oShape1 = _createShape(10, 5000);
		var oShape2 = _createShape(10, 2000);

		var oGroup = new ShapeGroup({
			shapes: [oShape1, oShape2]
		});

		oGroup._iTargetValue = 60;
		var oRequestAnimationFrameStub = sinon.stub(window, "requestAnimationFrame");

		var oProgressHandler = _createProgressHandler(true);

		// When
		oGroup._animationStep(10000, oProgressHandler, 13000);

		// Then
		assert.ok(oShape1._updateDom.notCalled, "Shape 1 value set to 60.");
		assert.ok(oShape2._updateDom.notCalled, "Shape 2 value set to 60.");
		assert.ok(oProgressHandler.stop.calledOnce, "Animation stopped.");
		assert.ok(oProgressHandler.finish.notCalled, "Animation not finished.");

		oGroup.destroy();
		oRequestAnimationFrameStub.restore();
	});

	QUnit.test("Test that _setValue function delegates correctly", function (assert) {
		// Given
		var oGroup = new ShapeGroup();
		sinon.stub(oGroup, "_animationStep");
		var oPerformanceNowStub = sinon.stub(performance, "now").returns(12345);
		// When
		oGroup._setValue(50);

		// Then
		assert.equal(oGroup._iTargetValue, 50, "Target group value set to 50.");
		assert.ok(oGroup._animationStep.calledOnce, "Animation step called.");
		assert.equal(oGroup._animationStep.firstCall.args.length, 3, "Animation step called with 4 parameters.");

		if (oGroup._animationStep.firstCall.args.length === 3) {
			var animationStepsParams = oGroup._animationStep.firstCall.args;
			assert.equal(animationStepsParams[0], 12345, "First parameter is current time.");
			assert.equal(animationStepsParams[2], 12345, "Third parameter is current time.");
		}

		oGroup.destroy();
		oPerformanceNowStub.restore();
	});

	QUnit.test("Test that ongoing animation is canceled when _setValue is called repeatedly", function (assert) {
		// Given
		var oGroup = new ShapeGroup();
		sinon.stub(oGroup, "_animationStep");
		var oPerformanceNowStub = sinon.stub(performance, "now");
		oPerformanceNowStub.onFirstCall().returns(12345);
		oPerformanceNowStub.onSecondCall().returns(12678);

		// When
		oGroup._setValue(50);
		var oFirstAnimationProgressHandler = oGroup.oCurrentProgressHandler;
		oGroup._setValue(60);

		// Then
		assert.equal(oGroup._iTargetValue, 60, "Target group value set to 60.");
		assert.ok(oGroup._animationStep.calledTwice, "Animation step called twice.");
		assert.equal(oGroup._animationStep.secondCall.args.length, 3, "Animation step called with 4 parameters.");

		if (oGroup._animationStep.secondCall.args.length === 3) {
			var animationStepsParams = oGroup._animationStep.secondCall.args;
			assert.equal(animationStepsParams[0], 12678, "First parameter is current time.");
			assert.equal(animationStepsParams[2], 12678, "Third parameter is current time.");
		}

		assert.ok(oFirstAnimationProgressHandler.isCanceled(), "First animation was canceled.");

		oGroup.destroy();
		oPerformanceNowStub.restore();
	});

	QUnit.test("Test _setValue call with disabled animations", function (assert) {
		var oShape1 = new Rectangle();
		var oShape2 = new Rectangle();

		var oGroup = new ShapeGroup({
			shapes: [oShape1, oShape2]
		});

		var oGetConfigurationStub = oSandbox.stub(Core, "getConfiguration");
		oGetConfigurationStub.returns({
			getAnimationMode: function () {
				return Configuration.AnimationMode.none;
			}
		});

		var iValue = 45;
		var oShape1Mock = oSandbox.mock(oShape1);
		oShape1Mock.expects("_updateDom").withArgs(iValue);

		var oShape2Mock = oSandbox.mock(oShape2);
		oShape2Mock.expects("_updateDom").withArgs(iValue);

		oGroup._setValue(iValue);
	});

	QUnit.test("Test _setValue call with enabled animations", function (assert) {
		var oShape1 = new Rectangle();
		var oShape2 = new Rectangle();

		var oGroup = new ShapeGroup({
			shapes: [oShape1, oShape2]
		});
		sinon.stub(oGroup, "getParent").returns({getSize: function(){return true;}});

		var oGetConfigurationStub = oSandbox.stub(Core, "getConfiguration");
		oGetConfigurationStub.returns({
			getAnimationMode: function () {
				return Configuration.AnimationMode.full;
			}
		});

		var iValue = 45;
		var oAnimationStepStub = oSandbox.stub(oGroup, "_animationStep");

		oGroup._setValue(iValue);
		assert.ok(oAnimationStepStub.called);
	});

});
