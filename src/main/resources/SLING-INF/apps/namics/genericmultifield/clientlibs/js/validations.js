/**
 * Validates the generic multi-field's minimum and maximum number of elements
 * restriction.
 */

(function (window, $, CUI) {
    "use strict";

    /**
     * Performs the validation of the generic multi-field.
     *
     * @param {Object} multiField to perform validation on.
     * @private
     */
    function _performValidation(multiField) {
        var api = multiField.adaptTo("foundation-validation");
        if (api) {
            api.checkValidity();
            api.updateUI();
        }
    }

    // get global foundation registry
    var registry = $(window).adaptTo("foundation-registry");

    // register adapter for generic multi-field
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

    // register selector for generic multi-field
    registry.register("foundation.validation.selector", {
        submittable: ".coral-GenericMultiField",
        candidate: ".coral-GenericMultiField:not([disabled]):not([data-renderreadonly=true])",
        exclusion: ".coral-GenericMultiField *"
    });

    // register validator for generic multi-field
    registry.register("foundation.validation.validator", {
        selector: ".coral-GenericMultiField",
        validate: function (el) {
            var $field = $(el).closest(".coral-Form-field"), items = $field.find(".coral-GenericMultiField-list li"),
                minElements = $field.data("minelements"), maxElements = $field.data("maxelements");

            // validate required attribute
            if ($field.adaptTo("foundation-field").isRequired() && items.length === 0) {
                return Granite.I18n.get("Please fill out this field.");
            }

            // validate min and max elements (only if field is required)
            if ($field.adaptTo("foundation-field").isRequired()) {
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

    // perform validation every time generic multi-field changed
    $(document).on("change", ".coral-GenericMultiField", function () {
        _performValidation($(this));
    });

})(window, Granite.$, CUI);
