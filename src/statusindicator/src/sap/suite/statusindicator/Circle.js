/*!
 * ${copyright}
 */

sap.ui.define([
	"sap/suite/statusindicator/Shape",
	"sap/suite/ui/commons/util/HtmlElement",
	"sap/suite/statusindicator/SimpleShape",
	"sap/suite/statusindicator/SimpleShapeRenderer"
], function (Shape, HtmlElement, SimpleShape, SimpleShapeRenderer) {
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
	 * @since 1.50
	 *
	 * @constructor
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

	Circle.prototype._getSimpleShapeElement = function (sCircleId) {
		var oCircleElement = new HtmlElement("circle");
		oCircleElement.setId(this._buildIdString(sCircleId));

		oCircleElement.setAttribute("cx", this.getCx());
		oCircleElement.setAttribute("cy", this.getCy());
		oCircleElement.setAttribute("r", this.getR());
		oCircleElement.setAttribute("stroke-width", this.getStrokeWidth());
		oCircleElement.setAttribute("stroke", this._getCssStrokeColor());

		return oCircleElement;
	};


	return Circle;
});
