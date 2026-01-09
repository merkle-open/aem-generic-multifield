<%
%>
<%@include file="/libs/granite/ui/global.jsp" %>
<%
%>
<%@page session="false"
        import="com.adobe.granite.ui.components.Field,
                org.apache.sling.api.resource.ValueMap,
                org.apache.sling.api.wrappers.ValueMapDecorator,
                java.util.HashMap" %>
<%
    final ValueMap vm = new ValueMapDecorator(new HashMap<String, Object>());

    // set non-empty string, otherwise the read-only rendering will not work
    vm.put("value", "-");

    request.setAttribute(Field.class.getName(), vm);
%>
