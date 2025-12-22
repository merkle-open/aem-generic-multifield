/**
 * Helpers for the Generic Multi-field.
 */
(function ($, ns, channel, window, document, undefined) {
    "use strict";

    /**
     * Helpers for the Generic Multi-field in the ns namespace.
     */
    ns.Helper = {

        CONST: {
            ADD_ITEM_WORKFLOW: 'add-item',
            CUSTOM_BACKDROP_CLASS: 'q-dialog-backdrop-GenericMultifield',
            CUSTOM_BACKDROP_SELECTOR: '.cq-dialog-backdrop-GenericMultifield',
            CORAL_GENERIC_MULTIFIELD_SELECTOR: '.coral-GenericMultifield',
            ERROR_MESSAGE_REQUIRED: 'Error: Please fill out this field.',
            ERROR_MESSAGE_MIN: 'Error: At least {0} items must be created.',
            ERROR_MESSAGE_MAX: 'Error: At most {0} items can be created.'
        },

        /**
         * Displays the dialog backdrop over the content.
         */
        createCustomBackdrop: function () {
            var $customBackdrop = $(ns.Helper.CONST.CUSTOM_BACKDROP_SELECTOR),
                $originalBackdrop = $(".cq-dialog-backdrop");

            // don't create backdrop if it already exists
            if ($customBackdrop.length) {
                return;
            }

            // create backdrop
            $customBackdrop = $('<div class="' + ns.Helper.CONST.CUSTOM_BACKDROP_CLASS + '"></div>');
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
            var $customBackdrop = $(ns.Helper.CONST.CUSTOM_BACKDROP_SELECTOR);
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
        },

        /**
         * Adds a CSS markup class to the body element.
         * @param {String} markup CSS class name to add.
         */
        addMarkup: function (markup) {
            document.body.classList.add(markup);
        },

        /**
         * Removes a CSS markup class from the body element.
         * @param {String} markup CSS class name to remove.
         */
        removeMarkup: function (markup) {
            document.body.classList.remove(markup);
        },

        /**
         * Checks if the body element has a specific markup class.
         * @param {String} markup CSS class name to check for.
         * @returns {boolean} true if the class exists, false otherwise.
         */
        hasMarkup: function (markup) {
            return document.body.classList.contains(markup);
        },

        /**
         * Replaces white space with UTF-8 encoded space in a path.
         * @param {String} path to replace white space in.
         * @returns {String} path with white space replaced with UTF-8 encoded space.
         */
        replaceWhiteSpace(path) {
            return path.replace(/ /g, "%20");
        },

    }

}(jQuery, Merkle, jQuery(document), this, document));
