package com.merkle.oss.aem.genericmultifield.example.components;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ExampleComponentItem {

    @ValueMapValue
    private String itemTitle;

    @ValueMapValue
    private String itemText;

    @ValueMapValue
    private String itemPath;

    @ChildResource
    private ExampleImage image;

    @ValueMapValue
    private String text;

    public String getItemTitle() {
        return itemTitle;
    }

    public String getItemText() {
        return itemText;
    }

    public String getItemPath() {
        return itemPath;
    }

    public ExampleImage getImage() {
        return image;
    }

    public String getText() {
        return text;
    }

    public boolean isValid() {
        return StringUtils.isNoneBlank(getItemTitle(), getItemText());
    }

}
