package com.merkle.oss.aem.genericmultifield.example.components;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ExampleImage {

    @ValueMapValue
    private String title;

    @ValueMapValue
    private String alt;

    @ValueMapValue
    private boolean isDecorativeImage;

    @ValueMapValue
    private String fileReference;

    public String getTitle() {
        return title;
    }

    public String getAlt() {
        if (isDecorativeImage) {
            return StringUtils.EMPTY;
        }
        return alt;
    }

    public String getSrc() {
        return fileReference;
    }

    public boolean isValid() {
        return StringUtils.isNotBlank(fileReference);
    }

}
