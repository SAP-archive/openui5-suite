/*!
 * ${copyright}
 */

sap.ui.define([
	"sap/ui/core/theming/Parameters",
	"sap/ui/core/library",
	"sap/m/library"
], function (Parameters, coreLibrary, mLibrary) {
	"use strict";

	var CSSColor = coreLibrary.CSSColor,
		ValueColor = mLibrary.ValueColor;

	var ThemingUtil = function() {
		throw new Error();
	};

	ThemingUtil.resolveColor = function (sColor) {
		if (CSSColor.isValid(sColor)) {
			return sColor;
		}

		switch (sColor) {
			case ValueColor.Good:
				return Parameters.get("sapPositiveColor");
			case ValueColor.Error:
				return Parameters.get("sapNegativeColor");
			case ValueColor.Critical:
				return Parameters.get("sapCriticalColor");
			case ValueColor.Neutral:
				return Parameters.get("sapNeutralColor");
			default:
				return Parameters.get(sColor);
		}
	};

	return ThemingUtil;
});
