/**
 * This part creates a new DialogFrame for the Generic Multifield. All changes are marked with "// Differ from Original".
 */
;(function ($, ns, channel, window, document, undefined) {
    "use strict";

    // Differ from Original: Set current loader with Granite loader
    var loader = Granite.author.DialogFrame.loader;

    // Differ from Original: Set current UI with Granite UI.
    ns.ui = Granite.author.ui;

    /**
     * This dialog frame represents the Granite UI Dialog Frame in the Generic MultiField (Namics) context.
     * It is basically a copy of the DialogFrame.js with little extensions for the Generic MultiField.
     *
     * @namespace
     * @alias Namics.DialogFrame
     */
    ns.DialogFrame = (function () {
        var self = {};

        /**
         * @member {Granite.author.ui.Dialog} Granite.author.DialogFrame.currentDialog Currently opened dialog
         */
        self.currentDialog = null;

        /**
         * @member {jQuery} Granite.author.DialogFrame.currentFloatingDialog Currently opened floating dialog
         */
        self.currentFloatingDialog = null;

        self.originDialog = null;

        /**
         * @member {object} Granite.author.DialogFrame.loader Contains the different dialog loaders (inline, newpage, auto).
         * Other Editors could extend it.
         */
        self.loader = loader;

        /**
         * @member Granite.author.DialogFrame.dialogMode {string} Mode in which dialogs will be loaded (configuration happens at the Editor level)
         */
        self.dialogMode = null;

        function handleDragStart() {
            if (!self.currentFloatingDialog) {
                return;
            }
        }

        function handleResize() {
            if (!self.currentFloatingDialog) {
                return;
            }
        }

        function handleDialogReady() {
            if (!self.isOpened()) {
                return;
            }

            ns.ui.helpers.clearWait();

            execute('onReady');
        }

        function handleDialogSuccess() {
            if (!self.isOpened()) {
                return;
            }

            execute('onSuccess');
        }

        function handleDialogClosed() {
            if (!self.isOpened()) {
                return;
            }

            execute('onClose');

            self.closeDialog();
        }

        function handleDialogFocused() {
            if (!self.isOpened()) {
                return;
            }

            execute('onFocus');
        }

        function execute(listener) {
            if (self.currentDialog[listener]) {
                self.currentDialog[listener](self.currentDialog, self.currentFloatingDialog);
            }
        }

        function bindEvents() {
            channel.on('mousedown.dialogframe', '.cq-dialog-floating .cq-dialog-header', handleDragStart);
            /**
             * Update floating dialog position when the side panel gets resized
             */
            channel.on('cq-sidepanel-resized.dialogframe', handleResize);

            channel.on('dialog-ready.dialogframe', handleDialogReady);

            channel.on('dialog-success.dialogframe', handleDialogSuccess);

            channel.on('dialog-closed.dialogframe', handleDialogClosed);

            channel.on('focus.dialogframe', '.cq-dialog', handleDialogFocused);

            /**
             * Update floating dialog position when the document gets resized
             */
            channel.on('resize.dialog', $.debounce(500, false, handleResize));
        }

        function unbindEvents() {
            channel
                .off('mousedown.dialogframe')
                .off('cq-sidepanel-resized.dialogframe')
                .off('dialog-ready.dialogframe')
                .off('dialog-success.dialogframe')
                .off('dialog-closed.dialogframe')
                .off('resize.dialog')
                .off('focus.dialogframe');
        }

        /**
         * Opens the passed dialog. Also working with Generic MultiFields
         * @function Namics.DialogFrame.openDialog
         * @memberOf Namics.DialogFrame
         * @param {Granite.author.ui.Dialog} dialog The dialog to open
         */
        self.openDialog = function (dialog) {
            var cfg = dialog.getConfig(),
                // first check the global loading mode(editor specific) else fallback to dialog configuration
                loadingMode = this.dialogMode || cfg.loadingMode;


            if (self.isOpened()) {
                //return;
            }

            if (!loader.hasOwnProperty(loadingMode)) {
                return;
            }


            this.currentDialog = dialog;

            // Differ from Original: store actual dialog in originDialog
            if (!cfg.isGenericMultifield){
                this.originDialog = dialog;
            }

            loader[loadingMode](cfg.src, dialog);

            bindEvents();

            execute('onOpen');
        };

        /**
         * Closes the currently opened dialog. Also working with Generic MultiFields
         * @function Namics.DialogFrame.closeDialog
         * @memberOf Namics.DialogFrame
         */
        self.closeDialog = function () {

            if (!self.isOpened()) {
                return;
            }

            var cfg = self.currentDialog.getConfig();

            ns.ui.helpers.clearWait();

            if (self.currentFloatingDialog) {
                self.currentFloatingDialog.remove();
            }

            this.currentFloatingDialog = null;
            this.currentDialog = null;

            // Differ from Original: if the generic multifield dialog has been closed. Set the currentDialog back to the original dialog
            if (cfg.isGenericMultifield){

                //add the backdrop again if only the generic multifield item has been closed.
                var $backdrop = jQuery(".cq-dialog-backdrop");
                var $sidepanel = jQuery("#SidePanel");

                $backdrop.one("transitionend", function() {
                    $backdrop.show();
                    $backdrop.addClass("is-open");
                    $sidepanel.addClass("cq-dialog-is-open");
                });

                //set the current Dialog back to its original
                this.currentDialog = this.originDialog;
            } else {
                this.currentFloatingDialog = null;
            }
        };

        /**
         * Indicates if a dialog is still opened
         * @function Namics.DialogFrame.isOpened
         * @memberOf Namics.DialogFrame
         *
         */
        self.isOpened = function () {
            return !!this.currentDialog;
        };

        return self;
    }());

}(jQuery, Namics, jQuery(document), this, document));

