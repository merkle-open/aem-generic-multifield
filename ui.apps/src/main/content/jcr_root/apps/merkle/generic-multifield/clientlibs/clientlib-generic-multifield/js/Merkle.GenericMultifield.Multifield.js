/**
 * @fileoverview Main Multifield widget for the Merkle Generic Multifield.
 * Handles CRUD operations, drag-and-drop reordering, and AEM dialog integration.
 *
 *@dependency {object} global - The window object containing Granite and Coral APIs.
 *@dependency {jQuery} $ - The jQuery library for DOM manipulation.
 *@dependency {Merkle.GenericMultifield} namespace - The namespace object.
 */
((global, $, namespace) => {

    "use strict";

    /**
     * @type {typeof Merkle.GenericMultifield.MultifieldHelper}
     * @description Local reference to the static utility helper class.
     * @const
     */
    const MultifieldHelper = namespace.MultifieldHelper;

    /**
     * @type {typeof Merkle.GenericMultifield.DialogHandler}
     * @description Local reference to the dialog handler class.
     * @const
     */
    const DialogHandler = namespace.DialogHandler;

    /**
     * Represents an editable list of form fields for editing multi-value properties in AEM.
     * Inherits from CUI.Widget to integrate with the Coral UI framework.
     *
     * @class Multifield
     * @extends CUI.Widget
     * @memberof Merkle.GenericMultifield
     */
    namespace.Multifield = new Class({

        toString: 'GenericMultifield',

        extend: CUI.Widget,

        /**
         * Initializes the GenericMultifield component.
         *
         * @constructor
         * @param {Object} options - Configuration properties for the widget.
         * @param {string} [options.mergeroot] - Root path for dialog merging.
         * @param {string} [options.itemdialog] - Path to the item dialog resource.
         * @param {string} [options.itemstoragenode="items"] - Name of the JCR node where items are stored.
         * @param {string} [options.itemnameproperty="jcr:title"] - Property used for display labels.
         * @param {number} [options.minelements] - Minimum required number of items.
         * @param {number} [options.maxelements] - Maximum allowed number of items.
         * @param {boolean} [options.allowitemcopy=false] - Whether the copy functionality is enabled.
         * @throws {Error} Throws an error if the underlying DOM element is not found.
         */
        construct: function (options) {
            this.ui = $(global).adaptTo('foundation-ui');
            this.ol = this.$element.children("ol");

            // is needed for IE9 compatibility
            const opt = this.$element.get()[0];
            if (!opt) {
                throw new Error('Controlled error thrown on purpose!');
            }

            // Configuration properties initialization
            this.itemDialog = (options.mergeroot || opt.getAttribute('data-mergeroot') || '/mnt/override') + (options.itemdialog || opt.getAttribute('data-itemdialog'));
            this.itemStorageNode = options.itemstoragenode || opt.getAttribute('data-itemstoragenode') || "items";
            this.itemNameProperty = options.itemnameproperty || opt.getAttribute('data-itemnameproperty') || "jcr:title";
            this.itemNameDisplayStrategy = options.itemnamedisplaystrategy || opt.getAttribute('data-itemnamedisplaystrategy');
            this.minElements = options.minelements || opt.getAttribute('data-minelements');
            this.maxElements = options.maxelements || opt.getAttribute('data-maxelements');
            this.allowItemCopy = options.allowitemcopy || opt.getAttribute('data-allowitemcopy') || false;

            // get the crx path of the current component from the action or data-formid (metadataeditor) attribute of the current form.
            this.crxPath = this.$element.parents("form").attr("action") || this.$element.parents("form").attr("data-formid");

            this._checkAndReinitializeForSmallerScreens();
            this._addListeners();
            this._updateList(false);
        },

        /**
         * Re-initializes the widget for touch devices or smaller viewports to ensure UX consistency.
         *
         * @private
         */
        _checkAndReinitializeForSmallerScreens: function () {
            const BREAKPOINT = 1024;

            if (global.innerWidth >= BREAKPOINT) {
                return;
            }

            $(document).one('foundation-contentloaded', function (e) {
                $(e.target).find('.coral-Form-field.coral-GenericMultifield').each(function () {
                    new namespace.Multifield();
                });
            });
        },

        /**
         * Performs an ajax call to the storage node and updates the list entries.
         *
         * @param {boolean} triggerEvent - If true, triggers the 'change' event after the update.
         * @private
         */
        _updateList: function (triggerEvent) {
            const that = this;

            $.ajax({
                type: "GET",
                dataType: "json",
                url: that.crxPath + "/" + that.itemStorageNode + ".-1.json"
            }).done(function (data) {
                that.ol.empty();
                $.each(data, function (key) {
                    if (typeof data[key] === 'object' && !Array.isArray(data[key]) && data[key] !== undefined && data[key]["jcr:primaryType"] !== undefined
                        && data[key]["sling:resourceType"] !== "wcm/msm/components/ghost") {

                        if (that.itemNameDisplayStrategy === "pageTitle") {
                            //use the jcr:title from a page
                            that._labelFromPage(key, data[key][that.itemNameProperty]);
                        } else {
                            let propertyValue;

                            if (that.itemNameProperty.indexOf('/') > -1) {
                                propertyValue = that.itemNameProperty.split('/');
                                let parent = data[key];
                                for (let i = 0; i < propertyValue.length - 1; i += 1) {
                                    parent = parent[propertyValue[i]];
                                }

                                if (parent !== undefined) {
                                    propertyValue = parent[propertyValue[propertyValue.length - 1]];
                                } else {
                                    propertyValue = key;
                                }
                            } else {
                                propertyValue = data[key][that.itemNameProperty];
                            }

                            const li = that._createListEntry(key, propertyValue);
                            li.appendTo(that.ol);
                        }

                    }
                });
                // trigger change event on update of items
                if (triggerEvent === true) {
                    that._triggerChangeEvent();
                }
            });
        },

        /**
         * Resolves a display label by fetching the jcr:title of a referenced page.
         *
         * @param {string} key - The JCR node name.
         * @param {string} targetPath - The path to the referenced page.
         * @private
         */
        _labelFromPage: function (key, targetPath) {
            const that = this;

            $.ajax({
                type: "GET",
                dataType: "json",
                async: false,
                url: targetPath + ".-1.json"
            }).done(function (data) {
                if (typeof data["jcr:content"] === 'object') {
                    const li = that._createListEntry(key, data["jcr:content"]["jcr:title"]);
                    li.appendTo(that.ol);
                }

            });
        },

        /**
         * Generates the HTML markup for a multifield list item including action buttons.
         *
         * @param {string} key - The JCR node name of the item.
         * @param {string} label - The text to display in the list entry.
         * @returns {jQuery} The jQuery-wrapped list item element.
         * @private
         */
        _createListEntry: function (key, label) {
            const displayLabel = label?.trim() || key;
            const isCopyAllowed = String(this.allowItemCopy).toLowerCase() === 'true';

            const getButton = (type, icon) => `
                <button is="coral-button" variant="minimal" icon="${icon}" size="S" type="button" 
                class="js-coral-SpectrumMultiField-${type} coral-SpectrumMultiField-${type}"></button>
            `;

            const liContent = `
                <div class="coral-GenericMultifield-label">${$('<div/>').text(displayLabel).html()}</div>
                ${getButton('remove', 'delete')}
                ${getButton('edit', 'edit')}
                ${getButton('move', 'moveUpDown')}
                ${isCopyAllowed ? getButton('copy', 'copy') : ''}
                `;

            return $('<li>', {
                id: key,
                title: displayLabel,
                class: "coral-GenericMultifield-listEntry"
            }).html(liContent);
        },

        /**
         * Attaches event listeners for CRUD actions and drag-and-drop reordering.
         *
         * @private
         */
        _addListeners: function () {
            const that = this;

            this.$element.on("click", ".js-coral-SpectrumMultiField-add", function (e) {
                MultifieldHelper.addMarkup(MultifieldHelper.CONST.ADD_ITEM_WORKFLOW);
                e.preventDefault();
                e.stopPropagation();
                that._addNewItem();
            });

            this.$element.on("click", ".js-coral-SpectrumMultiField-remove", function (e) {
                const currentItem = $(this).closest("li");
                that._removeItem(currentItem);
            });

            this.$element.on("click", ".js-coral-SpectrumMultiField-edit", function (e) {
                const currentItem = $(this).closest("li");
                that._editItem(currentItem);
            });

            this.$element.on("click", ".js-coral-SpectrumMultiField-copy", function (e) {
                const currentItem = $(this).closest("li");
                that._copyItem(currentItem);
            });

            this.$element
                .fipo("taphold", "mousedown", ".js-coral-SpectrumMultiField-move", function (e) {
                    e.preventDefault();

                    const item = $(this).closest("li");
                    item.prevAll().addClass("drag-before");
                    item.nextAll().addClass("drag-after");

                    // Fix the height of a list element to avoid flickering of the page
                    that.ol.css({height: that.ol.height() + $(e.item).height() + "px"});
                    new CUI.DragAction(e, that.$element, item, [that.ol], "vertical");
                })
                .on("dragenter", function (e) {
                    that.ol.addClass("drag-over");
                    that._reorderPreview(e);
                })
                .on("dragover", function (e) {
                    that._reorderPreview(e);
                })
                .on("dragleave", function (e) {
                    that.ol.removeClass("drag-over").children().removeClass("drag-before drag-after");
                })
                .on("drop", function (e) {
                    that._reorder($(e.item));
                    that.ol.children().removeClass("drag-before drag-after");
                })
                .on("dragend", function (e) {
                    that.ol.css({height: ""});
                });

            document.addEventListener('keydown', function (event) {
                if (event.key === 'Escape' && MultifieldHelper.hasMarkup(MultifieldHelper.CONST.ADD_ITEM_WORKFLOW)) {
                    const dialog = $('body.' + MultifieldHelper.CONST.ADD_ITEM_WORKFLOW);
                    dialog.find('.cq-dialog-cancel').click();
                }
            }, true);

        },

        /**
         * Initiates the copy process for a specific item.
         *
         * @param {jQuery} item - The list item jQuery object to be copied.
         * @private
         */
        _copyItem: function (item) {
            const that = this;
            const currentElements = this.$element.find("li").length;

            if (!this.maxElements || (currentElements < this.maxElements)) {

                this.ui.prompt(Granite.I18n.get("Copy Item"), Granite.I18n.get("Are you sure you want to copy this item?", this.minElements), "info",
                    [{text: Granite.I18n.get("Cancel")},
                        {
                            text: Granite.I18n.get("Copy"),
                            primary: true,
                            handler: function () {
                                const sourcePath = that.crxPath + "/" + that.itemStorageNode + "/" + item.attr("id");
                                that._copyNode(sourcePath, function (copiedPath) {
                                    // Refresh the list to show the newly copied item
                                    that._updateList(true);
                                });
                            }
                        }]);
            } else {
                this.ui.alert(Granite.I18n.get("Maximum reached"), Granite.I18n.get("Maximum number of {0} item(s) reached, you cannot add any additional items.", this.maxElements), "warning");
            }
        },

        /**
         * Loads and displays the edit dialog for an item resource.
         *
         * @param {string} itemPath - CRX path of the current item.
         * @param {Function} [cancelCallback] - Function to execute if the dialog is canceled.
         * @throws {Error} Throws error if itemPath is not provided.
         * @private
         */
        _openEditDialog: function (itemPath, cancelCallback) {
            if (!itemPath) {
                throw new Error("Parameter 'itemPath' must be defined");
            }

            const that = this;
            const path = this.itemDialog + ".html" + itemPath;

            const dialog = {
                getConfig: function () {
                    return {
                        src: path,
                        itemPath: MultifieldHelper.replaceWhiteSpace(itemPath),
                        loadingMode: "auto",
                        layout: "auto",
                        isGenericMultifield: true
                    };
                },
                getRequestData: function () {
                    return {};
                },
                onSuccess: function () {
                    that._updateList(true);
                    return $.Deferred().promise();
                },
                onCancel: cancelCallback
            }
            try {
                const dialogHandler = new DialogHandler();
                dialogHandler.openDialog(dialog);
            } catch (error) {
                console.error(error);
                if ($.isFunction(cancelCallback)) {
                    cancelCallback();
                }
            }
        },

        /**
         * Triggers the edit workflow for an existing list item.
         *
         * @param {jQuery} item - The list item jQuery object to be edited.
         * @private
         */
        _editItem: function (item) {
            const path = this.crxPath + "/" + this.itemStorageNode + "/" + item.attr("id");
            this._openEditDialog(path, null);
        },

        /**
         * Adds a new item by opening the empty item dialog if maxElements is not reached.
         * Otherwise, a warning dialog is displayed.
         *
         * @private
         */
        _addNewItem: function () {
            const that = this;
            const currentElements = this.$element.find("li").length;

            if (!this.maxElements || (currentElements < this.maxElements)) {
                this._createNode(this.crxPath + "/" + this.itemStorageNode + "/*", function (path) {
                    that._openEditDialog(path, function (event, dialog) {
                        that._deleteNode(path, function () {
                            // call update list after successful deletion of a node
                            that._updateList(true);
                        });
                    });
                });
            } else {
                this.ui.alert(Granite.I18n.get("Maximum reached"), Granite.I18n.get("Maximum number of {0} item(s) reached, you cannot add any additional items.", this.maxElements), "warning");
            }
        },

        /**
         * Removes an item from the list.
         * Shows a warning dialog ('Cancel','Delete') before the delete action is executed.
         *
         * @param {jQuery} item - The list item jQuery object to be deleted.
         * @private
         */
        _removeItem: function (item) {
            const that = this
            const currentElements = this.$element.find("li").length;

            if (!this.minElements || (currentElements > this.minElements)) {
                this.ui.prompt(Granite.I18n.get("Remove Item"), Granite.I18n.get("Are you sure you want to delete this item?", this.minElements), "warning",
                    [{text: Granite.I18n.get("Cancel")},
                        {
                            text: Granite.I18n.get("Delete"),
                            warning: true,
                            handler: function () {
                                if (currentElements === 1) {
                                    // delete whole itemStorageNode if last item is being removed
                                    that._deleteNode(that.crxPath + "/" + that.itemStorageNode, deleteItemCallback);
                                } else {
                                    that._deleteNode(that.crxPath + "/" + that.itemStorageNode + "/" + item.attr("id"), deleteItemCallback);
                                }
                            }
                        }]);
            } else {
                this.ui.alert(Granite.I18n.get("Minimum reached"), Granite.I18n.get("Minimum number of {0} item(s) reached, you cannot delete any additional items.", this.minElements), "warning");
            }

            // remove item from DOM on a successful callback
            function deleteItemCallback(path) {
                item.remove();
                that._triggerChangeEvent();
            }
        },

        /**
         * Performs drag and drop reordering and
         * executes a sling reordering request on crx items.
         *
         * @param {jQuery} item - The jQuery object of the item being dragged.
         * @private
         */
        _reorder: function (item) {
            const before = this.ol.children(".drag-after").first();
            const after = this.ol.children(".drag-before").last();

            if (before.length > 0) {
                item.insertBefore(before);
                $.ajax({
                    type: "POST",
                    data: ":order=before " + before.attr("id"),
                    url: this.crxPath + "/" + this.itemStorageNode + "/" + item.attr("id")
                });
            } else if (after.length > 0) {
                item.insertAfter(after);
                $.ajax({
                    type: "POST",
                    data: ":order=after " + after.attr("id"),
                    url: this.crxPath + "/" + this.itemStorageNode + "/" + item.attr("id")
                });

            }
        },

        /**
         * Performs a Sling copy operation on the specified JCR node.
         *
         * @param {string} path - CRX path of the node to copy.
         * @param {Function} callback - Success callback receiving the new destination path.
         * @private
         */
        _copyNode: function (path, callback) {
            const that = this;
            const timestamp = Date.now();
            let destinationPath = that.crxPath + "/" + that.itemStorageNode + "/copy_" + timestamp;
            destinationPath = destinationPath.replace("_jcr_content", "jcr:content");

            $.ajax({
                type: "POST",
                data: ":operation=copy&:dest=" + destinationPath,
                url: path
            }).done(function (data) {
                if ($.isFunction(callback)) {
                    callback(destinationPath);
                }
            }).fail(function (xhr, status, error) {
                console.error("Copy operation failed:", error);
                that.ui.alert(Granite.I18n.get("Copy Error"), Granite.I18n.get("Failed to copy the item. Please try again."), "error");
            });
        },

        /**
         * Visualizes the potential drop position during a drag-and-drop operation.
         *
         * @param {Event} e - The native browser event object.
         * @private
         */
        _reorderPreview: function (e) {
            const pos = this._pagePosition(e);
            this.ol.children(":not(.is-dragging)").each(function () {
                var el = $(this);
                var isAfter = pos.y < (el.offset().top + el.outerHeight() / 2);
                el.toggleClass("drag-after", isAfter);
                el.toggleClass("drag-before", !isAfter);
            });
        },

        /**
         * Calculates the cursor/touch coordinates relative to the page.
         *
         * @param {Event|jQuery.Event} e - The event object.
         * @returns {Object} An object containing x and y coordinates.
         * @private
         */
        _pagePosition: function (e) {
            let touch = {};
            if (e.originalEvent) {
                var o = e.originalEvent;
                if (o.changedTouches && o.changedTouches.length > 0) {
                    touch = o.changedTouches[0];
                }
                if (o.touches && o.touches.length > 0) {
                    touch = o.touches[0];
                }
            }

            return {
                x: touch.pageX || e.pageX,
                y: touch.pageY || e.pageY
            };
        },

        /**
         * Creates a new JCR node at the specified path using a Sling POST request.
         *
         * @param {string} path - The destination JCR path.
         * @param {Function} callback - Success callback receiving the created node's path.
         * @private
         */
        _createNode: function (path, callback) {
            $.ajax({
                type: "POST",
                headers: {
                    Accept: "application/json,**/**;q=0.9"
                },
                url: path
            }).done(function (data) {
                if ($.isFunction(callback) && data && data.path) {
                    callback(data.path);
                }
            });
        },

        /**
         * Deletes a JCR node at the specified path using a Sling POST request.
         *
         * @param {string} path - The JCR path to delete.
         * @param {Function} callback - Success callback.
         * @private
         */
        _deleteNode: function (path, callback) {
            $.ajax({
                type: "POST",
                data: ":operation=delete",
                url: path
            }).done(function (data) {
                if ($.isFunction(callback)) {
                    callback(path);
                }
            });
        },

        /**
         * Dispatches a 'change' event on the widget's root element.
         *
         * @private
         */
        _triggerChangeEvent: function () {
            this.$element.trigger("change");
        }
    });

})(window, window.jQuery, window.Merkle.GenericMultifield);
