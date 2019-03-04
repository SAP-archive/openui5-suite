/*!
 * ${copyright}
 */

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/base/Object"
], function (jQuery, BaseObject) {
	"use strict";

	var mLoadedShapes = {};

	/**
	 * Constructor for a new ShapeFactory.
	 *
	 * @class
	 * Asynchronous loading predefined shapes from SVG file.
	 *
	 * @extends sap.ui.base.Object
	 *
	 * @constructor
	 * @private
	 * @since 1.60.0
	 * @alias sap.suite.statusindicator.shapes.ShapeFactory
	 */
	var ShapeFactory = BaseObject.extend("sap.suite.statusindicator.shapes.ShapeFactory");

	/**
	 *
	 * @param sId
	 * @returns {Promise}
	 */
	ShapeFactory.prototype.getShapeById = function (sId) {
		var mLoadedShapes = this._getLoadedShapes(),
			sSvg = mLoadedShapes[sId] || null;

		if (!sSvg) {
			return new Promise(function (resolve, reject) {
				jQuery.ajax({
					url: sap.ui.require.toUrl("sap/suite/statusindicator") + "/shapes/" + sId + ".svg",
					dataType: "text"
				})
					.done(function (oData) {
						mLoadedShapes[sId] = oData;
						resolve(oData);
					})
					.fail(function (oError) {
						reject(oError);
					});
			});
		}
		return Promise.resolve(sSvg);
	};

	ShapeFactory.prototype._getLoadedShapes = function () {
		return mLoadedShapes;
	};

	ShapeFactory.prototype._removeAllLoadedShapes = function () {
		mLoadedShapes = {};
	};

	return ShapeFactory;

});