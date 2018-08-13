/**
 * Helpers for the Generic Multifield.
 */
(function ($, ns, channel, window, document, undefined) {
    "use strict";

    /**
     * Helpers for the Generic Multifield in the ns namespace.
     */
    ns.Helper = {

        CUSTOM_BACKDROP_CLASS: "cq-dialog-backdrop-genericmultifield",
        CUSTOM_BACKDROP_SELECTOR: ".cq-dialog-backdrop-genericmultifield",

        manglePath: function (path) {
            if (!path) {
                return;
            }
            return path.replace(/\/(\w+):(\w+)/g, "/_$1_$2");
        },

        /**
         * Displays the dialog backdrop over the content
         *
         * @private
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
         * Hides the dialog backdrop over the content
         *
         * @private
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

}(jQuery, Namics, jQuery(document), this, document));
