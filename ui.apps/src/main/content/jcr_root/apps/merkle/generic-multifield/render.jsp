<%
%>
<%@include file="/libs/granite/ui/global.jsp" %>
<%
%>
<%@page session="false"
        import="com.adobe.granite.ui.components.AttrBuilder,
                com.adobe.granite.ui.components.Config,
                com.adobe.granite.ui.components.Tag,
                org.osgi.service.cm.Configuration,
                org.osgi.service.cm.ConfigurationAdmin" %>
<%
    final ConfigurationAdmin cfgAdmin = sling.getService(org.osgi.service.cm.ConfigurationAdmin.class);
    final Configuration mergePickerConfig = cfgAdmin.getConfiguration("org.apache.sling.resourcemerger.picker.overriding", null);
    final String mergeRoot = (String) mergePickerConfig.getProperties().get(org.apache.sling.resourcemerger.spi.MergedResourcePicker2.MERGE_ROOT);

    final Config cfg = cmp.getConfig();
    final Tag tag = cmp.consumeTag();
    final AttrBuilder attrs = tag.getAttrs();

    attrs.addClass("coral-GenericMultifield");
    attrs.add("data-init", "generic-multifield");
    attrs.add("id", cfg.get("id", String.class));
    attrs.addClass(cfg.get("class", String.class));
    attrs.addRel(cfg.get("rel", String.class));
    attrs.add("title", i18n.getVar(cfg.get("title", String.class)));
    attrs.add("data-mergeroot", mergeRoot);
    if (cfg.get("required", false)) {
        attrs.add("aria-required", true);
    }

    attrs.addOthers(cfg.getProperties(), "id", "rel", "class", "title", "fieldLabel", "fieldDescription", "storageWarningText", "renderReadOnly", "required");
%>

<div <%= attrs.build() %>>
    <ol class="coral-GenericMultifield-list js-coral-GenericMultifield-list"></ol>
    <button is="coral-button" icon="add"  size="M" class="js-coral-SpectrumMultiField-add coral-SpectrumMultiField-add"></button>
</div>

<ui:includeClientLib categories="cq.authoring.editor.hook"/>
