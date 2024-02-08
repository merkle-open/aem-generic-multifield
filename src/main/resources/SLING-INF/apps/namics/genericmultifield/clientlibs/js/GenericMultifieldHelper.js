/**
 * Helpers for the Generic Multi-field.
 */
(function ($, ns, channel, window, document, undefined) {
    "use strict";

    /**
     * Helpers for the Generic Multi-field in the ns namespace.
     */
    ns.Helper = {

        CUSTOM_BACKDROP_CLASS: "cq-dialog-backdrop-GenericMultiField",
        CUSTOM_BACKDROP_SELECTOR: ".cq-dialog-backdrop-GenericMultiField",

        /**
         * Displays the dialog backdrop over the content.
         */
        createCustomBackdrop: function () {
            var $customBackdrop = $(ns.Helper.CUSTOM_BACKDROP_SELECTOR),
                $originalBackdrop = $(".cq-dialog-backdrop");

            // don't create backdrop if it already exists
            if ($customBackdrop.length) {
                return;
            }

            // create backdrop
            $customBackdrop = $('<div class="' + ns.Helper.CUSTOM_BACKDROP_CLASS + '"></div>');
            if ($originalBackdrop.length) {
                $customBackdrop.insertAfter($originalBackdrop);
            } else {
                $("body").append($customBackdrop);
            }

            // backdrop has CSS transition to fade in
            $customBackdrop.css("opacity", "1");
        },

        /**
         * Retrieves dialog object.
         *
         * @param path of dialog to fetch.
         * @param optionalSelector to specific dialog selection.
         * @returns {Object} found dialog.
         */
        findDialog: function (path, optionalSelector = "") {
            var cqDialogForm = $("form.cq-dialog[action='" + path + "'] " + optionalSelector);
            if (cqDialogForm === undefined || !cqDialogForm.length) {
                cqDialogForm = $("form.cq-dialog[action='" + this._manglePath(path) + "'] " + optionalSelector);
            }
            return cqDialogForm;
        },

        /**
         * Mangle string value.
         *
         * @param path to mangle.
         * @returns {String} adjusted path value.
         * @private
         */
        _manglePath: function (path) {
            if (!path) {
                return;
            }
            return path.replace(/\/(\w+):(\w+)/g, "/_$1_$2");
        },

        /**
         * Hides the dialog backdrop over the content.
         */
        removeCustomBackdrop: function () {
            var $customBackdrop = $(ns.Helper.CUSTOM_BACKDROP_SELECTOR);
            $customBackdrop.one("transitionend", function () {
                $customBackdrop.remove();
            });
            $customBackdrop.css("opacity", "0");

            // remove backdrop after a maximum of 1s if no transition event was fired
            setTimeout(function waitToClose() {
                // remove backdrop
                if ($customBackdrop.length) {
                    $customBackdrop.remove();
                }
            }, 1000);
        }

    }

}(jQuery, Merkle, jQuery(document), this, document));
