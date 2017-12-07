<%@page session="false"
        import="org.apache.commons.lang3.StringUtils,
                org.apache.sling.api.resource.Resource,
                org.apache.sling.api.SlingHttpServletRequest,
                com.adobe.granite.i18n.LocaleUtil,
                com.adobe.granite.ui.components.AttrBuilder,
                com.adobe.granite.ui.components.Config,
                com.adobe.granite.ui.components.Tag,
                com.adobe.granite.ui.components.Value,
                com.day.cq.wcm.api.Page" %>
<%
%>
<%@include file="/libs/granite/ui/global.jsp" %>
<%
    String dataPath = slingRequest.getRequestPathInfo().getSuffix();

    Config cfg = cmp.getConfig();

    String title = cfg.get("jcr:title", "");
    String mode = cfg.get("mode", String.class);
    Boolean returnToReferral = cfg.get("returnToReferral", false);

    Tag tag = cmp.consumeTag();

    AttrBuilder attrs = tag.getAttrs();

    attrs.addHref("action", dataPath.replace("_newitem_", "*"));
    attrs.add("enctype", cfg.get("enctype", String.class));
    attrs.add("method", "post");
    attrs.addHref("data-cq-dialog-pageeditor", slingRequest.getHeader("referer"));
    attrs.addClass("coral-Form coral-Form--vertical coral-Text cq-dialog cq-dialog-fullscreen foundation-form content foundation-layout-form item-dialog");
    attrs.add("data-foundation-form-ajax", true);

    if (mode != null) {
        attrs.addClass("foundation-layout-form-mode-" + mode);
    }

    if (returnToReferral) {
        attrs.add("data-cq-dialog-returntoreferral", true);
    }

    try {
        request.setAttribute(Value.CONTENTPATH_ATTRIBUTE, dataPath);

%><!DOCTYPE html>
<html class="cq-dialog-page coral-App" lang="<%= LocaleUtil.toRFC4646(request.getLocale()).toLowerCase() %>"
      data-i18n-dictionary-src="<%= request.getContextPath() %>/libs/cq/i18n/dict.{+locale}.json">
<head>
    <meta charset="utf-8">
    <title><%= outVar(xssAPI, i18n, title) %>
    </title>
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
    <meta name="X-UA-Compatible" content="chrome=1"/>
    <link rel="shortcut icon" href="<%= request.getContextPath() %>/libs/granite/core/content/login/favicon.ico">

    <ui:includeClientLib
            categories="<%= StringUtils.join(cfg.get("clientlibs", new String[] {"coralui2", "granite.ui.foundation", "granite.ui.foundation.admin", "cq.authoring.dialog"}), ",") %>"/>
    <ui:includeClientLib categories="<%= StringUtils.join(cfg.get("extraClientlibs", new String[0]), ",") %>"/>
</head>
<body class="coral--light">
<coral-dialog class="cq-Dialog" backdrop="none">
    <form <%= attrs.build() %>>
        <input type="hidden" name="_charset_" value="utf-8"/>
        <input type="hidden" name="./jcr:lastModified"/>
        <input type="hidden" name="./jcr:lastModifiedBy"/>
        <coral-dialog-header class="cq-dialog-header u-coral-clearFix">
            <%= outVar(xssAPI, i18n, title) %>
            <div class="cq-dialog-actions u-coral-pullRight">
                <button <%= getHelpAttrs(slingRequest, cfg, xssAPI, i18n).build() %>>
                    <i class="coral-Icon coral-Icon--helpCircle"></i>
                </button>
                <button type="button" class="coral-MinimalButton cq-dialog-header-action cq-dialog-cancel"
                        title="<%= i18n.get("Cancel")%>">
                    <i class="coral-Icon coral-Icon--close"></i>
                </button>
                <button class="coral-MinimalButton cq-dialog-header-action cq-dialog-submit"
                        title="<%= i18n.get("Done") %>">
                    <i class="coral-Icon coral-Icon--check"></i>
                </button>
            </div>
        </coral-dialog-header>
        <coral-dialog-content>
            <%

                AttrBuilder contentAttrs = new AttrBuilder(request, xssAPI);
                contentAttrs.addClass("cq-dialog-content");
                cmp.include(resource.getChild("content"), new Tag(contentAttrs));
            %>
        </coral-dialog-content>
    </form>
</coral-dialog>
</body>
    <%
} finally {
    request.removeAttribute(Value.CONTENTPATH_ATTRIBUTE);
}
%>
    <%!

private AttrBuilder getHelpAttrs(SlingHttpServletRequest req, Config cfg, XSSAPI xssAPI, I18n i18n) {
    String packageShareUrl = i18n.getVar("/crx/packageshare/index.html/packageshare/packages/public.html");
    String url = i18n.getVar("https://www.adobe.com/go/aem6_docs");

    AttrBuilder attrs = new AttrBuilder(req, xssAPI);
    attrs.add("type", "button");
    attrs.addClass("coral-MinimalButton cq-dialog-header-action cq-dialog-help");
    attrs.addHref("data-cq-dialog-help-href", url);
    attrs.addHref("data-cq-dialog-help-packageshare-href", packageShareUrl);
    attrs.add("data-cq-dialog-help-packageshare-prompt", packageShareUrl != null);
    attrs.add("title", i18n.get("Help"));

    return attrs;
}
%>
