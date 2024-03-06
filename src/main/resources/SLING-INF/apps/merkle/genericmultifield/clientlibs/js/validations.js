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

    // perform validation every time generic multi-field changed
    $(document).on("change", ".coral-GenericMultiField", function () {
        _performValidation($(this));
    });

})(window, Granite.$, CUI);
