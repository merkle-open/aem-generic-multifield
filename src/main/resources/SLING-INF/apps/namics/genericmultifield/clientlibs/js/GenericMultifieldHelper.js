/**
 * This part creates a new DialogFrame for the Generic Multifield. All changes are marked with "// Differ from Original".
 */
;(function ($, ns, channel, window, document, undefined) {
    "use strict";

    /**
     * This dialog frame represents the Granite UI Dialog Frame in the Generic MultiField (Namics) context.
     * It is basically a copy of the DialogFrame.js with little extensions for the Generic MultiField.
     *
     * @namespace
     * @alias Namics.DialogFrame
     */
    ns.Helper = {

  		manglePath : function(path) {
  			if (!path) {
  				return;
  			}
  			return path.replace(/\/(\w+):(\w+)/g, "/_$1_$2");
  		}

    }

}(jQuery, Namics, jQuery(document), this, document));

