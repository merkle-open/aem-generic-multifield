/**
 * @fileoverview Form validation registration for the Generic Multifield.
 * Registers foundation-registry adapters and validators to handle field validation in Granite UI forms.
 *
 * @dependency {window} window - The global window object.
 * @dependency {jQuery} $ - The jQuery library.
 * @dependency {Merkle.GenericMultifield} namespace - The namespace object.
 */

((window, $, namespace) => {

    "use strict";

    /**
     * @type {typeof Merkle.GenericMultifield.MultifieldHelper}
     * @description Local reference to the static utility helper class.
     * @const
     */
    const MultifieldHelper = namespace.MultifieldHelper;

    /**
     * @class MultifieldValidator
     * @classdesc Static utility class providing validation registration and helper methods for the Generic Multifield.
     * This class cannot be instantiated.
     * @memberof Merkle.GenericMultifield
     */
    class MultifieldValidator {

        /**
         * @constructor
         * @throws {Error} Throws an error if an attempt is made to instantiate this class.
         * @private
         */
        constructor() {
            throw new Error("Cannot instantiate static utility class MultifieldValidator.");
        }


        /**
         * Triggers the foundation validation API on a specific multifield element.
         * @param {jQuery} $multifield - The jQuery-wrapped multifield element.
         * @static
         */
        static performValidation($multifield) {
            const api = $multifield.adaptTo("foundation-validation");
            if (api) {
                api.checkValidity();
                api.updateUI();
            }
        }

        static registerFoundationValidations() {
            /**
             * @type {Object}
             * @description The global Granite foundation registry for UI extensions.
             */
            const registry = $(window).adaptTo("foundation-registry");

            /**
             * Register the foundation-field adapter for Generic Multifield.
             * This allows the multifield to be treated as a standard form field by Granite APIs,
             * providing methods for state management like isRequired, setInvalid, etc.
             */
            registry.register("foundation.adapters", {
                type: "foundation-field",
                selector: MultifieldHelper.CONST.CORAL_GENERIC_MULTIFIELD_SELECTOR,
                adapter: function (el) {
                    const $el = $(el);
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

            /**
             * Define the selection criteria for foundation validation.
             */
            registry.register("foundation.validation.selector", {
                submittable: MultifieldHelper.CONST.CORAL_GENERIC_MULTIFIELD_SELECTOR,
                candidate: ".coral-GenericMultifield:not([disabled]):not([data-renderreadonly=true])",
                exclusion: ".coral-GenericMultifield *"
            });

            /**
             * Register the validator for Generic Multifield.
             * Handles three main scenarios:
             * 1. Required field with zero items.
             * 2. Minimum number of elements constraint.
             * 3. Maximum number of elements constraint.
             */
            registry.register("foundation.validation.validator", {
                selector: MultifieldHelper.CONST.CORAL_GENERIC_MULTIFIELD_SELECTOR,

                /**
                 * Validation logic.
                 *
                 * @param {HTMLElement} el - The multifield element to validate.
                 * @returns {string|null} Error message if invalid, null if valid.
                 */
                validate: function (el) {
                    const $field = $(el).closest(".coral-Form-field");
                    const items = $field.find(".coral-GenericMultifield-list li");
                    const minElements = $field.data("minelements");
                    const maxElements = $field.data("maxelements");

                    // validate required attribute
                    if ($field.adaptTo("foundation-field").isRequired() && items.length === 0) {
                        return Granite.I18n.get(MultifieldHelper.CONST.ERROR_MESSAGE_REQUIRED);

                    }

                    // validate min and max elements (only if the field is required)
                    if ($field.adaptTo("foundation-field").isRequired()) {
                        // validate if minElements restriction is met
                        if (items && !isNaN(minElements) && items.length < minElements) {
                            return Granite.I18n.get(MultifieldHelper.CONST.ERROR_MESSAGE_MIN, minElements);
                        }
                        // validate if maxElements restriction is met
                        if (items && !isNaN(maxElements) && items.length > maxElements) {
                            return Granite.I18n.get(MultifieldHelper.CONST.ERROR_MESSAGE_MAX, maxElements);
                        }
                    }

                    return null;
                },

                /**
                 * UI logic for displaying error states.
                 *
                 * @param {HTMLElement} el - The field element.
                 * @param {string} message - The error message.
                 * @param {Object} ctx - The foundation validation context.
                 */
                show: function (el, message, ctx) {
                    const $field = $(el).closest(".coral-Form-field");
                    $field.adaptTo("foundation-field").setInvalid(true);

                    setTimeout(function () {
                        $field.siblings(".coral-Form-errorlabel").each(function (index, element) {
                            if (index > 0) {
                                $(element).remove();
                            }
                        });
                        $field.siblings(".coral-Form-fielderror").each(function (index, element) {
                            if (index > 0) {
                                $(element).remove();
                            }
                        });
                    }, 200);

                    ctx.next();
                },

                /**
                 * UI logic for clearing error states.
                 *
                 * @param {HTMLElement} el - The field element.
                 * @param {Object} ctx - The foundation validation context.
                 */
                clear: function (el, ctx) {
                    const $field = $(el).closest(".coral-Form-field");
                    $field.adaptTo("foundation-field").setInvalid(false);
                    $field.siblings(".coral-Form-fielderror").remove();
                    $field.siblings(".coral-Form-errorlabel").remove();
                    ctx.next();
                }

            });
        }
    }

    /**
     * @memberof Merkle.GenericMultifield
     * @type {typeof MultifieldValidator}
     * @description Exposes the static utility class {@link MultifieldValidator} containing validation registration and helper methods.
     */
    namespace.MultifieldValidator = MultifieldValidator;

})(window, window.jQuery, window.Merkle.GenericMultifield);
