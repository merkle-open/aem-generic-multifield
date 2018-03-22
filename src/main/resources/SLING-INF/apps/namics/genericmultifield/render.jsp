<%
%><%@include file="/libs/granite/ui/global.jsp"%><%
%><%@page session="false"
		  import="com.adobe.granite.ui.components.AttrBuilder,
                  com.adobe.granite.ui.components.Config,
                  com.adobe.granite.ui.components.Tag,
                  org.osgi.service.cm.ConfigurationAdmin,
				  org.osgi.service.cm.Configuration"%><%

 	ConfigurationAdmin cfgAdmin = sling.getService(org.osgi.service.cm.ConfigurationAdmin.class);
	Configuration mergePickerConfig = cfgAdmin.getConfiguration("org.apache.sling.resourcemerger.picker.overriding", null);
	String mergeRoot = (String) mergePickerConfig.getProperties().get(org.apache.sling.resourcemerger.spi.MergedResourcePicker2.MERGE_ROOT);

	Config cfg = cmp.getConfig();

	Tag tag = cmp.consumeTag();
	AttrBuilder attrs = tag.getAttrs();

	attrs.addClass("coral-GenericMultiField");
	attrs.add("data-init","genericmultifield");
	attrs.add("id", cfg.get("id", String.class));
	attrs.addClass(cfg.get("class", String.class));
	attrs.addRel(cfg.get("rel", String.class));
	attrs.add("title", i18n.getVar(cfg.get("title", String.class)));
	attrs.add("data-mergeroot", mergeRoot);

	attrs.addOthers(cfg.getProperties(), "id", "rel", "class", "title", "fieldLabel", "fieldDescription", "storageWarningText", "renderReadOnly");


%>
<div <%= attrs.build() %>>
	<ol class="coral-GenericMultiField-list js-coral-GenericMultiField-list"></ol>
	<button type="button" class="js-coral-GenericMultiField-add coral-GenericMultiField-add coral-MinimalButton">
		<i class="coral-Icon coral-Icon--sizeS coral-Icon--addCircle coral-MinimalButton-icon"></i>
	</button>
</div>

<%-- markup for the item deletion warning dialog--%>
<div class="coral-Modal error genericmultifield-deleteitem-notice" style="z-index: 11000;">
	<div class="coral-Modal-header">
		<i class="coral-Modal-typeIcon coral-Icon coral-Icon--sizeS coral-Icon--alert"></i>
		<h2 class="coral-Modal-title coral-Heading coral-Heading--2"><%= i18n.get("Remove Item") %></h2>
		<button type="button" class="coral-MinimalButton coral-Modal-closeButton" title="Close" data-dismiss="modal">
			<i class="coral-Icon coral-Icon--sizeXS coral-Icon--close coral-MinimalButton-icon "></i></button>
	</div>
	<div class="coral-Modal-body">
		<p><%= i18n.get("Are you sure you want to delete this item?") %></p>
	</div>
	<div class="coral-Modal-footer">
	</div>
</div>


<%-- markup for the warning dialog "max number of elements reached"--%>
<div class="coral-Modal error genericmultifield-maxelements-notice" style="z-index: 11000;">
	<div class="coral-Modal-header">
		<i class="coral-Modal-typeIcon coral-Icon coral-Icon--sizeS coral-Icon--alert"></i>
		<h2 class="coral-Modal-title coral-Heading coral-Heading--2"><%= i18n.get("Maximum reached") %></h2>
		<button type="button" class="coral-MinimalButton coral-Modal-closeButton" title="Close" data-dismiss="modal">
			<i class="coral-Icon coral-Icon--sizeXS coral-Icon--close coral-MinimalButton-icon "></i></button>
	</div>
	<div class="coral-Modal-body">
		<p><%= i18n.get("Maximum number of items reached, you cannot add additional items.") %></p>
	</div>
	<div class="coral-Modal-footer">
	</div>
</div>

<%-- markup for the warning dialog "min number of elements reached"--%>
<div class="coral-Modal error genericmultifield-minelements-notice" style="z-index: 11000;">
	<div class="coral-Modal-header">
		<i class="coral-Modal-typeIcon coral-Icon coral-Icon--sizeS coral-Icon--alert"></i>
		<h2 class="coral-Modal-title coral-Heading coral-Heading--2"><%= i18n.get("Minimum reached") %></h2>
		<button type="button" class="coral-MinimalButton coral-Modal-closeButton" title="Close" data-dismiss="modal">
			<i class="coral-Icon coral-Icon--sizeXS coral-Icon--close coral-MinimalButton-icon "></i></button>
	</div>
	<div class="coral-Modal-body">
		<p><%= i18n.get("Minimum number of items reached, you cannot delete additional items.") %></p>
	</div>
	<div class="coral-Modal-footer">
	</div>
</div>

<ui:includeClientLib categories="cq.authoring.editor.hook"/>
