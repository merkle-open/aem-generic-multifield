/**
 * This part creates a new DialogFrame for the Generic Multifield. All changes
 * are marked with "// Differ from Original".
 */
;
(function($, ns, channel, window, document, undefined) {
	"use strict";

	/**
	 * This dialog frame represents the Granite UI Dialog Frame in the Generic
	 * MultiField (Namics) context. It is basically a copy of the DialogFrame.js
	 * with little extensions for the Generic MultiField.
	 * 
	 * @namespace
	 * @alias Namics.DialogFrame
	 */
	ns.GenericMultifieldDialogHandler = (function() {
		var self = {};

		/**
		 * Array of parent dialogs.
		 * 
		 * Save parent dialogs as a stack. Whenever a dialog gets closed, the parent
		 * gets opened (if existing).
		 */
		self.parentDialogs = [];

		/**
		 * Opens a new dialog.
		 * 
		 * Closes the current dialog and opens the new one.
		 * 
		 * @param (Object)
		 *          dialog Dialog to be opened
		 */
		self.openDialog = function(dialog) {
			if (!Granite.author.DialogFrame.currentDialog) {
				return;
			}

			// push old dialog to parent
			this.parentDialogs.push(Granite.author.DialogFrame.currentDialog);

			// create custom backdrop
			_createCustomBackdrop();

			// close current dialog
			Granite.author.DialogFrame.closeDialog();

			// open new dialog
			Granite.author.DialogFrame.openDialog(extendDialog(dialog));
		}

		/**
		 * Extends a dialog.
		 * 
		 * Extends the dialog object with necessary callback functions.
		 * 
		 * @param (Object)
		 *          dialog Dialog to be opened
		 */
		function extendDialog(dialog) {
			// save original onClose callback
			var _onCloseOrig = dialog.onClose, _onReadyOrig = dialog.onReady;

			// overwrite onClose function of dialog
			dialog.onClose = function() {
				// if original onClose callback was set, execute it first
				if ($.isFunction(_onCloseOrig)) {
					_onCloseOrig();
				}
				// perform closing of dialog
				_performCloseDialog();
			}

			// overwrite onReady function of dialog if "onCancel" callback has been
			// configured
			if ($.isFunction(dialog.onCancel)) {
				dialog.onReady = function() {
					// if original onReady callback was set, execute it first
					if ($.isFunction(_onReadyOrig)) {
						_onReadyOrig();
					}

					// register callback function to dialog cancelled event
					$("form.cq-dialog[action='" + dialog.getConfig().itemPath + "'] .cq-dialog-cancel").click(dialog.onCancel);
				}
			}

			return dialog;
		}

		/**
		 * Performs closing of current dialog.
		 * 
		 * Closes the current dialog and opens it's parent.
		 */
		function _performCloseDialog() {
			// execute function after fading effect has finished
			setTimeout(function waitToClose() {
				// make sure that Granite.author.DialogFrame.currentDialog has ben cleared
				if (Granite.author.DialogFrame.currentDialog) {
					setTimeout(waitToClose, 50);
				}

				// get parent dialog
				var parentDialog = self.parentDialogs.pop();
				// open parent dialog if it exists
				if (parentDialog) {
					Granite.author.DialogFrame.openDialog(parentDialog);
					// remove custom backdrop on the last dialog after fading effect has finished
					if (self.parentDialogs && self.parentDialogs.length == 0) {
						setTimeout(function() {
							_removeCustomBackdrop();
						}, Coral.mixin.overlay.FADETIME);
					}
				}
			}, Coral.mixin.overlay.FADETIME);
		}

		/**
		 * Helper function to create custom backdrop
		 */
		function _createCustomBackdrop() {
			var $backdrop = $(".cq-dialog-backdrop");
			if (!$(".cq-dialog-backdrop-genericmultifield").length) {
				var $backdropCopy = $backdrop.clone();
				$backdropCopy.removeClass().addClass("cq-dialog-backdrop-genericmultifield");
				$backdropCopy.insertAfter($backdrop);
			}
		}

		/**
		 * Helper function to remove custom backdrop
		 */
		function _removeCustomBackdrop() {
			$(".cq-dialog-backdrop-genericmultifield").remove();
		}

		return self;
	}());

}(jQuery, Namics, jQuery(document), this, document));
