/**
 * The Merkle.GenericMultiField class represents an editable list
 * of form fields for editing multi value properties.
 */
(function ($) {
    "use strict";

    var removeButton = "<button is=\"coral-button\" variant=\"minimal\" icon=\"delete\" size=\"S\" type=\"button\" class=\"js-coral-SpectrumMultiField-remove coral-SpectrumMultiField-remove\"></button>";
    var editButton = "<button is=\"coral-button\" variant=\"minimal\" icon=\"edit\" size=\"S\" type=\"button\" class=\"js-coral-SpectrumMultiField-edit coral-SpectrumMultiField-edit\"></button>";
    var moveButton = "<button is=\"coral-button\" variant=\"minimal\" icon=\"moveUpDown\" size=\"S\" type=\"button\" class=\"js-coral-SpectrumMultiField-move coral-SpectrumMultiField-move\"></button>";

    /**
     * The Merkle.GenericMultiField class represents an editable list
     * of form fields for editing multi value properties.
     *
     * @extends CUI.Widget
     */
    Merkle.GenericMultiField = new Class({

        toString: 'GenericMultiField',

        extend: CUI.Widget,

        /**
         * Creates a new Merkle.GenericMultiField.
         * @constructor
         * @param options object containing config properties
         */
        construct: function (options) {
            this.ui = $(window).adaptTo('foundation-ui');
            this.ol = this.$element.children("ol");

            // is needed for IE9 compatibility
            var opt = this.$element.get()[0];
            // get config properties
            this.itemDialog = (options.mergeroot || opt.getAttribute('data-mergeroot') || '/mnt/override') + (options.itemdialog || opt.getAttribute('data-itemdialog'));
            this.itemStorageNode = options.itemstoragenode || opt.getAttribute('data-itemstoragenode') || "items";
            this.itemNameProperty = options.itemnameproperty || opt.getAttribute('data-itemnameproperty') || "jcr:title";
            this.itemNameDisplayStrategy = options.itemnamedisplaystrategy || opt.getAttribute('data-itemnamedisplaystrategy');
            this.minElements = options.minelements || opt.getAttribute('data-minelements');
            this.maxElements = options.maxelements || opt.getAttribute('data-maxelements');
            this.readOnly = options.renderreadonly || opt.getAttribute('data-renderreadonly');

            // get the crx path of the current component from action attribute of the current form.
            this.crxPath = this.$element.parents("form").attr("action");

            if (this.readOnly) {
                this.$element.addClass("is-disabled");
                // add the "+" button for adding new items
                $(".coral-SpectrumMultiField-add", this.$element).attr("disabled", "disabled");
            } else {
                // add button listeners
                this._addListeners();
            }
            // get list elements
            this._updateList(false);
        },

        /**
         * Performs an ajax call to the storage node and updates the list entries.
         *
         * @param {Boolean} triggerEvent if 'change' event should be triggered.
         * @private
         */
        _updateList: function (triggerEvent) {
            var that = this;
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
                            var propertyValue;
                            if (that.itemNameProperty.indexOf('/') > -1) {
                                propertyValue = that.itemNameProperty.split('/');
                                var parent = data[key];
                                for (var i = 0; i < propertyValue.length - 1; i += 1) {
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
                            var li = that._createListEntry(key, propertyValue);
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
         * @private
         */
        _labelFromPage: function (key, targetPath) {
            var that = this;
            $.ajax({
                type: "GET",
                dataType: "json",
                async: false,
                url: targetPath + ".-1.json"
            }).done(function (data) {

                if (typeof data["jcr:content"] === 'object') {
                    var li = that._createListEntry(key, data["jcr:content"]["jcr:title"]);
                    li.appendTo(that.ol);
                }

            });
        },

        /**
         * Creates the markup for a single list entry.
         *
         * @param {String} key the name of the current item.
         * @param {String} label the label of the current item.
         * @private
         */
        _createListEntry: function (key, label) {
            var escapedLabel = $("<div/>").text(label).html();
            var labelWithKeyAsFallback = escapedLabel ? escapedLabel : key;
            var li = null;
            var liInner = null;
            li = $('<li>', {id: key, title: labelWithKeyAsFallback, class: "coral-GenericMultiField-listEntry"});
            liInner = $('<div>', {text: labelWithKeyAsFallback, class: "coral-GenericMultiField-label"});
            li.append(liInner);
            li.append($(removeButton));
            li.append(editButton);
            li.append(moveButton);
            if (this.readOnly) {
                $(".coral-SpectrumMultiField-remove", li).attr("disabled", "disabled");
                $(".coral-SpectrumMultiField-edit", li).attr("disabled", "disabled");
                $(".coral-SpectrumMultiField-move", li).attr("disabled", "disabled");
            }
            return li;
        },

        /**
         * Initializes listeners.
         * @private
         */
        _addListeners: function () {
            var that = this;

            this.$element.on("click", ".js-coral-SpectrumMultiField-add", function (e) {
                Merkle.Helper.addMarkup(Merkle.Helper.CONST.ADD_ITEM_WORKFLOW);
                e.preventDefault();
                e.stopPropagation();
                that._addNewItem();
            });

            this.$element.on("click", ".js-coral-SpectrumMultiField-remove", function (e) {
                var currentItem = $(this).closest("li");
                that._removeItem(currentItem);
            });

            this.$element.on("click", ".js-coral-SpectrumMultiField-edit", function (e) {
                var currentItem = $(this).closest("li");
                that._editItem(currentItem);
            });


            this.$element
                .fipo("taphold", "mousedown", ".js-coral-SpectrumMultiField-move", function (e) {
                    e.preventDefault();

                    var item = $(this).closest("li");
                    item.prevAll().addClass("drag-before");
                    item.nextAll().addClass("drag-after");

                    // Fix height of list element to avoid flickering of page
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
                if (event.key === 'Escape') {
                    if (Merkle.Helper.hasMarkup(Merkle.Helper.CONST.ADD_ITEM_WORKFLOW)) {
                        var dialog = $('body.' + Merkle.Helper.CONST.ADD_ITEM_WORKFLOW);
                        dialog.find('.cq-dialog-cancel').click();
                    }
                }
            }, true);

        },

        /**
         * Opens the edit dialog for a given item id.
         * If the item id is not defined, a empty dialog for a new item is loaded.
         *
         * @param {String} itemPath of the current item
         * @param {Function} cancelCallback on abort.
         * @private
         */
        _openEditDialog: function (itemPath, cancelCallback) {
            if (!itemPath) {
                throw new Error("Parameter 'itemPath' must be defined");
            }

            var that = this,
                path = this.itemDialog + ".html" + itemPath;

            var dialog = {
                getConfig: function () {
                    return {
                        src: path,
                        itemPath: itemPath,
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
                Merkle.GenericMultifieldDialogHandler.openDialog(dialog);
            } catch (error) {
                console.error(error);
                if ($.isFunction(cancelCallback)) {
                    cancelCallback();
                }
            }
        },

        /**
         * Edits an item by opening the item dialog.
         *
         * @param {Object} item List item to be edited.
         * @private
         */
        _editItem: function (item) {
            var path = this.crxPath + "/" + this.itemStorageNode + "/" + item.attr("id");
            this._openEditDialog(path);
        },

        /**
         * Adds a new item by opening the empty item dialog if maxElements is not reached.
         * Otherwise, a warning dialog is displayed.
         *
         * @private
         */
        _addNewItem: function () {
            var that = this;
            var currentElements = this.$element.find("li").length;

            if (!this.maxElements || (currentElements < this.maxElements)) {
                this._createNode(this.crxPath + "/" + this.itemStorageNode + "/*", function (path) {
                    that._openEditDialog(path, function (event, dialog) {
                        that._deleteNode(path, function () {
                            // call update list after successful deletion of node
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
         * @param {Object} item the list item to be deleted
         * @private
         */
        _removeItem: function (item) {
            var that = this,
                currentElements = this.$element.find("li").length;

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

            // remove item from DOM on successful callback
            function deleteItemCallback(path) {
                item.remove();
                that._triggerChangeEvent();
            }
        },

        /**
         * Performs drag and drop reordering and
         * executes a sling reordering request on crx items.
         *
         * @param {Object} item the dragging item.
         * @private
         */
        _reorder: function (item) {
            var before = this.ol.children(".drag-after").first();
            var after = this.ol.children(".drag-before").last();


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
         * Creates a preview view on drag and drop reordering action.
         *
         * @param {Event} e the event object.
         * @private
         */
        _reorderPreview: function (e) {
            var pos = this._pagePosition(e);
            this.ol.children(":not(.is-dragging)").each(function () {
                var el = $(this);
                var isAfter = pos.y < (el.offset().top + el.outerHeight() / 2);
                el.toggleClass("drag-after", isAfter);
                el.toggleClass("drag-before", !isAfter);
            });
        },

        /**
         * Gets the page position.
         *
         * @param {Event} e the event object.
         * @private
         */
        _pagePosition: function (e) {
            var touch = {};
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
         * Creates a new node at given path.
         *
         * @param {String} path of node to be deleted.
         * @param {Function} callback node that has been created.
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
                if ($.isFunction(callback)) {
                    if (data && data.path) {
                        callback(data.path);
                    }
                }
            });
        },

        /**
         * Deletes the node at given path.
         *
         * @param {String} path of node to be deleted.
         * @param {Function} callback node that has been created.
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
         * Triggers the change event with the DOM element as the source.
         *
         * @private
         */
        _triggerChangeEvent: function () {
            this.$element.trigger("change");
        }
    });

    // put Merkle.GenericMultiField on widget registry
    CUI.Widget.registry.register(" ", Merkle.GenericMultiField);

    // Data API
    if (CUI.options.dataAPI) {
        $(document).on("cui-contentloaded.data-api", function (e, data) {
            $(".coral-GenericMultiField[data-init~='genericmultifield']", e.target).genericMultiField();
            if (data && data._foundationcontentloaded) {
                $(".coral-GenericMultiField[data-init~='genericmultifield']", e.target).trigger("change");
            }
        });
    }
}(window.jQuery));