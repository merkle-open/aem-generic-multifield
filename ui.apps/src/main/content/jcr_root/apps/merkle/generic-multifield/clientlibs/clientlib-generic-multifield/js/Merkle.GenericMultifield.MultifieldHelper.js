/**
 * @fileoverview Static utility helpers for the Generic Multifield.
 * Provides DOM manipulation tools, backdrop management, and AEM-specific path
 * mangling to facilitate nested dialog interactions.
 *
 * @dependency {jQuery} $ - The jQuery library.
 * @dependency {Merkle.GenericMultifield} namespace - The namespace object.
 * @dependency {HTMLDocument} document - The global document object.
 */
(($, namespace, document) => {
    "use strict";

    /**
     * @class MultifieldHelper
     * @classdesc Static utility class providing helper methods for the Generic Multifield.
     * This class cannot be instantiated.
     * @memberof Merkle.GenericMultifield
     */
    class MultifieldHelper {

        /**
         * @constructor
         * @throws {Error} Throws an error if an attempt is made to instantiate this class.
         * @private
         */
        constructor() {
            throw new Error("Cannot instantiate static utility class MultifieldHelper.");
        }

        /**
         * Displays a custom dialog backdrop over the content.
         * Detects the existence of the standard AEM dialog backdrop and inserts the
         * custom backdrop relative to it to maintain proper z-index stacking.
         * Uses requestAnimationFrame to ensure smooth CSS opacity transitions.
         *
         * @static
         * @public
         */
        static createCustomBackdrop() {
            const $existingBackdrop = $(this.CONST.CUSTOM_BACKDROP_SELECTOR);
            const $originalBackdrop = $(".cq-dialog-backdrop");

            // Don't create a backdrop if it already exists
            if ($existingBackdrop.length) {
                return;
            }

            // Create a backdrop using template literals
            const $customBackdrop = $(`<div class="${this.CONST.CUSTOM_BACKDROP_CLASS}"></div>`);

            if ($originalBackdrop.length) {
                $customBackdrop.insertAfter($originalBackdrop);
            } else {
                $(document.body).append($customBackdrop);
            }

            // Trigger CSS transition (next frame ensures transition plays)
            requestAnimationFrame(() => {
                $customBackdrop.css("opacity", "1");
            });
        }

        /**
         * Retrieves a Granite dialog form jQuery object based on the resource path.
         * Accounts for AEM path mangling (e.g., converting 'cq:dialog' to '_cq_dialog')
         * if the initial selection via the literal path fails.
         *
         * @param {string} path - The resource path (action attribute) of the dialog to fetch.
         * @param {string} [optionalSelector=""] - An additional CSS selector to narrow down the search.
         * @returns {jQuery} The jQuery-wrapped form element(s) found.
         * @static
         * @public
         */
        static findDialog(path, optionalSelector = "") {
            // Using backticks for cleaner string concatenation
            let cqDialogForm = $(`form.cq-dialog[action='${path}'] ${optionalSelector}`);

            if (!cqDialogForm.length) {
                const mangledPath = this._manglePath(path);
                cqDialogForm = $(`form.cq-dialog[action='${mangledPath}'] ${optionalSelector}`);
            }

            return cqDialogForm;
        }

        /**
         * Handles AEM-specific path mangling for Sling resource types.
         * Replaces colon-separated namespaces (e.g., /cq:dialog) with
         * underscore-separated names (e.g., /_cq_dialog).
         *
         * @param {string} path - The path string to mangle.
         * @returns {string} The mangled path.
         * @static
         * @private
         */
        static _manglePath(path) {
            if (!path) return "";
            return path.replace(/\/(\w+):(\w+)/g, "/_$1_$2");
        }

        /**
         * Hides and removes the custom dialog backdrop.
         * Initiates a CSS fade-out transition and removes the element from the DOM
         * upon completion. Includes a safety timeout to ensure removal if the
         * transitionend event fails to fire.
         *
         * @static
         * @public
         */
        static removeCustomBackdrop() {
            const $customBackdrop = $(this.CONST.CUSTOM_BACKDROP_SELECTOR);
            if (!$customBackdrop.length) return;

            $customBackdrop.one("transitionend", () => {
                $customBackdrop.remove();
            });

            $customBackdrop.css("opacity", "0");

            // Safety timeout: remove the backdrop after 1s if the transition event fails
            setTimeout(() => {
                if ($customBackdrop.parent().length) {
                    $customBackdrop.remove();
                }
            }, 1000);
        }

        /**
         * Adds a specific CSS class markup to the document body.
         *
         * @param {string} markup - The class name to add.
         * @static
         * @public
         */
        static addMarkup(markup) {
            document.body.classList.add(markup);
        }

        /**
         * Removes a specific CSS class markup from the document body.
         *
         * @param {string} markup - The class name to remove.
         * @static
         * @public
         */
        static removeMarkup(markup) {
            document.body.classList.remove(markup);
        }

        /**
         * Checks if the document body contains a specific CSS class markup.
         *
         * @param {string} markup - The class name to check.
         * @returns {boolean} True if the class exists on the body.
         * @static
         * @public
         */
        static hasMarkup(markup) {
            return document.body.classList.contains(markup);
        }

        /**
         * Replaces standard white space characters with UTF-8 encoded space (%20).
         *
         * @param {string} path - The string to process.
         * @returns {string} The encoded string.
         * @static
         * @public
         */
        static replaceWhiteSpace(path) {
            if (!path) return "";
            return path.replace(/ /g, "%20");
        }
    }

    /**
     * @static
     * @constant
     * @type {object}
     * @readonly
     * @description Constant values used across the Generic Multifield library.
     */
    MultifieldHelper.CONST = Object.freeze({
        /** @type {string} Class name added to the document body during the item addition workflow. */
        ADD_ITEM_WORKFLOW: 'add-item',
        /** @type {string} The CSS class name for the custom multifield backdrop element. */
        CUSTOM_BACKDROP_CLASS: 'q-dialog-backdrop-GenericMultifield',
        /** @type {string} The jQuery selector used to target the custom multifield backdrop. */
        CUSTOM_BACKDROP_SELECTOR: '.cq-dialog-backdrop-GenericMultifield',
        /** @type {string} The jQuery selector for identifying the Coral Generic Multifield container. */
        CORAL_GENERIC_MULTIFIELD_SELECTOR: '.coral-GenericMultifield',
        /** @type {string} Default error message string for mandatory field validation. */
        ERROR_MESSAGE_REQUIRED: 'Error: Please fill out this field.',
        /** @type {string} Validation message template for the minimum number of items required. */
        ERROR_MESSAGE_MIN: 'Error: At least {0} items must be created.',
        /** @type {string} Validation message template for the maximum number of items allowed. */
        ERROR_MESSAGE_MAX: 'Error: At most {0} items can be created.'
    });

    /**
     * @memberof Merkle.GenericMultifield
     * @type {typeof MultifieldHelper}
     * @description Exposes the static utility class {@link MultifieldHelper} containing constants, settings, and helper methods.
     */
    namespace.MultifieldHelper = MultifieldHelper;

})(window.jQuery, window.Merkle.GenericMultifield, window.document);
