/*!
 * ${copyright}
 */

sap.ui.define([
	"sap/suite/statusindicator/Shape",
	"sap/suite/statusindicator/SimpleShape",
	"sap/suite/statusindicator/SimpleShapeRenderer"
], function (Shape, SimpleShape, SimpleShapeRenderer) {
	"use strict";

	/**
	 * Constructor for a new Circle.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Status indicator shape in the form of a circle.
	 * @extends sap.suite.statusindicator.SimpleShape
	 *
	 * @author SAP SE
	 * @version ${version}
	 * @since 1.67
	 *
	 * @public
	 * @alias sap.suite.statusindicator.Circle
	 * @ui5-metamodel This control/element will also be described in the UI5 (legacy) design time metamodel
	 */
	var Circle = SimpleShape.extend("sap.suite.statusindicator.Circle",
		/** @lends sap.suite.statusindicator.SimpleShape.prototype */
		{
			metadata: {
				library: "sap.suite.statusindicator",
				properties: {

					/**
					 * Defines the x coordinate of the center of the circle with respect to its parent status
					 * indicator.
					 */
					cx: {type: "float", defaultValue: 0},

					/**
					 * Defines the y coordinate of the center of the circle with respect to its parent status
					 * indicator.
					 */
					cy: {type: "float", defaultValue: 0},

					/**
					 * Defines the radius of the circle.
					 */
					r: {type: "float", defaultValue: 0}
				}
			},
			renderer: SimpleShapeRenderer
		});

	Circle.prototype._renderSimpleShapeElement = function (oRm, mAttributes) {
		oRm.openStart("circle");
		this._renderElementAttributes(oRm, mAttributes);
		oRm.attr("cx", this.getCx());
		oRm.attr("cy", this.getCy());
		oRm.attr("r", this.getR());
		oRm.attr("stroke-width", this.getStrokeWidth());
		oRm.attr("stroke", this._getCssStrokeColor());
		oRm.openEnd();
		oRm.close("circle");
	};

	return Circle;
});
