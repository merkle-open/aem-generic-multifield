/**
 * Validates the generic multifield's minimum and maximum number of elements
 * restriction.
 */

(function (window, $, CUI) {
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

    // register adapter for generic multifield
    registry.register("foundation.adapters", {
        type: "foundation-field",
        selector: ".coral-GenericMultiField",
        adapter: function (el) {
            var $el = $(el);

            return {
                getName: function () {
                    return $el.data("name");
                },
                setName: function (name) {
                    $el.data("name", name);
                },
                isDisabled: function () {
                    return !!$el.attr("disabled");
                },
                setDisabled: function (disabled) {
                    if (disabled === true) {
                        $el.attr("disabled", "disabled");
                    }
                },
                isInvalid: function () {
                    return $el.attr("aria-invalid") === "true";
                },
                setInvalid: function (invalid) {
                    $el.attr("aria-invalid", !!invalid ? "true" : "false").toggleClass("is-invalid", invalid);
                },
                isRequired: function () {
                    return $el.attr("aria-required") === "true";
                },
                setRequired: function (required) {
                    $el.attr("aria-required", !!required ? "true" : "false");
                }
            };
        }
    });

    // register selector for generic multifield
    registry.register("foundation.validation.selector", {
        submittable: ".coral-GenericMultiField",
        candidate: ".coral-GenericMultiField:not([disabled]):not([data-renderreadonly=true])",
        exclusion: ".coral-GenericMultiField *"
    });

    var FIELD_ERROR_KEY = "coral-validations.internal.field.error";
    var fieldErrorEl = $(document.createElement("span")).addClass("coral-Form-fielderror coral-Icon coral-Icon--alert coral-Icon--sizeS")
        .attr({
            "data-init": "quicktip",
            "data-quicktip-type": "error"
        });

    // register validator for generic multifield
    registry.register("foundation.validation.validator", {
        selector: ".coral-GenericMultiField",
        validate: function (el) {
            var $field = $(el).closest(".coral-Form-field"), items = $field.find(".coral-GenericMultiField-list li"), minElements = $field
                .data("minelements"), maxElements = $field.data("maxelements");

            // validate required attribute
            if ($field.adaptTo("foundation-field").isRequired() && items.length == 0) {
                return Granite.I18n.get("Please fill out this field.");
            }

            // validate min and max elements
            if ($field.adaptTo("foundation-field").isRequired() || items.length > 0) {
                // validate if minElements restriction is met
                if (items && !isNaN(minElements) && items.length < minElements) {
                    return Granite.I18n.get('At least {0} items must be created', minElements);
                }
                // validate if maxElements restriction is met
                if (items && !isNaN(maxElements) && items.length > maxElements) {
                    return Granite.I18n.get('At most {0} items can be created', maxElements);
                }
            }

            return null;
        },
        show: function (el, message, ctx) {
            var $field = $(el).closest(".coral-Form-field");
            $field.adaptTo("foundation-field").setInvalid(true);
            ctx.next();
        },
        clear: function (el, ctx) {
            var $field = $(el).closest(".coral-Form-field");
            $field.adaptTo("foundation-field").setInvalid(false);
            $field.siblings(".coral-Icon--alert").remove();
            ctx.next();
        }
    });

    // perform validation every time generic multifield changed
    $(document).on("change", ".coral-GenericMultiField", function() {
        performValidation($(this));
    });

})(window, Granite.$, CUI);
