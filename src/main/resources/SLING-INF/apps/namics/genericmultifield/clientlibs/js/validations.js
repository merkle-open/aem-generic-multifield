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
	  candidate : ".coral-GenericMultiField:not([disabled]):not([data-renderreadonly=true])",
	  exclusion : ".coral-GenericMultiField *"
	});

	var FIELD_ERROR_KEY = "coral-validations.internal.field.error";
	var fieldErrorEl = $(document.createElement("span")).addClass("coral-Form-fielderror coral-Icon coral-Icon--alert coral-Icon--sizeS")
	    .attr({
	      "data-init" : "quicktip",
	      "data-quicktip-type" : "error"
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
	    var fieldErrorEl, $field, error, arrow;

      fieldErrorEl = $("<span class='coral-Form-fielderror coral-Icon coral-Icon--alert coral-Icon--sizeS' data-init='quicktip' data-quicktip-type='error' />");
      $field = $(el).closest(".coral-Form-field");

      $field.attr("aria-invalid", "true").toggleClass("is-invalid", true);
      $field.nextAll(".coral-Form-fieldinfo").addClass("u-coral-screenReaderOnly");

      error = $field.nextAll(".coral-Form-fielderror");

      if (error.length === 0) {
        arrow = $field.closest("form").hasClass("coral-Form--vertical") ? "right" : "top";

        fieldErrorEl.attr("data-quicktip-arrow", arrow).attr("data-quicktip-content", message).insertAfter($field);
      } else {
        error.data("quicktipContent", message);
      }
	  },
	  clear : function(el, ctx) {
	  	var $field = $(el).closest(".coral-Form-field");

	  	$field.removeAttr("aria-invalid").removeClass("is-invalid");

	  	$field.nextAll(".coral-Form-fielderror").tooltip("hide").remove();
	  	$field.nextAll(".coral-Form-fieldinfo").removeClass("u-coral-screenReaderOnly");
	  }
	});

	// perform validation every time generic multifield changed
	$(document).on("change", ".coral-GenericMultiField", function(e) {
		performValidation($(this));
	});

})(window, Granite.$, CUI);
