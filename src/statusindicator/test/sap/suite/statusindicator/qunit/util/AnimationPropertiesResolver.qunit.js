sap.ui.define([
	"sap/suite/statusindicator/util/AnimationPropertiesResolver",
	"sap/suite/statusindicator/StatusIndicator",
	"sap/suite/statusindicator/ShapeGroup",
	"sap/suite/statusindicator/Rectangle",
	"sap/suite/statusindicator/PropertyThreshold",
	"sap/suite/statusindicator/DiscreteThreshold",
	"sap/ui/Device",
	"sap/suite/statusindicator/util/ThemingUtil",
	"sap/m/ValueColor",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (AnimationPropertiesResolver, StatusIndicator, ShapeGroup, Rectangle, PropertyThreshold,
             DiscreteThreshold, Device, ThemingUtil, ValueColor, sinon) {
	"use strict";

	var oSandbox = sinon.sandbox.create();

	function createStubRenderer() {
		return {
			_updateDom: oSandbox.stub(),
			_updateDomGradient: oSandbox.stub(),
			_updateDomColor: oSandbox.stub()
		};
	}

	QUnit.module("AnimationPropertiesResolver", {
		afterEach: function () {
			oSandbox.verifyAndRestore();
		}
	});

	QUnit.test("Get Value - two groups with same weight", function (assert) {
		var oRectangle1 = new Rectangle();
		var oRectangle2 = new Rectangle();
		var oRectangle3 = new Rectangle();

		var oGroup1 = new ShapeGroup({
			shapes: [oRectangle1, oRectangle2],
			weight: 1
		});
		var oGroup2 = new ShapeGroup({
			shapes: [oRectangle3],
			weight: 1
		});

		var oStatusIndicator = new StatusIndicator({
			groups: [oGroup1, oGroup2]
		});

		var oResolver = new AnimationPropertiesResolver(oStatusIndicator);

		var iResolvedValue = oResolver.getValue(oRectangle1, 50);
		assert.equal(iResolvedValue, 50);

		iResolvedValue = oResolver.getValue(oRectangle3, 50);
		assert.equal(iResolvedValue, 50);
	});

	QUnit.test("Get Value - two groups with different weight and discrete thresholds", function (assert) {
		var oRectangle1 = new Rectangle();
		var oRectangle2 = new Rectangle();
		var oRectangle3 = new Rectangle();

		var oGroup1 = new ShapeGroup({
			shapes: [oRectangle1, oRectangle2],
			weight: 3
		});
		var oGroup2 = new ShapeGroup({
			shapes: [oRectangle3],
			weight: 1
		});

		var oStatusIndicator = new StatusIndicator({
			groups: [oGroup1, oGroup2],
			discreteThresholds: [
				new DiscreteThreshold({
					value: 33
				}),
				new DiscreteThreshold({
					value: 80
				})
			]
		});

		var oResolver = new AnimationPropertiesResolver(oStatusIndicator);

		assert.equal(oResolver.getValue(oRectangle1, 43), 0);
		assert.equal(oResolver.getValue(oRectangle1, 44), 44);
		assert.equal(oResolver.getValue(oRectangle1, 50), 44);
		assert.equal(oResolver.getValue(oRectangle1, 100), 44);

		assert.equal(oResolver.getValue(oRectangle2, 43), 0);
		assert.equal(oResolver.getValue(oRectangle2, 44), 44);
		assert.equal(oResolver.getValue(oRectangle2, 50), 44);
		assert.equal(oResolver.getValue(oRectangle2, 100), 44);

		assert.equal(oResolver.getValue(oRectangle3, 19), 0);
		assert.equal(oResolver.getValue(oRectangle3, 20), 20);
		assert.equal(oResolver.getValue(oRectangle3, 40), 20);
		assert.equal(oResolver.getValue(oRectangle3, 100), 20);
	});

	QUnit.test("color specified by threshold", function (assert) {
		var oRectangle1 = new Rectangle({
			fillColor: 'black'
		});
		var oRectangle2 = new Rectangle({
			fillColor: 'black'
		});
		var oRectangle3 = new Rectangle({
			fillColor: 'black'
		});

		var oGroup1 = new ShapeGroup({
			shapes: [
				oRectangle1,
				oRectangle2
			],
			weight: 1
		});
		var oGroup2 = new ShapeGroup({
			shapes: [
				oRectangle3
			],
			weight: 1
		});

		var oStatusIndicator = new StatusIndicator({
			groups: [oGroup1, oGroup2],
			propertyThresholds: [
				new PropertyThreshold({
					fillColor: 'Error',
					toValue: 25
				}),
				new PropertyThreshold({
					fillColor: 'Critical',
					toValue: 50
				}),
				new PropertyThreshold({
					fillColor: 'Good',
					toValue: 75
				})]
		});

		var oResolver = new AnimationPropertiesResolver(oStatusIndicator),
			sErrorColor = ThemingUtil.resolveColor(ValueColor.Error),
			sCriticalColor = ThemingUtil.resolveColor(ValueColor.Critical),
			sGoodColor = ThemingUtil.resolveColor(ValueColor.Good);

		assert.equal(oResolver.getColor(oRectangle1, 20), sErrorColor);
		assert.equal(oResolver.getColor(oRectangle1, 49), sErrorColor);
		assert.equal(oResolver.getColor(oRectangle1, 50), sErrorColor);
		assert.equal(oResolver.getColor(oRectangle1, 51), sCriticalColor);
		assert.equal(oResolver.getColor(oRectangle1, 60), sCriticalColor);
		assert.equal(oResolver.getColor(oRectangle1, 99), sCriticalColor);
		assert.equal(oResolver.getColor(oRectangle1, 100), sCriticalColor);

		assert.equal(oResolver.getColor(oRectangle2, 20), sErrorColor);
		assert.equal(oResolver.getColor(oRectangle2, 49), sErrorColor);
		assert.equal(oResolver.getColor(oRectangle2, 50), sErrorColor);
		assert.equal(oResolver.getColor(oRectangle2, 51), sCriticalColor);
		assert.equal(oResolver.getColor(oRectangle2, 60), sCriticalColor);
		assert.equal(oResolver.getColor(oRectangle2, 99), sCriticalColor);
		assert.equal(oResolver.getColor(oRectangle2, 100), sCriticalColor);

		assert.equal(oResolver.getColor(oRectangle3, 1), sGoodColor);
		assert.equal(oResolver.getColor(oRectangle3, 10), sGoodColor);
		assert.equal(oResolver.getColor(oRectangle3, 49), sGoodColor);
		assert.equal(oResolver.getColor(oRectangle3, 50), sGoodColor);
		assert.equal(oResolver.getColor(oRectangle3, 51), "black");
		assert.equal(oResolver.getColor(oRectangle3, 80), "black");
		assert.equal(oResolver.getColor(oRectangle3, 100), "black");
	});

	QUnit.test("Test distribution with multiple groups and discrete thresholds", function (assert) {
		var oRectangle1 = new Rectangle();
		var oRectangle2 = new Rectangle();
		var oGroup1 = new ShapeGroup({
			shapes: [
				oRectangle1
			],
			weight: 3
		});
		var oGroup2 = new ShapeGroup({
			shapes: [
				oRectangle2
			],
			weight: 1
		});

		var oStatusIndicator = new StatusIndicator({
			groups: [oGroup1, oGroup2],
			discreteThresholds: [
				new DiscreteThreshold({
					value: 30
				}),
				new DiscreteThreshold({
					value: 54
				}),
				new DiscreteThreshold({
					value: 72
				}),
				new DiscreteThreshold({
					value: 84
				}),
				new DiscreteThreshold({
					value: 92
				}),
				new DiscreteThreshold({
					value: 96
				}),
				new DiscreteThreshold({
					value: 100
				})]
		});

		var oResolver = new AnimationPropertiesResolver(oStatusIndicator);

		assert.equal(oResolver.getValue(oRectangle1, 30), 0);
		assert.equal(oResolver.getValue(oRectangle1, 50), 40);
		assert.equal(oResolver.getValue(oRectangle1, 75), 72);
		assert.equal(oResolver.getValue(oRectangle1, 90), 72);
		assert.equal(oResolver.getValue(oRectangle1, 100), 96);

		assert.equal(oResolver.getValue(oRectangle2, 20), 0);
		assert.equal(oResolver.getValue(oRectangle2, 40), 36);
		assert.equal(oResolver.getValue(oRectangle2, 50), 36);
		assert.equal(oResolver.getValue(oRectangle2, 75), 68);
		assert.equal(oResolver.getValue(oRectangle2, 90), 84);
		assert.equal(oResolver.getValue(oRectangle2, 100), 100);
	});

	function createStatusIndicator(aGroups, aDiscreteThresholds, aPropertyThresholds) {
		var oStatusIndicator = new StatusIndicator({
			groups: aGroups,
			discreteThresholds: aDiscreteThresholds,
			propertyThresholds: aPropertyThresholds
		});

		aGroups.forEach(function (oGroup) {
			oGroup._injectAnimationPropertiesResolver(oStatusIndicator._oAnimationPropertiesResolver);
		});

		return oStatusIndicator;
	}

	function createGroup(aShapes) {
		var oGroup = new ShapeGroup({
			shapes: aShapes
		});
		return oGroup;
	}

	function createDiscreteThreshold(iValue) {
		var oThreshold = new DiscreteThreshold({
			value: iValue
		});
		return oThreshold;
	}

	function createPropertyThreshold(iValue, sColor) {
		var oThreshold = new PropertyThreshold({
			toValue: iValue,
			fillColor: sColor
		});
		return oThreshold;
	}

	function createRectangle() {
		var oShape = new Rectangle({
			fullAnimationDuration: 500
		});
		return oShape;
	}

	function setInitialValue(oStatusIndicator, iValue) {
		oStatusIndicator.setValue(iValue);
		var aGroupsWithValues = oStatusIndicator._computeGroupValueDistribution();
		aGroupsWithValues.forEach(function (oGroupWithValue) {
			oGroupWithValue.group._setInitialValue(oGroupWithValue.newValue);
		});
	}

	function isRising(aValues) {
		for (var i = 0; i < aValues.length - 1; i++) {
			if (aValues[i] > aValues[i + 1]) {
				return false;
			}
		}
		return true;
	}

	function isFalling(aValues) {
		return !isRising(aValues);
	}

	function checkColors(aActualColors, aExpectedColors) {
		var iExpectedColorsIndex = 0;
		if (aExpectedColors.length > aActualColors.length) {
			return false;
		}
		if (aActualColors.length === aExpectedColors.length) {
			return true;
		}

		for (var i = 0; i < aActualColors.length; i++) {
			if (aActualColors[i] === aExpectedColors[iExpectedColorsIndex]) {
				continue;
			}

			iExpectedColorsIndex++;
			if (aActualColors[i] !== aExpectedColors[iExpectedColorsIndex]) {
				return false;
			}
		}

		return iExpectedColorsIndex === aExpectedColors.length - 1;
	}

	function getValueFromUpdateDomGradientStub(oStub) {
		return oStub.args.map(function (aArguments) {
			return aArguments[1];
		});
	}

	function getColorsFromUpdateDomColorStub(oStub) {
		return oStub.args.map(function (aArguments) {
			return aArguments[1];
		});
	}

	function valueDistributionTest(oTestSuiteData) {
		QUnit.test("Test updates in advanced setup from " + oTestSuiteData.testing.fromValue +
			" to " + oTestSuiteData.testing.toValue, function (assert) {

			var oShape1 = createRectangle();
			var oShape2 = createRectangle();
			var oShape3 = createRectangle();
			var oShape4 = createRectangle();
			var oStatusIndicator = createStatusIndicator(
				[createGroup([oShape1, oShape2]), createGroup([oShape3, oShape4])],
				[createDiscreteThreshold(15), createDiscreteThreshold(30), createDiscreteThreshold(50), createDiscreteThreshold(80)],
				[]
			);

			var oShape1StubRenderer = createStubRenderer();
			oSandbox.stub(oShape1, "getRenderer", function () {
				return oShape1StubRenderer;
			});

			var oShape2StubRenderer = createStubRenderer();
			oSandbox.stub(oShape2, "getRenderer", function () {
				return oShape2StubRenderer;
			});

			var oShape3StubRenderer = createStubRenderer();
			oSandbox.stub(oShape3, "getRenderer", function () {
				return oShape3StubRenderer;
			});

			var oShape4StubRenderer = createStubRenderer();
			oSandbox.stub(oShape4, "getRenderer", function () {
				return oShape4StubRenderer;
			});

			var oUpdateDomGradient1Stub = oShape1StubRenderer._updateDomGradient;
			var oUpdateDomGradient2Stub = oShape2StubRenderer._updateDomGradient;
			var oUpdateDomGradient3Stub = oShape3StubRenderer._updateDomGradient;
			var oUpdateDomGradient4Stub = oShape4StubRenderer._updateDomGradient;

			setInitialValue(oStatusIndicator, oTestSuiteData.testing.fromValue);
			oStatusIndicator.setValue(oTestSuiteData.testing.toValue);
			return oStatusIndicator._propagateValueToGroups().then(function () {

				function checkParameters(oUpdateDomGradientStub, oExpectedValues) {
					var aUpdateDomGradientCallsValues = getValueFromUpdateDomGradientStub(oUpdateDomGradientStub);
					if (oExpectedValues.rising) {
						assert.equal(isRising(aUpdateDomGradientCallsValues), oExpectedValues.rising, "UpdateDomGradient arguments are rising");
					} else {
						assert.equal(isFalling(aUpdateDomGradientCallsValues), !oExpectedValues.rising, "UpdateDomGradient arguments are falling");
					}

					assert.equal(oUpdateDomGradientStub.called, oExpectedValues.called);
				}

				var aExpectedBehaviour = oTestSuiteData.expected.groups;
				checkParameters(oUpdateDomGradient1Stub, aExpectedBehaviour[0]);
				checkParameters(oUpdateDomGradient2Stub, aExpectedBehaviour[1]);
				checkParameters(oUpdateDomGradient3Stub, aExpectedBehaviour[2]);
				checkParameters(oUpdateDomGradient4Stub, aExpectedBehaviour[3]);
			});
		});
	}

	var oUpdateTestSuiteData1 = {
		testing: {
			fromValue: 20,
			toValue: 50
		},
		expected: {
			groups: [
				{
					called: true,
					rising: true,
					falling: false
				},
				{
					called: true,
					rising: true,
					falling: false
				},
				{
					called: false,
					rising: true,
					falling: true
				},
				{
					called: false,
					rising: true,
					falling: true
				}
			]
		}
	};
	var oUpdateTestSuiteData2 = {
		testing: {
			fromValue: 50,
			toValue: 100
		},
		expected: {
			groups: [
				{
					called: false,
					rising: true,
					falling: true
				},
				{
					called: false,
					rising: true,
					falling: true
				},
				{
					called: true,
					rising: true,
					falling: false
				},
				{
					called: true,
					rising: true,
					falling: false
				}
			]
		}
	};
	var oUpdateTestSuiteData3 = {
		testing: {
			fromValue: 100,
			toValue: 0
		},
		expected: {
			groups: [
				{
					called: true,
					rising: false,
					falling: true
				},
				{
					called: true,
					rising: false,
					falling: true
				},
				{
					called: true,
					rising: false,
					falling: true
				},
				{
					called: true,
					rising: false,
					falling: true
				}
			]
		}
	};
	valueDistributionTest(oUpdateTestSuiteData1);
	valueDistributionTest(oUpdateTestSuiteData2);
	valueDistributionTest(oUpdateTestSuiteData3);

	function colorDistributionTest(oTestSuiteData) {
		QUnit.test("Test color distribution in advanced setup from " + oTestSuiteData.testing.fromValue +
			" to " + oTestSuiteData.testing.toValue, function (assert) {
			oSandbox.stub(window, "requestAnimationFrame", function (callback) {
				setTimeout(function () {
					var iLastUpdate = performance.now();
					callback(iLastUpdate);
				}, 1);
			});

			var oShape1 = createRectangle();
			var oShape2 = createRectangle();
			var oShape3 = createRectangle();
			var oShape4 = createRectangle();
			var oStatusIndicator = createStatusIndicator(
				[createGroup([oShape1, oShape2]), createGroup([oShape3, oShape4])],
				[],
				[
					createPropertyThreshold(15, "red"), createPropertyThreshold(30, "orange"),
					createPropertyThreshold(50, "blue"), createPropertyThreshold(80, "green"), createPropertyThreshold(100, "gold")
				]
			);

			var oShape1StubRenderer = createStubRenderer();
			oSandbox.stub(oShape1, "getRenderer", function () {
				return oShape1StubRenderer;
			});

			var oShape2StubRenderer = createStubRenderer();
			oSandbox.stub(oShape2, "getRenderer", function () {
				return oShape2StubRenderer;
			});

			var oShape3StubRenderer = createStubRenderer();
			oSandbox.stub(oShape3, "getRenderer", function () {
				return oShape3StubRenderer;
			});

			var oShape4StubRenderer = createStubRenderer();
			oSandbox.stub(oShape4, "getRenderer", function () {
				return oShape4StubRenderer;
			});

			var oUpdateDomColor1Stub = oShape1StubRenderer._updateDomColor;
			var oUpdateDomColor2Stub = oShape2StubRenderer._updateDomColor;
			var oUpdateDomColor3Stub = oShape3StubRenderer._updateDomColor;
			var oUpdateDomColor4Stub = oShape4StubRenderer._updateDomColor;

			setInitialValue(oStatusIndicator, oTestSuiteData.testing.fromValue);
			oStatusIndicator.setValue(oTestSuiteData.testing.toValue);
			return oStatusIndicator._propagateValueToGroups().then(function () {

				var aStub1Arguments = getColorsFromUpdateDomColorStub(oUpdateDomColor1Stub);
				var aStub2Arguments = getColorsFromUpdateDomColorStub(oUpdateDomColor2Stub);
				var aStub3Arguments = getColorsFromUpdateDomColorStub(oUpdateDomColor3Stub);
				var aStub4Arguments = getColorsFromUpdateDomColorStub(oUpdateDomColor4Stub);
				var aExpectedBehaviour = oTestSuiteData.expected.groups;

				function checkParameters(oStubArguments, oUpdateDomColorStubs, oExpected) {
					assert.equal(oUpdateDomColorStubs.called, oExpected.called,
						"Shape's updateDomColor should be called");
					assert.ok(checkColors(oStubArguments, oExpected.colors),
						"Shape's updateDomColor was called with correct colors");
				}

				checkParameters(aStub1Arguments, oUpdateDomColor1Stub, aExpectedBehaviour[0]);
				checkParameters(aStub2Arguments, oUpdateDomColor2Stub, aExpectedBehaviour[1]);
				checkParameters(aStub3Arguments, oUpdateDomColor3Stub, aExpectedBehaviour[2]);
				checkParameters(aStub4Arguments, oUpdateDomColor4Stub, aExpectedBehaviour[3]);
			});
		});
	}

	var oColorTestSuiteData1 = {
		testing: {
			fromValue: 16,
			toValue: 50
		},
		expected: {
			groups: [
				{
					colors: ["orange", "blue"],
					called: true
				},
				{
					colors: ["orange", "blue"],
					called: true
				},
				{
					colors: [],
					called: false
				},
				{
					colors: [],
					called: false
				}
			]
		}
	};
	var oColorTestSuiteData2 = {
		testing: {
			fromValue: 31,
			toValue: 100
		},
		expected: {
			groups: [
				{
					colors: ["blue", "green", "gold"],
					called: true
				},
				{
					colors: ["blue", "green", "gold"],
					called: true
				},
				{
					colors: ["blue", "green", "gold"],
					called: true
				},
				{
					colors: ["blue", "green", "gold"],
					called: true
				}
			]
		}
	};
	var oColorTestSuiteData3 = {
		testing: {
			fromValue: 100,
			toValue: 0
		},
		expected: {
			groups: [
				{
					colors: ["green", "blue", "orange", "red"],
					called: true
				},
				{
					colors: ["green", "blue", "orange", "red"],
					called: true
				},
				{
					colors: ["gold", "green", "blue"],
					called: true
				},
				{
					colors: ["gold", "green", "blue"],
					called: true
				}
			]
		}
	};

	// these tests are somehow failing in PhantomJS under weird circumstances. It is not replicable as it is running
	// smoothly on local PhantomJS instance with same version. I did not observe any problems in other browsers (firefox/chrome).
	if (!Device.browser.phantomJS) {
		colorDistributionTest(oColorTestSuiteData1);
		colorDistributionTest(oColorTestSuiteData2);
		colorDistributionTest(oColorTestSuiteData3);
	}

	QUnit.test("Test of propagateColorChange", function (assert) {
		var oShape1 = createRectangle();
		var oShape2 = createRectangle();
		var oGroup1 = createGroup([oShape1]);
		var oGroup2 = createGroup([oShape2]);
		var oStatusIndicator = createStatusIndicator(
			[oGroup1,oGroup2],
			[],
			[
				createPropertyThreshold(15, "red"), createPropertyThreshold(30, "orange"),
				createPropertyThreshold(50, "blue"), createPropertyThreshold(80, "green"), createPropertyThreshold(100, "gold")
			]
		);

		var oAnimationPropertiesResolver = oStatusIndicator._oAnimationPropertiesResolver;
		var oStub1 = oSandbox.stub();
		var oStub2 = oSandbox.stub();
		oAnimationPropertiesResolver.addPropertyThresholdChange(oStub1);
		oAnimationPropertiesResolver.addPropertyThresholdChange(oStub2);

		oAnimationPropertiesResolver.propagateColorChange(oShape1, 100);

		assert.equal(oStub1.args.toString(), oStub2.args.toString(), "Both event was called with same arguments");
		assert.ok(oStub1.withArgs("blue").calledOnce, "Stub1 was called with correct color");
		assert.ok(oStub2.withArgs("blue").calledOnce, "Stub2 was called with correct color");

		oAnimationPropertiesResolver.propagateColorChange(oShape2, 100);

		assert.equal(oStub1.args.toString(), oStub2.args.toString(), "Both event was called with same arguments");
		assert.ok(oStub1.withArgs("gold").calledOnce, "Stub1 was called with correct color");
		assert.ok(oStub1.withArgs("gold").calledOnce, "Stub2 was called with correct color");
	});

	QUnit.test("Test of propertyThresholdEvent calling", function (assert) {
		var oShape1 = createRectangle();
		var oShape2 = createRectangle();
		var oGroup1 = createGroup([oShape1]);
		var oGroup2 = createGroup([oShape2]);
		var oStatusIndicator = createStatusIndicator(
			[oGroup1,oGroup2],
			[],
			[
				createPropertyThreshold(15, "red"), createPropertyThreshold(30, "orange"),
				createPropertyThreshold(50, "blue"), createPropertyThreshold(80, "green"), createPropertyThreshold(100, "gold")
			]
		);

		var oAnimationPropertiesResolver = oStatusIndicator._oAnimationPropertiesResolver;
		var oStub1 = oSandbox.stub();
		var oStub2 = oSandbox.stub();
		oAnimationPropertiesResolver.addPropertyThresholdChange(oStub1);
		oAnimationPropertiesResolver.addPropertyThresholdChange(oStub2);

		setInitialValue(oStatusIndicator, 51);

		oAnimationPropertiesResolver.propagateColorChange(oShape2, 60);

		assert.ok(oStub1.notCalled, "Stub1 was not called");
		assert.ok(oStub2.notCalled, "Stub2 was not called");

		oAnimationPropertiesResolver.propagateColorChange(oShape2, 62);

		assert.ok(oStub1.called, "Stub1 was called");
		assert.ok(oStub2.called, "Stub2 was called");
	});

	QUnit.test("Test of propagateValueChange", function (assert) {
		var oShape1 = createRectangle();
		var oShape2 = createRectangle();
		var oGroup1 = createGroup([oShape1]);
		var oGroup2 = createGroup([oShape2]);
		var oStatusIndicator = createStatusIndicator(
			[oGroup1,oGroup2],
			[createDiscreteThreshold(15), createDiscreteThreshold(30), createDiscreteThreshold(50), createDiscreteThreshold(80)],
			[]
		);

		var oAnimationPropertiesResolver = oStatusIndicator._oAnimationPropertiesResolver;
		var oStub1 = oSandbox.stub();
		var oStub2 = oSandbox.stub();
		oAnimationPropertiesResolver.addDiscreteThresholdChange(oStub1);
		oAnimationPropertiesResolver.addDiscreteThresholdChange(oStub2);

		oAnimationPropertiesResolver.propagateValueChange(oShape2, 80);

		assert.equal(oStub1.args.toString(), oStub2.args.toString(), "Both event was called with same arguments");
		assert.ok(oStub1.withArgs(80).calledOnce, "Stub1 was called with correct value");
		assert.ok(oStub2.withArgs(80).calledOnce, "Stub2 was called with correct value");
	});

	QUnit.test("Test of discreteThresholdEvent calling", function (assert) {
		var oShape1 = createRectangle();
		var oShape2 = createRectangle();
		var oGroup1 = createGroup([oShape1]);
		var oGroup2 = createGroup([oShape2]);
		var oStatusIndicator = createStatusIndicator(
			[oGroup1,oGroup2],
			[createDiscreteThreshold(15), createDiscreteThreshold(30), createDiscreteThreshold(50), createDiscreteThreshold(80)],
			[]
		);

		var oAnimationPropertiesResolver = oStatusIndicator._oAnimationPropertiesResolver;
		var oStub1 = oSandbox.stub();
		var oStub2 = oSandbox.stub();
		oAnimationPropertiesResolver.addDiscreteThresholdChange(oStub1);
		oAnimationPropertiesResolver.addDiscreteThresholdChange(oStub2);

		setInitialValue(oStatusIndicator, 51);

		oAnimationPropertiesResolver.propagateValueChange(oShape2, 59);

		assert.ok(oStub1.notCalled, "Stub1 was not called");
		assert.ok(oStub2.notCalled, "Stub2 was not called");

		oAnimationPropertiesResolver.propagateValueChange(oShape2, 60);

		assert.ok(oStub1.called, "Stub1 was called");
		assert.ok(oStub2.called, "Stub2 was called");
	});
});
