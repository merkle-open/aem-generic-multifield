/**
 * This part creates a new DialogFrame for the Generic Multifield.
 */
;
(function ($, ns, channel, window, document, undefined) {
    "use strict";

    /**
     * This dialog frame represents the Granite UI Dialog Frame in the Generic
     * MultiField (Namics) context. It is basically a copy of the DialogFrame.js
     * with little extensions for the Generic MultiField.
     *
     * @namespace
     * @alias Namics.DialogFrame
     */
    ns.GenericMultifieldDialogHandler = (function () {
        var self = {};
        var DIALOG_SELECTOR = "coral-dialog.cq-Dialog";
        var DIALOG_CONTENT_SELECTOR = DIALOG_SELECTOR + " coral-dialog-content.coral-Dialog-content";

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
         * Opens a new dialog.
         *
         * Closes the current dialog and opens the new one.
         *
         * @param (Object)
         *          dialog Dialog to be opened
         */
        self.openDialog = function (dialog) {
            if (!Granite.author.DialogFrame.currentDialog) {
                throw new Error("Parent dialog can't be null");
            }

            // push old dialog to parent
            self.parentDialogs.push(Granite.author.DialogFrame.currentDialog);
            // save data of parent dialog
            _saveDialogData();

            // create custom backdrop
            _createCustomBackdrop();

            // close current dialog
            Granite.author.DialogFrame.closeDialog();

            // open new dialog
            Granite.author.DialogFrame.openDialog(_extendDialog(dialog));
        }

        /**
         * Extends a dialog.
         *
         * Extends the dialog object with necessary callback functions.
         *
         * @param (Object)
         *          dialog Dialog to be opened
         */
        function _extendDialog(dialog) {
            // save original onClose callback
            var _onCloseOrig = dialog.onClose, _onReadyOrig = dialog.onReady;

            // overwrite onClose function of dialog
            dialog.onClose = function () {
                // if original onClose callback was set, execute it first
                if ($.isFunction(_onCloseOrig)) {
                    _onCloseOrig();
                }

                // execute function after fading effect has finished
                setTimeout(function waitToClose() {
                    // make sure that currentDialog has been cleared
                    if (Granite.author.DialogFrame.currentDialog) {
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
                    $("form.cq-dialog[action='" + dialog.getConfig().itemPath + "'] .cq-dialog-cancel", DIALOG_SELECTOR).click(dialog.onCancel);
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
            // get parent dialog
            var parentDialog = self.parentDialogs.pop();
            // open parent dialog if it exists
            if (parentDialog) {
                var restoreDataHandler = function (e, data) {
                    if (!data.restored) {
                        // restore data
                        _restoreDialogData();
                    }

                    // remove custom backdrop on the last dialog after fading effect has finished
                    if (self.parentDialogs && self.parentDialogs.length == 0) {
                        _removeCustomBackdrop();
                    }

                    // unregister handler
                    $(document).off("foundation-contentloaded", restoreDataHandler);
                };

                // register handler to restore data after the content of the dialog has been loaded
                $(document).on("foundation-contentloaded", restoreDataHandler);

                Granite.author.DialogFrame.openDialog(parentDialog);
            }
        }

        /**
         * @param (Object)
         *          dialog Saves the dialog and it's data
         */
        function _saveDialogData() {
            self.parentDialogsData.push($(DIALOG_CONTENT_SELECTOR));
        }

        /**
         * Restores the dialog and it's data
         *
         * @param (Object)
         *          dialog
         */
        function _restoreDialogData() {
            // replace content with previous
            $(DIALOG_CONTENT_SELECTOR).replaceWith(self.parentDialogsData.pop());
            // trigger "foundation-contentloaded" event with data restored=true
            $(DIALOG_SELECTOR).trigger("foundation-contentloaded", {restored: true});
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
