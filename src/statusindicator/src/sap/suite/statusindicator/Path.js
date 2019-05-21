/*!
 * ${copyright}
 */

sap.ui.define([
	"sap/suite/statusindicator/SimpleShape",
	"sap/suite/statusindicator/SimpleShapeRenderer"
], function (SimpleShape, SimpleShapeRenderer) {
	"use strict";

	/**
	 * Constructor for a new Path.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Shape that consists of a single SVG path element.
	 * @extends sap.suite.statusindicator.SimpleShape
	 *
	 * @author SAP SE
	 * @version ${version}
	 * @since 1.67
	 *
	 * @public
	 * @alias sap.suite.statusindicator.Path
	 * @ui5-metamodel This control/element will also be described in the UI5 (legacy) design time metamodel.
	 */
	var Path = SimpleShape.extend("sap.suite.statusindicator.Path",
		/** @lends sap.suite.statusindicator.Shape.prototype */
		{
			metadata: {
				library: "sap.suite.statusindicator",
				properties: {

					/**
					 * Specifies the path that outlines the shape.
					 * The format is identical to the <code>d</code> attribute of the <code>&lt;path&gt;</code>
					 * SVG element.
					 */
					d: {type: "string", defaultValue: null}
				}
			},
			renderer: SimpleShapeRenderer
		});

	Path.prototype._renderSimpleShapeElement = function (oRm, mAttributes) {
		oRm.openStart("path");
		this._renderElementAttributes(oRm, mAttributes);
		oRm.attr("d", this.getD());
		oRm.attr("stroke-width", this.getStrokeWidth());
		oRm.attr("stroke", this._getCssStrokeColor());
		oRm.openEnd();
		oRm.close("path");
	};

	return Path;
});
