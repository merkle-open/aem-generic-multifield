/**
 * @fileoverview Main entry point and bootstrap for the Merkle Generic Multifield.
 * Responsible for widget registration, Data API initialization, and validation binding.
 *
 * @param {jQuery} $ - The jQuery library.
 * @param {Merkle.GenericMultifield} namespace - The application namespace.
 */
(($, namespace) => {

    "use strict";

    /**
     * @type {typeof Merkle.GenericMultifield.Multifield}
     * @description Reference to the Multifield widget class.
     */
    const Multifield = namespace.Multifield;

    /**
     * @type {typeof Merkle.GenericMultifield.MultifieldHelper}
     * @description Reference to the utility helper containing constants and DOM selectors.
     */
    const MultifieldHelper = namespace.MultifieldHelper;

    /**
     * @type {typeof Merkle.GenericMultifield.MultifieldValidator}
     * @description Reference to the static validation utility class.
     */
    const MultifieldValidator = namespace.MultifieldValidator;

    /**
     * Orchestrates the initialization of the widget and its validation logic.
     *
     * @function init
     * @private
     */
    function init() {
        initMultifield();
        initValidator();
    }

    /**
     * Registers the widget with the Coral UI (CUI) registry and sets up
     * automatic instantiation via the Data API on 'content load'.
     * @function initMultifield
     * @private
     */
    function initMultifield() {
        // put Merkle.GenericMultifield on widget registry
        CUI.Widget.registry.register("genericmultifield", Multifield);

        // Data API
        if (CUI.options.dataAPI) {
            $(document).on("cui-contentloaded.data-api", function (e, data) {
                $(".coral-GenericMultifield[data-init~='generic-multifield']", e.target).genericMultifield();
                if (data && data._foundationcontentloaded) {
                    $(".coral-GenericMultifield[data-init~='generic-multifield']", e.target).trigger("change");
                }
            });
        }
    }

    /**
     * Registers Granite UI foundation validations and attaches change listeners
     * to trigger real-time validation feedback.
     *
     * @function initValidator
     * @private
     */
    function initValidator() {
        MultifieldValidator.registerFoundationValidations();

        $(document).on("change", MultifieldHelper.CONST.CORAL_GENERIC_MULTIFIELD_SELECTOR, function () {
            MultifieldValidator.performValidation($(this));
        });
    }

    init();

})(window.jQuery, window.Merkle.GenericMultifield);
