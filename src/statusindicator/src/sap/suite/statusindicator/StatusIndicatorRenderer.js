/*!
 * ${copyright}
 */

sap.ui.define([
	"./library",
	"sap/ui/core/library",
	"sap/ui/core/Renderer",
	"sap/base/Log"
], function (library, coreLibrary, Renderer, Log) {
	"use strict";

	var SizeType = library.SizeType;
	var LabelPositionType = library.LabelPositionType;
	var TextAlignType = coreLibrary.TextAlign;
	var resourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.suite.statusindicator");

	function getClassBySize(oStatusIndicator, sPostfix) {
		var sResult;
		sPostfix = typeof sPostfix === "string" ? sPostfix : "";

		switch (oStatusIndicator.getSize()) {
			case SizeType.Small:
				sResult = "sapSuiteStatusIndicatorSmall";
				break;
			case SizeType.Medium:
				sResult = "sapSuiteStatusIndicatorMedium";
				break;
			case SizeType.Large:
				sResult = "sapSuiteStatusIndicatorLarge";
				break;
			case SizeType.ExtraLarge:
				sResult = "sapSuiteStatusIndicatorExtraLarge";
				break;
			case SizeType.None:
				// nothing
				break;
			default:
				Log.error("Unknown size. Expecting size defined in sap.suite.statusindicator.SizeType," +
					" but '" + oStatusIndicator.getSize() + "' given.");
				// default size is small
				sResult = "sapSuiteStatusIndicatorSmall";
		}

		return sResult + sPostfix;
	}

	function getLabelMarginClass(oStatusIndicator) {
		var sPosition = oStatusIndicator.getLabelPosition();
		var sSize = oStatusIndicator.getSize();
		return "sapSuiteStatusIndicator" + sSize + sPosition + "Label";
	}

	/**
	 * StatusIndicator renderer.
	 * @namespace
	 * @extends sap.ui.core.Renderer
	 */
	var StatusIndicatorRenderer = Renderer.extend("sap.suite.statusindicator.StatusIndicatorRenderer");

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm
	 *            The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.suite.statusindicator.StatusIndicator} oControl
	 *            An object representation of the control that should be rendered.
	 */
	StatusIndicatorRenderer.render = function (oRm, oStatusIndicator) {
		var sLabelPosition = oStatusIndicator.getLabelPosition();
		var bIsRowOriented = sLabelPosition === LabelPositionType.Left || sLabelPosition === LabelPositionType.Right,
			bIsLabelFirst = sLabelPosition === LabelPositionType.Left || sLabelPosition === LabelPositionType.Top;

		oRm.openStart("div"); //Root
		oRm.controlData(oStatusIndicator);
		oRm.class("sapSuiteStatusIndicator");
		oRm.attr("role", "progressbar");
		oRm.attr("aria-roledescription", resourceBundle.getText("STATUS_INDICATOR_ARIA_ROLE_DESCRIPTION"));
		oRm.attr("aria-readonly", true);

		var sAriaLabel = oStatusIndicator.getAriaLabel();
		oRm.attr("aria-label", sAriaLabel ? sAriaLabel : resourceBundle.getText("STATUS_INDICATOR_ARIA_LABEL"));

		var aAriaLabelledBy = oStatusIndicator.getAriaLabelledBy();

		if (aAriaLabelledBy && aAriaLabelledBy.length > 0) {
			oRm.attr("aria-labelledby", aAriaLabelledBy.join(" "));
		}

		var aAriaDescribedBy = oStatusIndicator.getAriaDescribedBy();

		if (aAriaDescribedBy && aAriaDescribedBy.length > 0) {
			oRm.attr("aria-describedby", aAriaDescribedBy.join(" "));
		}

		oRm.attr("tabindex", "0");
		oRm.attr("aria-valuemin", 0);
		oRm.attr("aria-valuemax", 100);
		oRm.class(bIsRowOriented ? "sapSuiteStatusIndicatorHorizontal" : "sapSuiteStatusIndicatorVertical")
		oRm.openEnd(); //Root

		if (oStatusIndicator.getShowLabel()) {
			oRm.openStart("div"); //LabelWrapper
			oRm.class(bIsLabelFirst ? "sapSuiteStatusIndicatorLabelBeforeSvg" : "sapSuiteStatusIndicatorLabelAfterSvg");
			oRm.openEnd(); //LabelWrapper

			var oLabel = oStatusIndicator.getLabel();
			oLabel.addStyleClass("sapSuiteStatusIndicatorLabel");
			oLabel.addStyleClass(getClassBySize(oStatusIndicator, "Label"));
			oLabel.addStyleClass(getLabelMarginClass(oStatusIndicator));
			oLabel.setTextAlign(bIsRowOriented ? TextAlignType.Left : TextAlignType.Center);

			oRm.renderControl(oLabel);

			oRm.close("div"); //LabelWrapper
		}

		oRm.openStart("div"); //SvgContainer
		oRm.attr("focusable", false);
		oRm.class("sapSuiteStatusIndicatorSvg");
		oRm.class(getClassBySize(oStatusIndicator, "Svg"));
		oRm.style("width", oStatusIndicator.getWidth());
		oRm.style("height", oStatusIndicator.getHeight());
		oRm.openEnd(); //SvgContainer

		this._renderSvgElement(oRm, oStatusIndicator);

		oRm.close("div"); //SvgContainer
		oRm.close("div"); //Root
	};

	StatusIndicatorRenderer._renderSvgElement = function (oRm, oStatusIndicator) {
		oRm.openStart("svg"); //Svg
		oRm.attr("id", oStatusIndicator._getFullId(oStatusIndicator._internalIds.svgNodeId));
		oRm.attr("version", "1.1");
		oRm.attr("xlmns", "http://www.w3.org/2000/svg");
		oRm.attr("preserveAspectRatio", "xMidYMid meet");
		oRm.style("width", "100%");
		oRm.style("height", "100%");
		oRm.attr("focusable", false);
		if (oStatusIndicator.getViewBox()) {
			oRm.attr("viewBox", oStatusIndicator.getViewBox());
		}
		oRm.openEnd(); //Svg

		oStatusIndicator._getGroupShapes().forEach(function (oShape) {
			oRm.renderControl(oShape);
		});

		oRm.close("svg"); //Svg
	};

	return StatusIndicatorRenderer;

}, true);
