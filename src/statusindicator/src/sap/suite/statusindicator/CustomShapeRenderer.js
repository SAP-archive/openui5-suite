/*!
 * ${copyright}
 */

sap.ui.define([
	"./library",
	"sap/ui/core/Renderer"
], function (library, Renderer) {
	"use strict";

	/**
	 * StatusIndicator renderer.
	 * @namespace
	 * @extends sap.ui.core.Renderer
	 */
	var CustomShapeRenderer = Renderer.extend("sap.suite.statusindicator.CustomShapeRenderer");

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm
	 *            The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.suite.statusindicator.StatusIndicator} oControl
	 *            An object representation of the control that should be rendered.
	 *
	 * @returns {void}
	 */
	CustomShapeRenderer.render = function (oRm, oControl) {
		oRm.openStart("svg", oControl);
		if (oRm.controlData) {
			// use older API until it gets propagated to npm
			oRm.controlData(oControl);
		}
		oRm.attr("version", "1.1");
		oRm.attr("xlmns", "http://www.w3.org/2000/svg");

		var sInternalViewBox = oControl._getInternalViewBox();
		if (sInternalViewBox) {
			oRm.attr("viewBox", sInternalViewBox);
		}
		oRm.attr("preserveAspectRatio", oControl._buildPreserveAspectRatioAttribute());
		oRm.attr("x", oControl.getX());
		oRm.attr("y", oControl.getY());
		oRm.attr("width", oControl.getWidth());
		oRm.attr("height", oControl.getHeight());
		oRm.openEnd();

		oControl.getShapes().forEach(function (oShape) {
			oRm.renderControl(oShape);
		});
		oRm.close("svg");
	};

	CustomShapeRenderer._updateDomColor = function (oControl, sFillColor) {
		oControl._aFillableSubShapes.forEach(function (oSubShape) {
			var oShape = oSubShape.shape;
			var oRenderer = oShape.getRenderer();
			oRenderer._updateDomColor(oShape, sFillColor);
		});
	};

	return CustomShapeRenderer;
});
