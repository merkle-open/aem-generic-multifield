package com.merkle.oss.aem.genericmultifield.example.components;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jspecify.annotations.Nullable;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ExampleImage {

    @ValueMapValue
    private @Nullable String title;

    @ValueMapValue
    private @Nullable String alt;

    @ValueMapValue
    private boolean isDecorativeImage;

    @ValueMapValue
    private @Nullable String fileReference;

    public @Nullable String getTitle() {
        return title;
    }

    public @Nullable String getAlt() {
        if (isDecorativeImage) {
            return StringUtils.EMPTY;
        }
        return alt;
    }

    public @Nullable String getSrc() {
        return fileReference;
    }

    public boolean isValid() {
        return StringUtils.isNotBlank(fileReference);
    }

}
