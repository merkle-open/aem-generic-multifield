/**
 * This part creates a new DialogFrame for the Generic Multi-field.
 */
;
(function ($, ns, channel, window, document, undefined) {
    "use strict";

    /**
     * This dialog frame represents the Granite UI Dialog Frame in the Generic
     * MultiField (Merkle) context. It is basically a copy of the DialogFrame.js
     * with little extensions for the Generic MultiField.
     *
     * @namespace
     * @alias Merkle.DialogFrame
     */
    ns.GenericMultifieldDialogHandler = (function () {
        var self = {};
        var DIALOG_SELECTOR = "coral-dialog";
        var DIALOG_CONTENT_SELECTOR = "coral-dialog-content";
        var DIALOG_MODE = {
            COMPONENT: "COMPONENT",
            PAGE: "PAGE"
        };

        /**
         * Array of parent dialogs.
         *
         * Save parent dialogs as a stack. Whenever a dialog gets closed, the parent
         * gets opened (if existing).
         */
        self.parentDialogs = [];
        /**
         * Array of form data from parent dialogs.
         *
         * Save form data of parent dialogs as a stack. Whenever a dialog gets
         * closed, the parent gets opened (if existing) and the data gets restored.
         */
        self.parentDialogsData = [];
        /**
         * Mode of dialog.
         *
         * Specifies if dialog was loaded by a component's dialog or by a page
         * properties dialog.
         */
        self.dialogMode;

        /**
         * Opens a new dialog.
         * Closes the current dialog and opens the new one.
         *
         * @param {Object} dialog dialog to be opened.
         */
        self.openDialog = function (dialog) {
            var currentDialog = Granite.author.DialogFrame.currentDialog;
            if (currentDialog) {
                self.dialogMode = DIALOG_MODE.COMPONENT;

                if (self.parentDialogs.length === 0) {
                    currentDialog = _extendOriginalDialog(currentDialog);
                }

                // push old dialog to parent
                self.parentDialogs.push(currentDialog);
                // save data of parent dialog
                _saveDialogData(currentDialog);

                // close current dialog
                Granite.author.DialogFrame.closeDialog();
            } else {
                self.dialogMode = DIALOG_MODE.PAGE;
            }

            // create custom backdrop
            ns.Helper.createCustomBackdrop();

            // open new dialog
            Granite.author.DialogFrame.openDialog(_extendGenericMultiFieldDialog(dialog));
        }

        /**
         * Extend original dialog.
         * Extends the dialog object with necessary callback functions.
         *
         * @param {Object} originalDialog dialog to be extended.
         * @returns {Object} extended dialog.
         * @private
         */
        function _extendOriginalDialog(originalDialog) {
            // save original onClose callback
            var _onCloseOrig = originalDialog.onClose, _onReadyOrig = originalDialog.onReady;

            // overwrite onClose function of dialog
            originalDialog.onClose = function () {
                // if original onClose callback was set, execute it first
                if ($.isFunction(_onCloseOrig)) {
                    _onCloseOrig();
                }

                ns.Helper.removeCustomBackdrop();
            }

            // overwrite onReady function of dialog if "onCancel" callback has been
            // configured
            originalDialog.onReady = function () {
                ns.Helper.createCustomBackdrop();

                // if original onReady callback was set, execute it first
                if ($.isFunction(_onReadyOrig)) {
                    _onReadyOrig();
                }
            }

            return originalDialog;
        }

        /**
         * Extend dialogs created by generic multi-field.
         * Extends the dialog object with necessary callback functions.
         *
         * @param {Object} dialog dialog to be extended.
         * @returns {Object} extended dialog.
         * @private
         */
        function _extendGenericMultiFieldDialog(dialog) {
            // save original onClose callback
            var _onCloseOrig = dialog.onClose, _onReadyOrig = dialog.onReady;

            // overwrite onClose function of dialog
            dialog.onClose = function () {
                ns.Helper.removeMarkup(ns.Helper.CONST.ADD_ITEM_WORKFLOW);

                // if original onClose callback was set, execute it first
                if ($.isFunction(_onCloseOrig)) {
                    _onCloseOrig();
                }

                Granite.author.DialogFrame.closeDialog();

                // execute function after fading effect has finished
                setTimeout(function waitToClose() {
                    // make sure that currentDialog has been cleared
                    if (Granite.author.DialogFrame.isOpened()) {
                        setTimeout(waitToClose, 50);
                    }

                    // perform closing of dialog
                    _performCloseDialog();
                }, 50);
            }

            // overwrite onReady function of dialog if "onCancel" callback has been
            // configured
            dialog.onReady = function () {
                // if original onReady callback was set, execute it first
                if ($.isFunction(_onReadyOrig)) {
                    _onReadyOrig();
                }

                // register callback function to dialog cancelled event
                if ($.isFunction(dialog.onCancel)) {
                    var cqDialogForm = ns.Helper.findDialog(dialog.getConfig().itemPath, ".cq-dialog-cancel");
                    $(cqDialogForm, DIALOG_SELECTOR).click(dialog.onCancel);
                }
            }

            return dialog;
        }

        /**
         * Performs closing of current dialog.
         * Closes the current dialog and opens its parent.
         */
        function _performCloseDialog() {
            // get parent dialog
            var parentDialog = self.parentDialogs.pop();
            // open parent dialog if it exists
            if (parentDialog) {
                // register handler to restore data after the content of the dialog has been loaded
                $(document).on("foundation-contentloaded", function restoreDataHandler(e, data) {
                    if (!data.restored) {
                        // restore data
                        _restoreDialogData(parentDialog);
                    }

                    // unregister handler
                    $(document).off("foundation-contentloaded", restoreDataHandler);
                });

                Granite.author.DialogFrame.openDialog(parentDialog);
            }

            // remove custom backdrop on the last dialog after fading effect has finished
            if (self.dialogMode === DIALOG_MODE.PAGE && self.parentDialogs.length === 0) {
                ns.Helper.removeCustomBackdrop();
            }
        }

        /**
         * Saves the dialog and it's data
         *
         * @param {Object} dialog from which to retrieve the data from.
         * @private
         */
        function _saveDialogData(dialog) {
            var dialogContainer = _getDomElementForDialog(dialog);
            if (dialogContainer) {
                // push content of current dialog
                self.parentDialogsData.push($(DIALOG_CONTENT_SELECTOR, dialogContainer));
            }
        }

        /**
         * Restores the dialog and it's data.
         *
         * @param {Object} dialog to be restored.
         * @private
         */
        function _restoreDialogData(dialog) {
            var dialogContainer = _getDomElementForDialog(dialog);
            if (dialogContainer) {
                // replace content with previous
                $(DIALOG_CONTENT_SELECTOR, dialogContainer).replaceWith(self.parentDialogsData.pop());
                dialogContainer.trigger("foundation-contentloaded", {restored: true});
            }
        }

        /**
         * Returns DOM element for dialog
         *
         * @param {Object} dialog to retrieve.
         * @returns {Object} self jQuery object.
         * @private
         */
        function _getDomElementForDialog(dialog) {

            var cqDialogForm;
            if (dialog.getConfig().itemPath) {
                cqDialogForm = ns.Helper.findDialog(dialog.getConfig().itemPath);
            } else {
                cqDialogForm = ns.Helper.findDialog(dialog.editable.path);
            }
            return $(cqDialogForm, DIALOG_SELECTOR).closest(DIALOG_SELECTOR);
        }

        return self;
    }());

}(jQuery, Merkle, jQuery(document), this, document));
