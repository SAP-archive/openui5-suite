/*!
 * ${copyright}
 */

sap.ui.define([
	"sap/ui/core/Control"
], function (Control) {
	"use strict";

	/**
	 * Constructor for a new DiscreteThreshold.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Discrete threshold specifies which values should be displayed by the status indicator.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version ${version}
	 * @since 1.50
	 *
	 * @constructor
	 * @public
	 * @alias sap.suite.statusindicator.DiscreteThreshold
	 * @ui5-metamodel This control/element will also be described in the UI5 (legacy) design time metamodel.
	 */
	var DiscreteThreshold = Control.extend("sap.suite.statusindicator.DiscreteThreshold",
		{
			metadata: {
				library: "sap.suite.statusindicator",
				properties: {

					/**
					 * Defines the value threshold. This value is displayed when the status indicator's
					 * percentage value is above or equal to this value but below the value of
					 * the next threshold.
					 */
					value: {type: "int", defaultValue: 0},

					/**
					 * ARIA label for this threshold to be used by screen reader software.
					 */
					ariaLabel: {type: "string", defaultValue: null}
				}
			}
		});

	return DiscreteThreshold;

});
