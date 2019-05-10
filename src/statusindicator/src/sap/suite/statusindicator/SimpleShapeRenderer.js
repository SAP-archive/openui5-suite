/*!
 * ${copyright}
 */

sap.ui.define([
	"./library",
	"sap/ui/core/Renderer"
], function (library, Renderer) {
	"use strict";

	var FillingType = library.FillingType;

	var STOP_ID = "stop",
		GRADIENT_ID = "gradient";

	/**
	 * StatusIndicator renderer.
	 * @namespace
	 * @extends sap.ui.core.Renderer
	 */
	var SimpleShapeRenderer = Renderer.extend("sap.suite.statusindicator.SimpleShapeRenderer");

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm
	 *            The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.suite.statusindicator.StatusIndicator} oControl
	 *            An object representation of the control that should be rendered.
	 */
	SimpleShapeRenderer.render = function (oRm, oControl) {
		var sMaskId = oControl._buildIdString(oControl.getId(), "mask");

		oRm.openStart("svg", oControl); //Root
		if (oRm.controlData) {
			// use older API until it gets propagated to npm
			oRm.controlData(oControl);
		}
		oRm.attr("xlmns", "http://www.w3.org/2000/svg");

		var sInternalViewBox = oControl._getInternalViewBox();
		if (sInternalViewBox) {
			oRm.attr("viewBox", sInternalViewBox);
		}
		oRm.attr("preserveAspectRatio", oControl._buildPreserveAspectRatioAttribute());
		oRm.attr("overflow", "visible");
		oRm.openEnd(); //Root

		oRm.openStart("defs").openEnd(); //Defs
		if (oControl.getFillingType() !== FillingType.None) {
			if (oControl._useGradientForAnimation()) {
				this._renderGradientElement(oRm, oControl);
			}
			this._renderMaskElement(oRm, oControl, sMaskId);
		}
		oRm.close("defs"); //Defs

		var mAttributes = {
			id: oControl._buildIdString(oControl.getId(), "shape"),
			fill: oControl._resolveFillColor(),
			mask: "url(#" + sMaskId + ")",
			"stroke-width": 0
		};
		if (oControl._sStyleAttribute) {
			mAttributes.style = oControl._sStyleAttribute;
		}
		oControl._renderSimpleShapeElement(oRm, mAttributes);

		mAttributes = {
			id: oControl._buildIdString(oControl.getId(), "shape-border"),
			fill: "transparent"
		};
		oControl._renderSimpleShapeElement(oRm, mAttributes);

		oRm.close("svg"); //Root
	};

	SimpleShapeRenderer._renderGradientElement = function (oRm, oControl) {
		var iDisplayedValue = oControl._iDisplayedValue,
			sTagName = oControl.getFillingType() === FillingType.Linear ? "linearGradient" : "radialGradient";

		oRm.openStart(sTagName); //GradientElement
		oRm.attr("id", oControl._buildIdString(oControl.getId(), GRADIENT_ID));

		if (oControl.getFillingType() === FillingType.Linear) {
			var iComputedAngle = oControl.computeLinearFillingAngle();
			oRm.attr("x1", iComputedAngle === 90 ? 1 : 0);
			oRm.attr("y1", iComputedAngle === 0 ? 1 : 0);
			oRm.attr("x2", iComputedAngle === 270 ? 1 : 0);
			oRm.attr("y2", iComputedAngle === 180 ? 1 : 0);
		}
		oRm.openEnd(); //GradientElement

		var fOffset = oControl._getDisplayedGradientOffset(iDisplayedValue);
		oRm.openStart(STOP_ID); //StopColor
		oRm.attr("offset", fOffset);
		oRm.attr("stop-color", "white");
		oRm.openEnd(); //StopColor
		oRm.close(STOP_ID);

		oRm.openStart(STOP_ID); //StopTransparent
		oRm.attr("offset", fOffset);
		oRm.attr("stop-color", "transparent");
		oRm.openEnd(); //StopTransparent
		oRm.close(STOP_ID);

		oRm.close(sTagName); //GradientElement
	};

	SimpleShapeRenderer._renderMaskElement = function (oRm, oControl, sMaskId) {
		oRm.openStart("mask"); //Mask
		oRm.attr("id", sMaskId);
		oRm.openEnd(); //Mask

		if (oControl._useGradientForAnimation()) {
			oControl._renderSimpleShapeElement(oRm, {
				id: oControl._buildIdString(oControl.getId(), "mask-shape"),
				"stroke-width": 0,
				stroke: "white",
				fill: "url(#" + oControl._buildIdString(oControl.getId(), GRADIENT_ID) + ")"
			});
		} else {
			oRm.openStart("polygon");
			oRm.attr("id", oControl._buildIdString(oControl.getId(), "polygon"));
			oRm.attr("fill", "white");
			// calculating polygon's points depends on bounding box. But bounding box is
			// possible to obtain only when the SVG is in DOM and when SVG is visible
			// therefore we cant render it on initial with specified value.
			// It is easily possible to compute it without bounding box for rectangle/circle,
			// but almost impossible for path
			oRm.openEnd();
			oRm.close("polygon");
		}

		oRm.close("mask"); //Mask
	};

	SimpleShapeRenderer._updateDomColor = function (oControl, sNewFillColor) {
		oControl.$("shape").attr("fill", sNewFillColor);
	};

	SimpleShapeRenderer._updateDomGradient = function (oControl, iValue) {
		if (!oControl.$stopNodes) {
			oControl.$stopNodes = oControl.$(GRADIENT_ID).find(STOP_ID);
		}

		oControl.$stopNodes.attr("offset", oControl._getDisplayedGradientOffset(iValue));
	};

	SimpleShapeRenderer._updateDomPolygon = function (oControl, iValue) {
		// polygon based animation
		if (!oControl.$polygon) {
			oControl.$polygon = oControl.$("polygon");
		}

		var sPointsAttributeValue = oControl._getPolygonPoints(iValue)
			.reduce(function (acc, item) {
				return acc + item.x + "," + item.y + " ";
			}, "");
		oControl.$polygon.attr("points", sPointsAttributeValue);
	};

	SimpleShapeRenderer._clearDomReferences = function (oControl) {
		oControl.$polygon = null;
		oControl.$stopNodes = null;
	};

	return SimpleShapeRenderer;

});
