<%
%>
<%@include file="/libs/granite/ui/global.jsp" %>
<%
%>
<%@page session="false"
        import="java.lang.reflect.Array,
                java.util.HashMap,
                org.apache.sling.api.resource.ValueMap,
                org.apache.sling.api.wrappers.ValueMapDecorator,
                com.adobe.granite.ui.components.Config,
                com.adobe.granite.ui.components.Field" %>
<%
    ValueMap vm = new ValueMapDecorator(new HashMap<String, Object>());

    // set non-empty string, otherwise the read only rendering will not work
    vm.put("value", "-");

    request.setAttribute(Field.class.getName(), vm);
%>