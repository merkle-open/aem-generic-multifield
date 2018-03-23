/**
 * Helpers for the Generic Multifield.
 */
(function ($, ns, channel, window, document, undefined) {
    "use strict";

    /**
     * Helpers for the Generic Multifield in the ns namespace.
     */
    ns.Helper = {

        manglePath: function (path) {
            if (!path) {
                return;
            }
            return path.replace(/\/(\w+):(\w+)/g, "/_$1_$2");
        }

    }

}(jQuery, Namics, jQuery(document), this, document));
