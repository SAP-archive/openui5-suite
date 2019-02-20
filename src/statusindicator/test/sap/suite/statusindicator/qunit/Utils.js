sap.ui.define([

], function () {
	var Utils = {
		getUrlId: function (sUrl) {
			var oMatches = sUrl.match(/^url\("?#([^"\)]+)"?\)$/);
			if (oMatches && oMatches[1]) {
				return oMatches[1];
			} else {
				return null;
			}
		}
	};
	return Utils;
});
