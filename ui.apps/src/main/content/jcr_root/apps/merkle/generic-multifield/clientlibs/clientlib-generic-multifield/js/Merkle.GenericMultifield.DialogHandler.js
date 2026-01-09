/**
 * @fileoverview Custom DialogHandler for the Generic Multifield component.
 * Provides a managed stack for nested Granite UI dialogs, ensuring data persistence
 * and proper UI lifecycle management (backdrops/cleanup) when navigating between
 * parent and child dialogs in AEM Authoring.
 *
 * @dependency {object} global - The window object containing Granite and Coral APIs.
 * @dependency {jQuery} $ - The jQuery library for DOM manipulation.
 * @dependency {Merkle.GenericMultifield} namespace - The namespace object.
 */
((global, $, namespace) => {

    "use strict";

    /**
     * @type {typeof Merkle.GenericMultifield.MultifieldHelper}
     * @description Local reference to the static utility helper class.
     * @const
     */
    const MultifieldHelper = namespace.MultifieldHelper;

    /**
     * @class DialogHandler
     * @classdesc Represents the Granite UI Dialog Frame extension for Generic Multifield.
     * This class manages a stack of nested dialogs, allowing authors to open child
     * dialogs from within a multifield without losing the state of the parent dialog.
     * It handles backdrop lifecycles, data persistence, and restoration.
     * @memberof Merkle.GenericMultifield
     */
    class DialogHandler {

        /**
         * Initializes the DialogHandler with default selectors, modes, and empty stacks.
         */
        constructor() {

            /**
             * @constant
             * @type {object}
             * @description Constant DOM selectors used for identifying dialog components.
             */
            this.SELECTORS = Object.freeze({
                /** @type {string} The tag name for the Coral Dialog component. */
                DIALOG: "coral-dialog",
                /** @type {string} The tag name for the Coral Dialog content area. */
                CONTENT: "coral-dialog-content"
            });

            /**
             * @constant
             * @type {object}
             * @description Enum for dialog execution modes.
             */
            this.DIALOG_MODE = Object.freeze({
                /** @type {string} Indicates the dialog was opened from a component instance. */
                COMPONENT: "COMPONENT",
                /** @type {string} Indicates the dialog was opened from Page Properties. */
                PAGE: "PAGE"
            });

            /**
             * Stack to store parent Granite dialog objects.
             *
             * @type {Array<Object>}
             * @private
             */
            this.parentDialogs = [];

            /**
             * Stack to store jQuery references of parent dialog content.
             * Used to restore form data when returning to a parent dialog.
             *
             * @type {Array<jQuery>}
             * @private
             */
            this.parentDialogsData = [];

            /**
             * The current active dialog mode.
             *
             * @type {string|null}
             * @private
             */
            this.dialogMode = null;
        }

        /**
         * Opens a new Granite dialog.
         * If a dialog is already open, it pushes the current dialog and its data
         * onto the stack before closing it to open the new one.
         *
         * @param {Object} dialog - The Granite dialog configuration object to open.
         * @public
         */
        openDialog(dialog) {
            let currentDialog = global.Granite.author.DialogFrame.currentDialog;
            if (currentDialog) {
                this.dialogMode = this.DIALOG_MODE.COMPONENT;

                if (this.parentDialogs.length === 0) {
                    currentDialog = this._extendOriginalDialog(currentDialog);
                }

                // push old dialog to parent stack
                this.parentDialogs.push(currentDialog);
                // save data of parent dialog
                this._saveDialogData(currentDialog);

                // close current dialog
                global.Granite.author.DialogFrame.closeDialog();
            } else {
                this.dialogMode = this.DIALOG_MODE.PAGE;
            }

            // create custom backdrop
            MultifieldHelper.createCustomBackdrop();

            // open a new dialog
            global.Granite.author.DialogFrame.openDialog(this._extendGenericMultifieldDialog(dialog));
        }

        /**
         * Extends the base Granite dialog with backdrop lifecycle management.
         *
         * @param {Object} originalDialog - The dialog object to extend.
         * @returns {Object} The extended dialog object.
         * @private
         */
        _extendOriginalDialog(originalDialog) {
            // save original onClose callback
            const _onCloseOrig = originalDialog.onClose;
            const _onReadyOrig = originalDialog.onReady;

            // overwrite onClose function of dialog
            originalDialog.onClose = function () {
                // if the original onClose callback was set, execute it first
                if ($.isFunction(_onCloseOrig)) {
                    _onCloseOrig();
                }
                MultifieldHelper.removeCustomBackdrop();
            }

            // overwrite onReady function of dialog if the "onCancel" callback has been
            // configured
            originalDialog.onReady = function () {
                MultifieldHelper.createCustomBackdrop();

                // if the original onReady callback was set, execute it first
                if ($.isFunction(_onReadyOrig)) {
                    _onReadyOrig();
                }
            }

            return originalDialog;
        }

        /**
         * Extends multifield-specific dialogs with asynchronous cleanup and restoration logic.
         *
         * @param {Object} dialog - The child dialog object created by the multifield.
         * @returns {Object} The extended dialog object.
         * @private
         */
        _extendGenericMultifieldDialog(dialog) {
            // save original onClose callback
            const _onCloseOrig = dialog.onClose;
            const _onReadyOrig = dialog.onReady;

            // overwrite onClose function of dialog
            dialog.onClose = () => {
                MultifieldHelper.removeMarkup(MultifieldHelper.CONST.ADD_ITEM_WORKFLOW);

                // if the original onClose callback was set, execute it first
                if ($.isFunction(_onCloseOrig)) {
                    _onCloseOrig();
                }

                global.Granite.author.DialogFrame.closeDialog();

                // execute function after fading effect has finished
                const waitToClose = () => {
                    // make sure that the currentDialog has been cleared
                    if (global.Granite.author.DialogFrame.isOpened()) {
                        setTimeout(waitToClose, 50);
                    } else {
                        // perform closing of the dialog via class method
                        this._performCloseDialog();
                    }
                };
                setTimeout(waitToClose, 50);
            }

            // overwrite onReady function of dialog if the "onCancel" callback has been configured
            dialog.onReady = () => {
                if ($.isFunction(_onReadyOrig)) {
                    _onReadyOrig();
                }

                // register callback function to dialog cancelled event
                if ($.isFunction(dialog.onCancel)) {
                    const config = dialog.getConfig();
                    const itemPath = config ? config.itemPath : null;
                    const cqDialogForm = MultifieldHelper.findDialog(itemPath, ".cq-dialog-cancel");

                    $(cqDialogForm, this.SELECTORS.DIALOG).click(dialog.onCancel);
                }
            }

            return dialog;
        }

        /**
         * Handles the transition from a closed child dialog back to its parent.
         * Pops the last parent from the stack and re-opens it, triggering
         * data restoration once the foundation content is loaded.
         *
         * @private
         */
        _performCloseDialog() {
            // get parent dialog
            const parentDialog = this.parentDialogs.pop();

            if (parentDialog) {
                // register handler to restore data after the content of the dialog has been loaded
                $(document).one("foundation-contentloaded", (e, data) => {
                    if (data && !data.restored) {
                        // restore data
                        this._restoreDialogData(parentDialog);
                    }
                });

                global.Granite.author.DialogFrame.openDialog(parentDialog);
            }

            // remove the custom backdrop on the last dialog after the fading effect has finished
            if (this.dialogMode === this.DIALOG_MODE.PAGE && this.parentDialogs.length === 0) {
                MultifieldHelper.removeCustomBackdrop();
            }
        }

        /**
         * Persists the current state of a dialog's content into the data stack.
         *
         * @param {Object} dialog - The dialog object whose data should be saved.
         * @private
         */
        _saveDialogData(dialog) {
            const dialogContainer = this._getDomElementForDialog(dialog);
            if (dialogContainer && dialogContainer.length) {
                // push content of the current dialog
                this.parentDialogsData.push($(this.SELECTORS.CONTENT, dialogContainer));
            }
        }

        /**
         * Restores the saved state of a dialog's content from the data stack.
         *
         * @param {Object} dialog - The dialog object to restore data to.
         * @private
         */
        _restoreDialogData(dialog) {
            const dialogContainer = this._getDomElementForDialog(dialog);
            if (dialogContainer && dialogContainer.length) {
                // replace content with previous
                $(this.SELECTORS.CONTENT, dialogContainer).replaceWith(this.parentDialogsData.pop());
                dialogContainer.trigger("foundation-contentloaded", {restored: true});
            }
        }

        /**
         * Retrieves the jQuery DOM element for a given Granite dialog object.
         * Locates the dialog based on its itemPath or editable path.
         *
         * @param {Object} dialog - The Granite dialog object.
         * @returns {jQuery} The jQuery-wrapped Coral Dialog element.
         * @private
         */
        _getDomElementForDialog(dialog) {
            let cqDialogForm;
            const config = dialog.getConfig();
            const itemPath = config ? config.itemPath : null;

            if (itemPath) {
                cqDialogForm = MultifieldHelper.findDialog(itemPath);
            } else {
                const path = dialog.editable ? dialog.editable.path : null;
                cqDialogForm = MultifieldHelper.findDialog(path);
            }

            return $(cqDialogForm, this.SELECTORS.DIALOG).closest(this.SELECTORS.DIALOG);
        }

    }

    /**
     * @memberof Merkle.GenericMultifield
     * @type {typeof DialogHandler}
     * @description Exposes the core {@link DialogHandler} class.
     */
    namespace.DialogHandler = DialogHandler;

})(window, window.jQuery, window.Merkle.GenericMultifield);
