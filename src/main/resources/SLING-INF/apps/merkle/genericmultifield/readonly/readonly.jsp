<%
%>
<%@include file="/libs/granite/ui/global.jsp" %>
<%
%>
<%@page session="false"
        import="com.adobe.granite.ui.components.AttrBuilder,
                com.adobe.granite.ui.components.Config,
                com.adobe.granite.ui.components.Tag" %>
<%
    Config cfg = cmp.getConfig();

    Tag tag = cmp.consumeTag();
    AttrBuilder attrs = tag.getAttrs();

    attrs.addClass("coral-GenericMultifield");
    attrs.add("data-init", "genericmultifield");
    attrs.add("id", cfg.get("id", String.class));
    attrs.addClass(cfg.get("class", String.class));
    attrs.addRel(cfg.get("rel", String.class));
    attrs.add("title", i18n.getVar(cfg.get("title", String.class)));

    attrs.addOthers(cfg.getProperties(), "id", "rel", "class", "title", "fieldLabel", "fieldDescription");

    String fieldLabel = cfg.get("fieldLabel", "");
%>

<div <%= attrs.build() %>>
    <label class="coral-Form-fieldlabel"><%= outVar(xssAPI, i18n, fieldLabel) %></label>
    <ol class="coral-GenericMultifield-list js-coral-GenericMultifield-list coral-List--minimal"></ol>
</div>