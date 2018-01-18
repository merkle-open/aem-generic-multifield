/**
 * Validates the generic multifield's minimum and maximum number of elements
 * restriction.
 */

(function(window, $, CUI) {
	"use strict";

	/**
	 * Performs the validation of the generic multifield
	 */
	function performValidation(el) {
		var api = el.adaptTo("foundation-validation");
		if (api) {
			api.checkValidity();
			api.updateUI();
		}
	}

	// get global foundation registry
	var registry = $(window).adaptTo("foundation-registry");

	// register selector for generic multifield
	registry.register("foundation.validation.selector", {
	  submittable : ".coral-GenericMultiField",
	  candidate : ".coral-GenericMultiField"
	});

	// register validator for generic multifield
	registry.register("foundation.validation.validator", {
	  selector : ".coral-GenericMultiField",
	  validate : function(el) {
		  var field = $(el.closest(".coral-Form-field")), items = field.find(".coral-GenericMultiField-list li"), minElements = field
		      .data("minelements"), maxElements = field.data("maxelements");

		  // validate if minElements restriction is met
		  if (items && !isNaN(minElements) && items.length < minElements) {
			  return Granite.I18n.get('At least {0} items must be created', minElements);
		  }
		  // validate if maxElements restriction is met
		  if (items && !isNaN(maxElements) && items.length > maxElements) {
			  return Granite.I18n.get('At most {0} items can be created', maxElements);
		  }

		  return null;
	  },
	  show : function(el, message, ctx) {
		  $(el).closest(".coral-Form-field").attr("aria-invalid", "true").toggleClass("is-invalid", true);
		  ctx.next();
	  },
	  clear : function(el, ctx) {
		  $(el).closest(".coral-Form-field").removeAttr("aria-invalid").removeClass("is-invalid");
		  ctx.next();
	  }
	});

	// perform validation every time generic multifield changed
	$(document).on("change", ".coral-GenericMultiField", function(e) {
		performValidation($(this));
	});

})(window, Granite.$, CUI);
