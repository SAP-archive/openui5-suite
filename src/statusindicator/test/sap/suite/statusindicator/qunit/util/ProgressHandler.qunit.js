sap.ui.define([
	"sap/suite/statusindicator/util/ProgressHandler",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (ProgressHandler, sinon) {
	"use strict";

	QUnit.module("ProgressHandler");

	QUnit.test("Test successful finish", function (assert) {
		var done = assert.async();
		var fnProgress = function (oInnerHandler) {
			assert.equal(typeof oInnerHandler.finish, "function", "Passed object contains finish function");
			assert.equal(typeof oInnerHandler.stop, "function", "Passed object contains stop function");
			assert.equal(typeof oInnerHandler.isCanceled, "function", "Passed object contains isCanceled function");

			setTimeout(function () {
				oInnerHandler.finish();
			}, 10);
		};

		var oProgressHandler = new ProgressHandler(fnProgress);
		sinon.spy(oProgressHandler, "finish");

		assert.notOk(oProgressHandler.isCanceled(), "Progress handler was not canceled");
		assert.notOk(oProgressHandler.isInProgress(), "Progress handler is not in progress");
		var oProgressPromise = oProgressHandler.start();

		assert.ok(oProgressPromise instanceof Promise, "Start method returns promise object");
		assert.ok(oProgressHandler.isInProgress(), "Progress handler is in progress");

		oProgressPromise.then(function () {
			assert.ok(oProgressHandler.finish.calledOnce, "Finish on ProgressHandler was called");
			assert.notOk(oProgressHandler.isInProgress(), "Progress handler is not in progress");
			assert.notOk(oProgressHandler.isCanceled(), "Progress handler was not canceled");
			done();
		});
	});

	QUnit.test("Test stopping the progress", function (assert) {
		var done = assert.async();
		var sExpectedReason = "Custom Reason";
		var bProgressFunctionCalled = false;
		var fnProgress = function (oProgressHandler) {
			bProgressFunctionCalled = true;
			setTimeout(function () {
				oProgressHandler.stop(sExpectedReason);
			}, 10);
		};

		var oProgressHandler = new ProgressHandler(fnProgress);

		assert.notOk(oProgressHandler.isCanceled(), "Progress handler was not canceled");
		assert.notOk(oProgressHandler.isInProgress(), "Progress handler is not in progress");
		var oProgressPromise = oProgressHandler.start();

		assert.ok(oProgressPromise instanceof Promise, "Start method returns promise object");
		assert.ok(oProgressHandler.isInProgress(), "Progress handler is in progress");

		oProgressPromise.then(function (sActualReason) {
			assert.ok(bProgressFunctionCalled, "Progress function called");
			assert.equal(sActualReason, sExpectedReason, "Resolved with given reason");
			assert.notOk(oProgressHandler.isInProgress(), "Progress handler is not in progress");
			assert.notOk(oProgressHandler.isCanceled(), "Progress handler was not canceled");
			done();
		});
	});

	QUnit.test("Test cancelling the progress", function (assert) {
		var done = assert.async();
		var sExpectedReason = "Custom Reason";
		var bProgressFunctionCalled = false;
		var fnProgress = function (oInnerHandler) {
			bProgressFunctionCalled = true;

			function dummyProgress() {
				if (oInnerHandler.isCanceled()) {
					oInnerHandler.stop(sExpectedReason);
					return;
				}

				setTimeout(dummyProgress, 10);
			}

			setTimeout(dummyProgress, 10);
		};

		var oProgressHandler = new ProgressHandler(fnProgress);

		assert.notOk(oProgressHandler.isCanceled(), "Progress handler was not canceled");
		assert.notOk(oProgressHandler.isInProgress(), "Progress handler is not in progress");
		var oProgressPromise = oProgressHandler.start();

		assert.ok(oProgressPromise instanceof Promise, "Start method returns promise object");
		assert.ok(oProgressHandler.isInProgress(), "Progress handler is in progress");

		setTimeout(function () {
			oProgressHandler.cancel();
			assert.ok(oProgressHandler.isCanceled(), "Progress handler was canceled");
		}, 12);

		oProgressPromise.then(function (sActualReason) {
			assert.ok(bProgressFunctionCalled, "Progress function called");
			assert.equal(sActualReason, sExpectedReason, "Resolved with given reason");
			assert.notOk(oProgressHandler.isInProgress(), "Progress handler is not in progress");
			assert.ok(oProgressHandler.isCanceled(), "Progress handler was canceled");
			done();
		});

	});

});
