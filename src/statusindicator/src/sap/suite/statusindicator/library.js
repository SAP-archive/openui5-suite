/*!
 * ${copyright}
 */

/**
 * Initialization Code and shared classes of library sap.suite.statusindicator.
 */
sap.ui.define([
	"sap/ui/core/library", // library dependency
	"sap/m/library" // library dependency
], function () {
	"use strict";

	/**
	 * UI5 library: sap.suite.statusindicator.
	 *
	 * @namespace
	 * @name sap.suite.statusindicator
	 * @public
	 */

	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name: "sap.suite.statusindicator",
		dependencies: ["sap.ui.core", "sap.m"],
		types: [
			"sap.suite.statusindicator.FillingType",
			"sap.suite.statusindicator.FillingDirectionType",
			"sap.suite.statusindicator.HorizontalAlignmentType",
			"sap.suite.statusindicator.LabelPositionType",
			"sap.suite.statusindicator.SizeType",
			"sap.suite.statusindicator.VerticalAlignmentType"
		],
		interfaces: [],
		controls: [
			"sap.suite.statusindicator.Circle",
			"sap.suite.statusindicator.CustomShape",
			"sap.suite.statusindicator.LibraryShape",
			"sap.suite.statusindicator.Path",
			"sap.suite.statusindicator.Rectangle",
			"sap.suite.statusindicator.Shape",
			"sap.suite.statusindicator.SimpleShape",
			"sap.suite.statusindicator.StatusIndicator"
		],
		elements: [
			"sap.suite.statusindicator.DiscreteThreshold",
			"sap.suite.statusindicator.FillingOption",
			"sap.suite.statusindicator.PropertyThreshold",
			"sap.suite.statusindicator.ShapeGroup"
		],
		noLibraryCSS: false,
		version: "${version}"
	});

	/**
	 * The type of filling.
	 *
	 * @public
	 * @enum {string}
	 * @ui5-metamodel This control/element will also be described in the UI5 (legacy) design time metamodel.
	 */
	sap.suite.statusindicator.FillingType = {

		/**
		 * The shape is filled with a linear gradient.
		 *
		 * @public
		 */
		Linear: "Linear",

		/**
		 * The shape is filled with a radial gradient.
		 */
		Radial: "Radial",

		/**
		 * Clockwise or counterclockwise circular filling is applied.
		 *
		 * <p>
		 * For details, see {@link sap.suite.statusindicator.FillingDirectionType}.
		 * </p>
		 *
		 * @public
		 */
		Circular: "Circular",

		/**
		 * No filling is applied.
		 *
		 * @public
		 */
		None: "None"
	};

	/**
	 * The direction of animation.<br>
	 *
	 * The direction types <code>Up</code>, <code>Down</code>, <code>Left</code>, and <code>Right</code> are available when
	 * {@link sap.suite.statusindicator.FillingType} is set to <code>Linear</code>.<br>
	 * The direction types <code>Clockwise</code> and <code>Counterclockwise</code> are available when
	 * {@link sap.suite.statusindicator.FillingType} is set to <code>Circular</code>.
	 *
	 * @public
	 * @enum {string}
	 * @ui5-metamodel This control/element will also be described in the UI5 (legacy) design time metamodel.
	 */
	sap.suite.statusindicator.FillingDirectionType = {

		/**
		 * From bottom upwards.
		 *
		 * @public
		 */
		Up: "Up",

		/**
		 * From top to bottom.
		 *
		 * @public
		 */
		Down: "Down",

		/**
		 * From right to left.
		 *
		 * @public
		 */
		Left: "Left",

		/**
		 * From left to right.
		 *
		 * @public
		 */
		Right: "Right",

		/**
		 * Clockwise.
		 *
		 * @public
		 */
		Clockwise: "Clockwise",

		/**
		 * Counterclockwise.
		 *
		 * @public
		 */
		CounterClockwise: "CounterClockwise"
	};

	/**
	 * The horizontal alignment of the status indicator within its parent container.
	 *
	 * @public
	 * @enum {string}
	 * @ui5-metamodel This control/element will also be described in the UI5 (legacy) design time metamodel.
	 */
	sap.suite.statusindicator.HorizontalAlignmentType = {

		/**
		 * Left.
		 *
		 * @public
		 */
		Left: "Left",

		/**
		 * Middle.
		 *
		 * @public
		 */
		Middle: "Middle",

		/**
		 * Right.
		 *
		 * @public
		 */
		Right: "Right"
	};

	/**
	 * Position of the label, relative to the status indicator.
	 *
	 * @public
	 * @enum {string}
	 * @ui5-metamodel This control/element will also be described in the UI5 (legacy) design time metamodel.
	 */
	sap.suite.statusindicator.LabelPositionType = {

		/**
		 * Top.
		 *
		 * @public
		 */
		Top: "Top",

		/**
		 * Right.
		 *
		 * @public
		 */
		Right: "Right",

		/**
		 * Bottom.
		 *
		 * @public
		 */
		Bottom: "Bottom",

		/**
		 * Left
		 *
		 * @public
		 */
		Left: "Left"
	};

	/**
	 * Predefined sizes of the status indicator.
	 *
	 * @public
	 * @enum {string}
	 * @ui5-metamodel This control/element will also be described in the UI5 (legacy) design time metamodel.
	 */
	sap.suite.statusindicator.SizeType = {

		/**
		 * No size settings are applied.
		 * @public
		 */
		None: "None",

		/**
		 * Small status indicator.
		 *
		 * @public
		 */
		Small: "Small",

		/**
		 * Medium status indicator.
		 *
		 * @public
		 */
		Medium: "Medium",

		/**
		 * Large status indicator.
		 *
		 * @public
		 */
		Large: "Large",

		/**
		 * Extra large status indicator.
		 *
		 * @public
		 */
		ExtraLarge: "ExtraLarge"
	};

	/**
	 * The vertical alignment of the status indicator within its parent container.
	 *
	 * @public
	 * @enum {string}
	 * @ui5-metamodel This control/element will also be described in the UI5 (legacy) design time metamodel.
	 */
	sap.suite.statusindicator.VerticalAlignmentType = {

		/**
		 * Top.
		 *
		 * @public
		 */
		Top: "Top",

		/**
		 * Middle.
		 *
		 * @public
		 */
		Middle: "Middle",

		/**
		 * Bottom.
		 *
		 * @public
		 */
		Bottom: "Bottom"
	};

	return sap.suite.statusindicator;

});
