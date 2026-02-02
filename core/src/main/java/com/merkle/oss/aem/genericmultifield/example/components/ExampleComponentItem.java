package com.merkle.oss.aem.genericmultifield.example.components;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ExampleComponentItem {

    @ValueMapValue
    private @NonNull String itemTitle;

    @ValueMapValue
    private @NonNull String itemText;

    @ValueMapValue
    private @Nullable String itemPath;

    @ChildResource
    private @Nullable ExampleImage image;

    @ValueMapValue
    private @Nullable String text;

    public @NonNull String getItemTitle() {
        return itemTitle;
    }

    public @NonNull String getItemText() {
        return itemText;
    }

    public @Nullable String getItemPath() {
        return itemPath;
    }

    public @Nullable ExampleImage getImage() {
        return image;
    }

    public @Nullable String getText() {
        return text;
    }

    public boolean isValid() {
        return StringUtils.isNoneBlank(getItemTitle(), getItemText());
    }

}
