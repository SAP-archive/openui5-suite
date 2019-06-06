sap.ui.define([
	"sap/ui/core/Core",
	"sap/suite/statusindicator/library",
	"sap/suite/statusindicator/StatusIndicator",
	"sap/suite/statusindicator/ShapeGroup",
	"sap/suite/statusindicator/Rectangle",
	"sap/suite/statusindicator/Circle",
	"sap/suite/statusindicator/CustomShape",
	"sap/suite/statusindicator/FillingType",
	"sap/suite/statusindicator/util/AnimationPropertiesResolver",
	"sap/suite/statusindicator/PropertyThreshold",
	"sap/suite/statusindicator/DiscreteThreshold",
	"./Utils",
	"sap/suite/statusindicator/util/ThemingUtil",
	"sap/m/library",
	"sap/base/Log",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (Core, library, StatusIndicator, ShapeGroup, Rectangle, Circle, CustomShape, FillingType, AnimationPropertiesResolver,
						 PropertyThreshold, DiscreteThreshold, Utils, ThemingUtil, mLibrary, Log, createAndAppendDiv, sinon) {
	"use strict";

	createAndAppendDiv("content");

	var oSandbox;
	var SizeType = library.SizeType;
	var LabelPositionType = library.LabelPositionType;
	var ValueColor = mLibrary.ValueColor;
	var oCore = sap.ui.getCore();

	function render(statusIndicator) {
		statusIndicator.placeAt("content");
		oCore.applyChanges();
	}

	function isRisingReducer(acc, iValue) {
		if (!acc.result) {
			return acc;
		}

		if (acc.value && acc.value >= iValue) {
			acc.result = false;
		} else {
			acc.value = iValue;
		}

		return acc;
	}

	QUnit.module("Basic Tests", {
		beforeEach: function () {
			this.statusIndicator = new StatusIndicator();
			oSandbox = sinon.sandbox.create();
		},
		afterEach: function () {
			this.statusIndicator.destroy();
			oSandbox.verifyAndRestore();
		}
	});

	QUnit.test("StatusIndicator is rendered", function (assert) {
		// setup

		render(this.statusIndicator);

		var $rootNode = this.statusIndicator.$();

		assert.ok($rootNode.is("div"), "It is a div.");

		var $svgWrapperNode = $rootNode.children().first();
		assert.ok($svgWrapperNode.is("div"), "It is a div.");

		var $svgNode = $svgWrapperNode.children("svg");
		assert.ok($svgNode.is("svg"), "It is a svg.");
		assert.notOk($svgNode.attr("viewBox"));
	});

	QUnit.test("Test custom viewBox", function (assert) {
		var sViewBox = "1 5 20 4";
		this.statusIndicator.setViewBox(sViewBox);
		render(this.statusIndicator);

		assert.equal(this.statusIndicator.$("svg")[0].getAttribute("viewBox"), sViewBox);
	});

	QUnit.test("StatusIndicator has given groups", function (assert) {

		// When
		this.statusIndicator.addGroup(new ShapeGroup({
			weight: 20
		}));
		this.statusIndicator.addGroup(new ShapeGroup({
			weight: 10
		}));
		this.statusIndicator.addGroup(new ShapeGroup({
			weight: 20
		}));

		// Then
		assert.equal(this.statusIndicator.getGroups().length, 3, "Status indicator has 3 groups.");

	});


	function addGroupWithWeight(oStatusIndicator, iWeight, bShowsFullProgress) {
		var oGroup = new ShapeGroup({
			weight: iWeight
		});

		var oSetValuePromise = Promise.resolve();
		sinon.spy(oSetValuePromise, "then");
		sinon.stub(oGroup, "_setValue").returns(oSetValuePromise);
		sinon.stub(oGroup, "_showsFullProgress").returns(bShowsFullProgress);

		oStatusIndicator.addGroup(oGroup);

		return {
			group: oGroup,
			setValuePromise: oSetValuePromise
		};
	}


	QUnit.test("StatusIndicator value is set correctly", function (assert) {

		// When
		this.statusIndicator.setValue(65);

		// Then
		assert.equal(this.statusIndicator.getValue(), 65, "Status indicator value is set to 65.");

	});

	QUnit.test("StatusIndicator value is propagated to groups on after control rendering", function (assert) {
		// Given
		this.statusIndicator._propagateValueToGroups = sinon.spy();

		// When
		this.statusIndicator._start();

		// Then
		assert.ok(this.statusIndicator._propagateValueToGroups.calledOnce, "Value propagation is called when the status indicator is stated.");
	});

	QUnit.test("StatusIndicator value is propagated to groups on value change", function (assert) {
		// Given
		this.statusIndicator._propagateValueToGroups = sinon.spy();
		this.statusIndicator._start();
		this.statusIndicator._propagateValueToGroups.reset();

		// When
		this.statusIndicator.setValue(65);

		// Then
		assert.ok(this.statusIndicator._propagateValueToGroups.calledOnce, "Value propagation is called when value of started status indicator is changed.");
	});


	QUnit.test("StatusIndicator divides value between its groups (change from 0 to 50)", function (assert) {

		// Given
		var oGroupInfo1 = addGroupWithWeight(this.statusIndicator, 20, false);
		var oGroupInfo2 = addGroupWithWeight(this.statusIndicator, 10, false);
		var oGroupInfo3 = addGroupWithWeight(this.statusIndicator, 20, false);

		// When
		this.statusIndicator.setValue(50);
		var oResultPromise = this.statusIndicator._propagateValueToGroups();

		// Then
		return oResultPromise.then(function () {
			assert.ok(oGroupInfo1.group._setValue.withArgs(100).calledOnce, "First group value set to 100.");
			assert.ok(oGroupInfo2.group._setValue.withArgs(50).calledOnce, "Second group value set to 50.");
			assert.ok(oGroupInfo3.group._setValue.withArgs(0).calledOnce, "Third group value set to 0.");

			assert.ok(oGroupInfo1.group._setValue.calledBefore(oGroupInfo2.group._setValue), "Second promise was chained after the first one.");
			assert.ok(oGroupInfo2.group._setValue.calledBefore(oGroupInfo3.group._setValue), "Third promise was chained after the second one.");
		});
	});

	QUnit.test("StatusIndicator divides value between many groups (change from 0 to 100)", function (assert) {
		// Given
		var that = this,
			iGroupsCount = 6;

		for (var i = 0; i < iGroupsCount; i++) {
			addGroupWithWeight(this.statusIndicator, 10, false);
		}

		// When
		this.statusIndicator.setValue(100);
		var oResultPromise = this.statusIndicator._propagateValueToGroups();

		// Then
		return oResultPromise.then(function () {
			for (var j = 0; j < iGroupsCount; j++) {
				assert.equal(that.statusIndicator.getGroups()[j]._setValue.getCall(0).args[0], 100, "Group " + j + " was set to 100.");
			}
		});
	});

	QUnit.test("Test setting the S size of status indicator", function (assert) {
		// Given
		this.statusIndicator.setSize(SizeType.Small);

		// When
		render(this.statusIndicator);

		var oRootNode = this.statusIndicator.$().children()[0];

		// Then
		var sClassName = "sapSuiteStatusIndicatorSmallSvg";
		assert.ok(oRootNode.classList.contains(sClassName), "Root node has the CSS class that corresponds to size property");
	});

	QUnit.test("Test setting the M size of status indicator", function (assert) {
		// Given
		this.statusIndicator.setSize(SizeType.Medium);

		// When
		render(this.statusIndicator);

		var oRootNode = this.statusIndicator.$().children()[0];

		// Then
		var sClassName = "sapSuiteStatusIndicatorMediumSvg";
		assert.ok(oRootNode.classList.contains(sClassName), "Root node has the CSS class that corresponds to size property");

	});

	QUnit.test("Test setting the L size of status indicator", function (assert) {
		// Given
		this.statusIndicator.setSize(SizeType.Large);

		// When
		render(this.statusIndicator);

		var oRootNode = this.statusIndicator.$().children()[0];

		// Then
		var sClassName = "sapSuiteStatusIndicatorLargeSvg";
		assert.ok(oRootNode.classList.contains(sClassName), "Root node has the CSS class that corresponds to size property");
	});

	QUnit.test("Test setting the XL size of status indicator", function (assert) {
		// Given
		this.statusIndicator.setSize(SizeType.ExtraLarge);

		// When
		render(this.statusIndicator);

		var oRootNode = this.statusIndicator.$().children()[0];

		// Then
		var sClassName = "sapSuiteStatusIndicatorExtraLargeSvg";
		assert.ok(oRootNode.classList.contains(sClassName), "Root node has the CSS class that corresponds to size property");
	});

	QUnit.test("Test the S size of label", function (assert) {
		this.statusIndicator.setSize(SizeType.Small);
		this.statusIndicator.setShowLabel(true);

		render(this.statusIndicator);

		var oRootNode = this.statusIndicator.$().children().first();
		var oLabelNode = oRootNode.children()[0];

		var sClassName = "sapSuiteStatusIndicatorSmallLeftLabel";
		assert.ok(oLabelNode.classList.contains(sClassName), "Root node has the CSS class that corresponds to size property");
	});

	QUnit.test("Test the M size of label", function (assert) {
		this.statusIndicator.setSize(SizeType.Medium);
		this.statusIndicator.setShowLabel(true);

		render(this.statusIndicator);

		var oRootNode = this.statusIndicator.$().children().first();
		var oLabelNode = oRootNode.children()[0];

		var sClassName = "sapSuiteStatusIndicatorMediumLeftLabel";
		assert.ok(oLabelNode.classList.contains(sClassName), "Root node has the CSS class that corresponds to size property");
	});

	QUnit.test("Test the L size of label", function (assert) {
		this.statusIndicator.setSize(SizeType.Large);
		this.statusIndicator.setShowLabel(true);

		render(this.statusIndicator);

		var oRootNode = this.statusIndicator.$().children().first();
		var oLabelNode = oRootNode.children()[0];

		var sClassName = "sapSuiteStatusIndicatorLargeLeftLabel";
		assert.ok(oLabelNode.classList.contains(sClassName), "Root node has the CSS class that corresponds to size property");
	});

	QUnit.test("Test the XL size of label", function (assert) {
		this.statusIndicator.setSize(SizeType.ExtraLarge);
		this.statusIndicator.setShowLabel(true);

		render(this.statusIndicator);

		var oRootNode = this.statusIndicator.$().children().first();
		var oLabelNode = oRootNode.children()[0];

		var sClassName = "sapSuiteStatusIndicatorExtraLargeLeftLabel";
		assert.ok(oLabelNode.classList.contains(sClassName), "Root node has the CSS class that corresponds to size property");
	});

	QUnit.test("Test the existence of label", function (assert) {
		this.statusIndicator.setShowLabel(true);
		this.statusIndicator.setValue(25);

		render(this.statusIndicator);

		var oRootNode = this.statusIndicator.$().first();
		assert.equal(2, oRootNode.children().length, "SVG and label are rendered");

		var oLabelNode = oRootNode.children().first();
		assert.ok(oLabelNode.find(":contains(25%)").length === 1, "Label contains passed value");
	});

	QUnit.test("Test label on the left side", function (assert) {
		this.statusIndicator.setShowLabel(true);
		this.statusIndicator.setValue(25);

		render(this.statusIndicator);

		var oRootNode = this.statusIndicator.$().first();
		var oLabelNode = oRootNode.children().first();

		assert.ok(oRootNode.hasClass("sapSuiteStatusIndicator"));
		assert.ok(oRootNode.hasClass("sapSuiteStatusIndicatorHorizontal"));
		assert.ok(oLabelNode.hasClass("sapSuiteStatusIndicatorLabelBeforeSvg"));
	});

	QUnit.test("Test label on the right side", function (assert) {
		this.statusIndicator.setShowLabel(true);
		this.statusIndicator.setValue(25);
		this.statusIndicator.setLabelPosition(LabelPositionType.Right);

		render(this.statusIndicator);

		var oRootNode = this.statusIndicator.$().first();
		var oLabelNode = oRootNode.children().first();

		assert.ok(oRootNode.hasClass("sapSuiteStatusIndicator"));
		assert.ok(oRootNode.hasClass("sapSuiteStatusIndicatorHorizontal"));
		assert.ok(oLabelNode.hasClass("sapSuiteStatusIndicatorLabelAfterSvg"));
	});

	QUnit.test("Test label on the top side", function (assert) {
		this.statusIndicator.setShowLabel(true);
		this.statusIndicator.setValue(25);
		this.statusIndicator.setLabelPosition(LabelPositionType.Top);

		render(this.statusIndicator);

		var oRootNode = this.statusIndicator.$().first();
		var oLabelNode = oRootNode.children().first();

		assert.ok(oRootNode.hasClass("sapSuiteStatusIndicator"));
		assert.ok(oRootNode.hasClass("sapSuiteStatusIndicatorVertical"));
		assert.ok(oLabelNode.hasClass("sapSuiteStatusIndicatorLabelBeforeSvg"));
	});

	QUnit.test("Test label on the bottom side", function (assert) {
		this.statusIndicator.setShowLabel(true);
		this.statusIndicator.setValue(25);
		this.statusIndicator.setLabelPosition(LabelPositionType.Bottom);

		render(this.statusIndicator);

		var oRootNode = this.statusIndicator.$().first();

		var oLabelNode = oRootNode.children().first();

		assert.ok(oRootNode.hasClass("sapSuiteStatusIndicator"));
		assert.ok(oRootNode.hasClass("sapSuiteStatusIndicatorVertical"));
		assert.ok(oLabelNode.hasClass("sapSuiteStatusIndicatorLabelAfterSvg"));
	});

	QUnit.test("StatusIndicator update without animation when the size is 'Small'", function (assert) {
		// Given
		var oRectangle = new Rectangle({
			fullAnimationDuration: 20000
		});
		this.statusIndicator.addGroup(new ShapeGroup({
			shapes: [oRectangle]
		}));
		var oRectangleStub = oSandbox.stub(oRectangle, "_updateDom");
		this.statusIndicator.setSize("Small");

		// When
		this.statusIndicator.setValue(100);
		render(this.statusIndicator);

		// Then
		return this.statusIndicator._oCurrentAnimationPromise.then(function () {
			assert.ok(oRectangleStub.calledOnce, "Shape's updateDom was called once");
			assert.ok(oRectangleStub.calledWith(100), "Shape's updateDom was called with correct value");
		});
	});

	QUnit.test("StatusIndicator divides value between its groups (change from 0 to 70)", function (assert) {

		// Given
		var oGroupInfo1 = addGroupWithWeight(this.statusIndicator, 20, false);
		var oGroupInfo2 = addGroupWithWeight(this.statusIndicator, 10, false);
		var oGroupInfo3 = addGroupWithWeight(this.statusIndicator, 20, false);

		// When
		this.statusIndicator.setValue(70);
		var oResultPromise = this.statusIndicator._propagateValueToGroups();

		// Then
		return oResultPromise.then(function () {
			assert.ok(oGroupInfo1.group._setValue.withArgs(100).calledOnce, "First group value set to 100.");
			assert.ok(oGroupInfo2.group._setValue.withArgs(100).calledOnce, "Second group value set to 50.");
			assert.ok(oGroupInfo3.group._setValue.withArgs(25).calledOnce, "Third group value set to 0.");

			assert.ok(oGroupInfo1.group._setValue.calledBefore(oGroupInfo2.group._setValue), "Second promise was chained after the first one.");
			assert.ok(oGroupInfo2.group._setValue.calledBefore(oGroupInfo3.group._setValue), "Third promise was chained after the second one.");
		});
	});

	QUnit.test("StatusIndicator divides value between its groups (change from ~90 to 20)", function (assert) {

		// Given
		var oStatusIndicator = this.statusIndicator;
		var oGroupInfo1 = addGroupWithWeight(oStatusIndicator, 20, true);
		var oGroupInfo2 = addGroupWithWeight(oStatusIndicator, 10, true);
		var oGroupInfo3 = addGroupWithWeight(oStatusIndicator, 20, false);

		// When
		oStatusIndicator.setValue(20);
		var oResultPromise = this.statusIndicator._propagateValueToGroups();

		// Then
		return oResultPromise.then(function () {
			assert.ok(oGroupInfo1.group._setValue.withArgs(50).calledOnce, "First group value set to 100.");
			assert.ok(oGroupInfo2.group._setValue.withArgs(0).calledOnce, "Second group value set to 100.");
			assert.ok(oGroupInfo3.group._setValue.withArgs(0).calledOnce, "Third group value set to 25.");

			assert.ok(oGroupInfo3.group._setValue.calledBefore(oGroupInfo2.group._setValue), "Second promise was chained after the third one.");
			assert.ok(oGroupInfo2.group._setValue.calledBefore(oGroupInfo1.group._setValue), "First promise was chained after the second one.");
		});
	});

	QUnit.test("Thresholds same value test", function (assert) {
		var oStatusIndicator = new StatusIndicator();

		var oThreshold = new PropertyThreshold();
		oThreshold.setToValue(50);
		oThreshold.setFillColor("red");

		var oThreshold2 = new PropertyThreshold();
		oThreshold2.setToValue(70);
		oThreshold2.setFillColor("green");

		var oThreshold3 = new PropertyThreshold();
		oThreshold3.setToValue(70);
		oThreshold3.setFillColor("black");

		var oDiscreteThreshold = new DiscreteThreshold({
			value: 50
		});
		var oDiscreteThreshold2 = new DiscreteThreshold({
			value: 50
		});
		var sapLogFatalStub = oSandbox.stub(Log, 'fatal');

		oStatusIndicator.addPropertyThreshold(oThreshold);
		oStatusIndicator.addPropertyThreshold(oThreshold2);
		oStatusIndicator.addPropertyThreshold(oThreshold3);
		oStatusIndicator.addDiscreteThreshold(oDiscreteThreshold);
		oStatusIndicator.addDiscreteThreshold(oDiscreteThreshold2);

		assert.ok(sapLogFatalStub.calledTwice, "Two or more thresholds with same ToValue will provoke log");
	});

	QUnit.test("Property Threshold Test", function (assert) {
		var oStatusIndicator = new StatusIndicator();
		var oThreshold1 = new PropertyThreshold();
		oThreshold1.setToValue(50);
		oThreshold1.setFillColor("red");

		var oThreshold2 = new PropertyThreshold();
		oThreshold2.setToValue(70);
		oThreshold2.setFillColor("green");

		var oThreshold3 = new PropertyThreshold();
		oThreshold3.setToValue(20);
		oThreshold3.setFillColor("black");

		oStatusIndicator.addPropertyThreshold(oThreshold1);
		oStatusIndicator.addPropertyThreshold(oThreshold2);
		oStatusIndicator.addPropertyThreshold(oThreshold3);

		assert.equal(oStatusIndicator._sortedPropertyThresholds[0], oThreshold3);
		assert.equal(oStatusIndicator._sortedPropertyThresholds[1], oThreshold1);
		assert.equal(oStatusIndicator._sortedPropertyThresholds[2], oThreshold2);
	});

	QUnit.test("Discrete Threshold Test", function (assert) {
		// Given
		var oStatusIndicator = new StatusIndicator();
		var oThreshold1 = new DiscreteThreshold({
			value: 50
		});
		var oThreshold2 = new DiscreteThreshold({
			value: 70
		});
		var oThreshold3 = new DiscreteThreshold({
			value: 20
		});

		oStatusIndicator.addDiscreteThreshold(oThreshold1);
		oStatusIndicator.addDiscreteThreshold(oThreshold2);
		oStatusIndicator.addDiscreteThreshold(oThreshold3);

		assert.equal(oStatusIndicator._sortedDiscreteThresholds[0], oThreshold3);
		assert.equal(oStatusIndicator._sortedDiscreteThresholds[1], oThreshold1);
		assert.equal(oStatusIndicator._sortedDiscreteThresholds[2], oThreshold2);
	});

	function checkElementsId(elementShape, oElement, oElement2, oElement3) {
		QUnit.test("StatusIndicator check Id " + elementShape, function (assert) {

			// When
			oElement.placeAt("content");
			oElement2.placeAt("content");
			oElement3.placeAt("content");

			oCore.applyChanges();
			var $element1 = oElement.$();
			var $element2 = oElement2.$();
			var $element3 = oElement3.$();
			var maskElement1 = $element1[0].childNodes[0].childNodes[1];
			var maskElement2 = $element2[0].childNodes[0].childNodes[1];
			var maskElement3 = $element3[0].childNodes[0].childNodes[1];
			var linearGradientElement1 = $element1[0].childNodes[0].childNodes[0];
			var linearGradientElement2 = $element2[0].childNodes[0].childNodes[0];
			var linearGradientElement3 = $element3[0].childNodes[0].childNodes[0];
			var oElement1maskAttribute = $element1[0].childNodes[1].getAttribute("mask");
			var oElement2maskAttribute = $element2[0].childNodes[1].getAttribute("mask");
			var oElement3maskAttribute = $element3[0].childNodes[1].getAttribute("mask");
			var oElement1maskShapeFillAttribute = maskElement1.childNodes[0].getAttribute("fill");
			var oElement2maskShapeFillAttribute = maskElement2.childNodes[0].getAttribute("fill");
			var oElement3maskShapeFillAttribute = maskElement3.childNodes[0].getAttribute("fill");

			// Then
			assert.equal(oElement.sId, oElement.getId(), "Element id fits.");
			assert.equal(oElement2.sId, oElement2.getId(), "Element2 id fits.");
			assert.equal(oElement3.sId, oElement3.getId(), "Element3 id fits.");

			assert.equal(Utils.getUrlId(oElement1maskAttribute), maskElement1.getAttribute("id"), "Element Mask url points to mask");
			assert.equal(Utils.getUrlId(oElement2maskAttribute), maskElement2.getAttribute("id"), "Element2 Mask url points to mask");
			assert.equal(Utils.getUrlId(oElement3maskAttribute), maskElement3.getAttribute("id"), "Element3 Mask url points to mask");

			assert.equal(Utils.getUrlId(oElement1maskShapeFillAttribute), linearGradientElement1.getAttribute("id"), "Fill url of maskElement1 points to linearGradient element");
			assert.equal(Utils.getUrlId(oElement2maskShapeFillAttribute), linearGradientElement2.getAttribute("id"), "Fill url of maskElement2 points to linearGradient2 element");
			assert.equal(Utils.getUrlId(oElement3maskShapeFillAttribute), linearGradientElement3.getAttribute("id"), "Fill url of maskElement3 points to linearGradient3 element");

			// mask ids are different
			assert.notEqual(oElement1maskAttribute, oElement2maskAttribute, "Mask for element1 and element2 differs");
			assert.notEqual(oElement1maskAttribute, oElement3maskAttribute, "Mask for element1 and element3 differs");
			assert.notEqual(oElement2maskAttribute, oElement3maskAttribute, "Mask for element2 and element3 differs");

			// mask ids are different
			assert.notEqual(oElement1maskShapeFillAttribute, oElement2maskShapeFillAttribute, "Fill attribute of mask for element1 and element2 differs");
			assert.notEqual(oElement1maskShapeFillAttribute, oElement3maskShapeFillAttribute, "Fill attribute of mask for element1 and element3 differs");
			assert.notEqual(oElement2maskShapeFillAttribute, oElement3maskShapeFillAttribute, "Fill attribute of mask for element2 and element3 differs");
		});
	}

	(function () {
		var oAnimationPropertiesResolver = sinon.createStubInstance(AnimationPropertiesResolver);
		var oRectangle1 = new Rectangle({
			fillingType: FillingType.Linear
		});
		oRectangle1._injectAnimationPropertiesResolver(oAnimationPropertiesResolver);
		var oRectangle2 = new Rectangle({
			fillingType: FillingType.Linear
		});
		oRectangle2._injectAnimationPropertiesResolver(oAnimationPropertiesResolver);
		var oRectangle3 = new Rectangle({
			fillingType: FillingType.Linear
		});
		oRectangle3._injectAnimationPropertiesResolver(oAnimationPropertiesResolver);
		checkElementsId("Rectangle", oRectangle1, oRectangle2, oRectangle3);

		var oCircle1 = new Circle({
			fillingType: FillingType.Linear
		});
		oCircle1._injectAnimationPropertiesResolver(oAnimationPropertiesResolver);
		var oCircle2 = new Circle({
			fillingType: FillingType.Linear
		});
		oCircle2._injectAnimationPropertiesResolver(oAnimationPropertiesResolver);
		var oCircle3 = new Circle({
			fillingType: FillingType.Linear
		});
		oCircle3._injectAnimationPropertiesResolver(oAnimationPropertiesResolver);
		checkElementsId("Circle", oCircle1, oCircle2, oCircle3);
	})();

	QUnit.test("Test _createValueTextMessage method call with discrete thresholds and value below", function (assert) {
		var sDiscreteThresholdAriaLabel = "Aria label 1";

		this.statusIndicator.addDiscreteThreshold(new DiscreteThreshold({
			value: 20,
			ariaLabel: sDiscreteThresholdAriaLabel
		}));

		var sExpectedText = "translated text";
		var oGetTextStub = oSandbox.stub().returns(sExpectedText);

		oSandbox.stub(Core, "getLibraryResourceBundle").returns({
			getText: oGetTextStub
		});

		var sActualText = this.statusIndicator._createValueTextMessage(19);

		assert.equal(sActualText, sExpectedText);
		assert.ok(oGetTextStub.withArgs("STATUS_INDICATOR_VALUE_BELOW_THRESHOLD", [19, sDiscreteThresholdAriaLabel]).called);
	});

	QUnit.test("Test _createValueTextMessage method call with discrete thresholds and value above", function (assert) {
		var sDiscreteThresholdAriaLabel = "Aria label 1";

		this.statusIndicator.addDiscreteThreshold(new DiscreteThreshold({
			value: 20,
			ariaLabel: sDiscreteThresholdAriaLabel
		}));

		var sExpectedText = "translated text";
		var oGetTextStub = oSandbox.stub().returns(sExpectedText);

		oSandbox.stub(Core, "getLibraryResourceBundle").returns({
			getText: oGetTextStub
		});

		var sActualText = this.statusIndicator._createValueTextMessage(20);

		assert.equal(sActualText, sExpectedText);
		assert.ok(oGetTextStub.withArgs("STATUS_INDICATOR_VALUE_ABOVE_THRESHOLD", [20, sDiscreteThresholdAriaLabel]).called);
	});

	QUnit.test("Test _createValueTextMessage method call with discrete thresholds, property thresholds and value below", function (assert) {
		var sDiscreteThresholdAriaLabel = "Aria label 1";
		var sPropertyThresholdAriaLabel = "Aria label 2";

		this.statusIndicator.addDiscreteThreshold(new DiscreteThreshold({
			value: 20,
			ariaLabel: sDiscreteThresholdAriaLabel
		}));
		this.statusIndicator.addPropertyThreshold(new PropertyThreshold({
			toValue: 25,
			ariaLabel: sPropertyThresholdAriaLabel
		}));

		var sExpectedText = "translated text";
		var oGetTextStub = oSandbox.stub().returns(sExpectedText);

		oSandbox.stub(Core, "getLibraryResourceBundle").returns({
			getText: oGetTextStub
		});

		var sActualText = this.statusIndicator._createValueTextMessage(19);

		assert.equal(sActualText, sExpectedText);
		assert.ok(oGetTextStub.withArgs("STATUS_INDICATOR_VALUE_BELOW_THRESHOLD_COLOR", [19, sDiscreteThresholdAriaLabel, sPropertyThresholdAriaLabel]).called);
	});

	QUnit.test("Test _createValueTextMessage method call with discrete thresholds, property thresholds and value above", function (assert) {
		var sDiscreteThresholdAriaLabel = "Aria label 1";
		var sPropertyThresholdAriaLabel = "Aria label 2";

		this.statusIndicator.addDiscreteThreshold(new DiscreteThreshold({
			value: 20,
			ariaLabel: sDiscreteThresholdAriaLabel
		}));
		this.statusIndicator.addPropertyThreshold(new PropertyThreshold({
			toValue: 25,
			ariaLabel: sPropertyThresholdAriaLabel
		}));

		var sExpectedText = "translated text";
		var oGetTextStub = oSandbox.stub().returns(sExpectedText);

		oSandbox.stub(Core, "getLibraryResourceBundle").returns({
			getText: oGetTextStub
		});

		var sActualText = this.statusIndicator._createValueTextMessage(21);

		assert.equal(sActualText, sExpectedText);
		assert.ok(oGetTextStub.withArgs("STATUS_INDICATOR_VALUE_ABOVE_THRESHOLD_COLOR", [21, sDiscreteThresholdAriaLabel, sPropertyThresholdAriaLabel]).called);
	});

	QUnit.test("Test _createValueTextMessage method call with property thresholds only", function (assert) {
		var sPropertyThresholdAriaLabel = "Aria label 2";

		this.statusIndicator.addPropertyThreshold(new PropertyThreshold({
			toValue: 80,
			ariaLabel: sPropertyThresholdAriaLabel
		}));

		var sExpectedText = "translated text";
		var oGetTextStub = oSandbox.stub().returns(sExpectedText);

		oSandbox.stub(Core, "getLibraryResourceBundle").returns({
			getText: oGetTextStub
		});

		var sActualText = this.statusIndicator._createValueTextMessage(50);

		assert.equal(sActualText, sExpectedText);
		assert.ok(oGetTextStub.withArgs("STATUS_INDICATOR_VALUE_COLOR", [50, sPropertyThresholdAriaLabel]).called);
	});

	QUnit.test("Test _createValueTextMessage method call with default setup", function (assert) {
		var sExpectedText = "translated text";
		var oGetTextStub = oSandbox.stub().returns(sExpectedText);

		oSandbox.stub(Core, "getLibraryResourceBundle").returns({
			getText: oGetTextStub
		});

		var sActualText = this.statusIndicator._createValueTextMessage(50);
		assert.equal(sActualText, sExpectedText);
		assert.ok(oGetTextStub.withArgs("STATUS_INDICATOR_VALUE", [50]).called);
	});

	// these tests are somehow related to tests for updateDomColor in AnimationPropertiesResolver.qunit.js
	// and they affect each other. It is only in PhantomJS on it behaving differrently on local PhantomJS instance and
	// on the remote one.
	QUnit.test("Basic animation test with custom shapes", function (assert) {
		// semantic colors are resolved in dependence of theme. Current tests count with sap_belize theme
		var that = this;
		var clock = sinon.useFakeTimers();
		var oCustomShape1 = new CustomShape({
			definition: "<svg>" +
			"<rect x='2' y='3' width='5' height='7'></rect>" +
			"</svg>",
			strokeColor: "Neutral"
		});

		var oCustomShape2 = new CustomShape({
			definition: "<svg>" +
			"<rect x='5' y='1' width='20' height='10'></rect>" +
			"</svg>"
		});


		this.statusIndicator.addGroup(
			new ShapeGroup({
				shapes: [oCustomShape1]
			})
		);
		this.statusIndicator.addGroup(
			new ShapeGroup({
				shapes: [oCustomShape2]
			})
		);

		this.statusIndicator.addPropertyThreshold(
			new PropertyThreshold({
				fillColor: "Good",
				toValue: 100
			})
		);
		this.statusIndicator.addPropertyThreshold(
			new PropertyThreshold({
				fillColor: "Critical",
				toValue: 60
			})
		);
		this.statusIndicator.addPropertyThreshold(
			new PropertyThreshold({
				fillColor: "Error",
				toValue: 25
			})
		);

		this.statusIndicator.placeAt("content");
		oCore.applyChanges();
		clock.tick(1000);
		this.statusIndicator.setValue(100);
		clock.tick(1000);

		assert.equal(oCustomShape1.$()[0].childNodes[0].childNodes[1].getAttribute("stroke"), ThemingUtil.resolveColor(ValueColor.Neutral));
		return this.statusIndicator._oCurrentAnimationPromise.then(function () {
			// animation finished
			assert.equal(oCustomShape1._iDisplayedValue, 100);
			assert.equal(oCustomShape2._iDisplayedValue, 100);

			assert.equal(oCustomShape1.$()[0].childNodes[0].childNodes[1].getAttribute("fill"), ThemingUtil.resolveColor(ValueColor.Good));
			that.statusIndicator.setValue(50);
			clock.tick(1000);

			return that.statusIndicator._oCurrentAnimationPromise;
		}).then(function () {
			assert.equal(oCustomShape1.$()[0].childNodes[0].childNodes[1].getAttribute("fill"), ThemingUtil.resolveColor(ValueColor.Critical));
			clock.restore();
		});
	});

	QUnit.test("Animation on change", function (assert) {
		var oCustomShape1 = new CustomShape({
			definition: "<svg>" +
			"<rect x='2' y='3' width='5' height='7'></rect>" +
			"</svg>",
			strokeColor: "Neutral"
		});
		var clock = sinon.useFakeTimers();
		var oUpdateDomSpy = oSandbox.spy(oCustomShape1, "_updateDom");

		this.statusIndicator.addGroup(
			new ShapeGroup({
				shapes: [oCustomShape1]
			})
		);

		this.statusIndicator.placeAt("content");
		oCore.applyChanges();
		clock.tick(1000);

		this.statusIndicator.setValue(100);
		clock.tick(1000);

		return this.statusIndicator._oCurrentAnimationPromise.then(function checkStateAfterAnimation() {
			var aValueSerie = oUpdateDomSpy.args.map(function (oItem) {
				return oItem[0];
			});

			assert.ok(aValueSerie.length >= 2); // animation was running and values were updating
			assert.ok(aValueSerie.reduce(isRisingReducer, {result: true}).result, "Values passed in _updateDom are rising");
			assert.equal(aValueSerie[0], 0);
			assert.equal(aValueSerie[aValueSerie.length - 1], 100);
			clock.restore();
		});
	});

	QUnit.test("No animation on change", function (assert) {
		var oCustomShape1 = new CustomShape({
			definition: "<svg>" +
			"<rect x='2' y='3' width='5' height='7'></rect>" +
			"</svg>",
			strokeColor: "Neutral",
			animationOnChange: false
		});
		var oUpdateDomSpy = oSandbox.spy(oCustomShape1, "_updateDom");

		this.statusIndicator.addGroup(
			new ShapeGroup({
				shapes: [oCustomShape1]
			})
		);

		this.statusIndicator.placeAt("content");
		oCore.applyChanges();

		this.statusIndicator.setValue(100);

		return this.statusIndicator._oCurrentAnimationPromise.then(function checkStateAfterAnimation() {
			var aValueSerie = oUpdateDomSpy.args.map(function (oItem) {
				return oItem[0];
			});

			// animation wasnt running and only border values were passed into dom
			// after each rerendering updateDom is called to propagate values into inner shapes
			// not sure why second re-rendeing of the whole status indicator is happening
			// maybe it is possible to reduced the serie to only 3 items
			assert.equal(aValueSerie.length, 5);
			assert.ok(aValueSerie.reduce(isRisingReducer, {result: true}).result, "Values passed in _updateDom are rising");
			assert.equal(aValueSerie[0], 0);
			assert.equal(aValueSerie[1], 0);
			assert.equal(aValueSerie[2], 0);
			assert.equal(aValueSerie[3], 0);
			assert.equal(aValueSerie[4], 100);
		});
	});

	QUnit.test("CustomShape with initial value gets rendered correctly", function (assert) {
		var oCustomShape = new CustomShape({
			id: "customShape",
			fillingType: FillingType.Linear,
			fillColor: "Critical",
			strokeWidth: 3,
			definition: "<svg><circle data-shape-id='customShape-circle' cx='50' cy='50' r='40' /></svg>"
		});
		var clock = sinon.useFakeTimers();
		this.statusIndicator.addGroup(new ShapeGroup({
			shapes: oCustomShape
		}));

		this.statusIndicator.setValue(50);

		this.statusIndicator.placeAt("content");
		oCore.applyChanges();
		clock.tick(1000);

		return this.statusIndicator._oCurrentAnimationPromise.then(function () {
			var $customShape = oCustomShape.$()[0],
				aStopNodes = $customShape.childNodes[0].childNodes[0].childNodes[0];
			assert.equal(aStopNodes.childNodes.length, 2, "There should be 2 stop filters.");
			assert.equal(aStopNodes.childNodes[0].getAttribute("offset"), 0.5, "Offset should be 0.5");
			assert.equal(aStopNodes.childNodes[1].getAttribute("offset"), 0.5, "Offset should be 0.5");
			assert.equal(aStopNodes.childNodes[0].getAttribute("stop-color"), "white", "First stop color should be white.");
			assert.equal(aStopNodes.childNodes[1].getAttribute("stop-color"), "transparent", "Second stop color should be transparent.");
			clock.restore();
		});
	});

	QUnit.test("Label is destroyed correctly with StatusIndicator ", function (assert) {
		function createStatusIndicator() {
			return new StatusIndicator("statusIndicator", {
				value: 100,
				groups: new ShapeGroup({
					shapes: new Circle({
						cx: 8,
						cy: 8,
						r: 8
					})
				})
			});
		}

		var oIndicator = createStatusIndicator();
		oIndicator.destroy();

		oIndicator = createStatusIndicator();
		oIndicator.destroy();

		assert.ok(true, "No duplicate id excepcetion was raised");
	});

});
