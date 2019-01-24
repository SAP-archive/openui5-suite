/*!
 * ${copyright}
 */

sap.ui.define([
	"sap/suite/ui/commons/util/HtmlElement",
	"sap/suite/statusindicator/SimpleShape",
	"sap/suite/statusindicator/SimpleShapeRenderer"
], function (HtmlElement, SimpleShape, SimpleShapeRenderer) {
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
	 * @since 1.50
	 *
	 * @constructor
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

	Path.prototype._getSimpleShapeElement = function (sPathId) {
		var oPathElement = new HtmlElement("path");

		oPathElement.setId(this._buildIdString(sPathId));
		oPathElement.setAttribute("d", this.getD(), true);
		oPathElement.setAttribute("stroke-width", this.getStrokeWidth());
		oPathElement.setAttribute("stroke", this._getCssStrokeColor());
		if (this.aCustomStyleClasses) {
			this.aCustomStyleClasses.forEach(oPathElement.addClass.bind(oPathElement));
		}

		return oPathElement;
	};

	return Path;

});
